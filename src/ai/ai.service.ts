import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as https from 'https';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.logger.log(`OpenAI API Key loaded: ${apiKey ? `...${apiKey.slice(-4)}` : 'Not found'}`);

    // Crear un agente HTTPS personalizado para resolver problemas de conexión y regionales
    const httpsAgent = new https.Agent({
      keepAlive: true,
      keepAliveMsecs: 30000,
      maxSockets: 50,
      maxFreeSockets: 10,
      timeout: 60000,
      rejectUnauthorized: true,
    });

    this.openai = new OpenAI({
      apiKey: apiKey,
      maxRetries: 3, // Permitir algunos reintentos para errores temporales
      timeout: 60000, // 60 segundos
      httpAgent: httpsAgent,
      defaultHeaders: {
        'User-Agent': 'SysMedic-AI-Assistant/1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Agregar configuración adicional para bypass regional
      baseURL: 'https://api.openai.com/v1', // Usar URL explícita
    });
  }

  /**
   * Transcribe un archivo de audio usando el modelo Whisper para consultas médicas.
   * @param audioBuffer Buffer del archivo de audio
   * @param language Idioma del audio (por defecto español)
   * @returns El texto transcrito
   */
  async transcribeAudio(audioBuffer: Buffer, language: string = 'es'): Promise<string> {
    try {
      this.logger.log('Iniciando transcripción de audio con Whisper...');
      this.logger.log(`Idioma: ${language}, Tamaño del archivo: ${audioBuffer.length} bytes`);
      
      // Crear un Blob-like object para OpenAI usando el buffer directamente
      const audioFile = new Blob([audioBuffer], { type: 'audio/webm' }) as any;
      audioFile.name = 'audio.webm';
      
      const response = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: language, // 'es' para español
        response_format: 'text',
        temperature: 0.1, // Baja temperatura para mayor precisión
      });
      
      this.logger.log('Transcripción completada exitosamente');
      this.logger.log(`Texto transcrito: ${response.substring(0, 100)}...`);
      
      return response;
      
    } catch (error) {
      this.logger.error('Error al transcribir audio:', error);
      
      // Manejo específico de errores de Whisper
      if (error.status === 400) {
        this.logger.error('Error 400: Formato de audio no válido o archivo corrupto');
        throw new Error('El archivo de audio no es válido o está corrupto. Por favor, intenta con otro archivo.');
      }
      
      if (error.status === 413) {
        this.logger.error('Error 413: Archivo de audio demasiado grande');
        throw new Error('El archivo de audio es demasiado grande. El límite es de 25MB.');
      }
      
      // Error genérico
      this.logger.error('Error genérico al transcribir audio:', error.message);
      throw new Error('Error al transcribir audio: ' + (error.message || 'Error desconocido'));
    }
  }

  /**
   * Traduce un texto a un idioma específico usando un modelo GPT.
   * @param text El texto a traducir.
   * @param targetLanguage El idioma de destino (ej. 'English', 'French').
   * @returns El texto traducido.
   */
  async translateText(text: string, targetLanguage: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o', // O 'gpt-3.5-turbo' para una opción más rápida y económica
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the user's text to ${targetLanguage}. Output only the translated text and nothing else.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.1,
    });

    return response.choices[0].message.content || '';
  }

  /**
   * Genera sugerencias médicas para historia clínica basándose en síntomas y especialidad.
   * @param symptoms Síntomas reportados por el paciente
   * @param specialty Especialidad médica
   * @param patientAge Edad del paciente (opcional)
   * @param patientGender Género del paciente (opcional)
   * @returns Sugerencias médicas estructuradas
   */

  async generateMedicalSuggestions({
    symptoms,
    specialty,
    patientAge,
    patientGender,
    currentFindings = '',
    vitalSigns = ''
  }: {
    symptoms: string;
    specialty: string;
    patientAge?: number;
    patientGender?: string;
    currentFindings?: string;
    vitalSigns?: string;
  }): Promise<{
    differentialDiagnosis: string[];
    recommendedTests: string[];
    treatmentSuggestions: string[];
    redFlags: string[];
    physicalExamFocus: string[];
    followUpRecommendations: string[];
  }> {
    try {
      const patientInfo = `
        ${patientAge ? `Edad: ${patientAge} años` : ''}
        ${patientGender ? `Género: ${patientGender}` : ''}
        ${vitalSigns ? `Signos vitales: ${vitalSigns}` : ''}
        ${currentFindings ? `Hallazgos actuales: ${currentFindings}` : ''}
      `.trim();

      const prompt = `
        Eres un asistente médico especializado en ${specialty}. 
        
        INFORMACIÓN DEL PACIENTE:
        ${patientInfo}
        
        SÍNTOMAS REPORTADOS:
        ${symptoms}
        
        Por favor, proporciona sugerencias médicas estructuradas en formato JSON con las siguientes claves:
        {
          "differentialDiagnosis": ["diagnóstico 1", "diagnóstico 2", "diagnóstico 3"],
          "recommendedTests": ["examen 1", "examen 2", "examen 3"],
          "treatmentSuggestions": ["tratamiento 1", "tratamiento 2"],
          "redFlags": ["señal de alarma 1", "señal de alarma 2"],
          "physicalExamFocus": ["área de examen 1", "área de examen 2"],
          "followUpRecommendations": ["seguimiento 1", "seguimiento 2"]
        }
        
        IMPORTANTE:
        - Responde SOLO con el JSON válido, sin texto adicional
        - Las sugerencias deben ser específicas para ${specialty}
        - Considera la edad y género del paciente si están disponibles
        - Incluye máximo 5 elementos por categoría
        - Usa terminología médica apropiada pero comprensible
        - Las sugerencias son para apoyo del médico, no reemplazan el juicio clínico
      `;

      this.logger.log('Enviando solicitud a OpenAI...');
      this.logger.log(`Modelo: gpt-4o, Especialidad: ${specialty}, Paciente: ${patientAge ? patientAge + ' años' : 'edad no especificada'}`);
      
      // Intentar primero con gpt-3.5-turbo que tiene menos restricciones regionales
      let model = 'gpt-3.5-turbo';
      this.logger.log(`Intentando con modelo: ${model}`);
      
      const response = await this.openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente médico experto que proporciona sugerencias clínicas estructuradas en formato JSON. Siempre respondes con JSON válido sin texto adicional.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Baja temperatura para respuestas más consistentes
        max_tokens: 1500
      });

      const content = response.choices[0].message.content?.trim();
      if (!content) {
        throw new Error('No se recibió respuesta de OpenAI');
      }

      // Intentar parsear la respuesta JSON
      try {
        const suggestions = JSON.parse(content);
        
        // Validar que tenga las claves esperadas
        const requiredKeys = [
          'differentialDiagnosis',
          'recommendedTests', 
          'treatmentSuggestions',
          'redFlags',
          'physicalExamFocus',
          'followUpRecommendations'
        ];
        
        const hasAllKeys = requiredKeys.every(key => 
          suggestions.hasOwnProperty(key) && Array.isArray(suggestions[key])
        );
        
        if (!hasAllKeys) {
          throw new Error('Respuesta JSON no tiene la estructura esperada');
        }
        
        this.logger.log('Sugerencias médicas generadas exitosamente');
        return suggestions;
        
      } catch (parseError) {
        this.logger.error('Error al parsear respuesta JSON:', parseError.message);
        this.logger.error('Contenido recibido:', content);
        
        // Respuesta de fallback
        return {
          differentialDiagnosis: ['Requiere evaluación clínica adicional'],
          recommendedTests: ['Evaluación médica presencial recomendada'],
          treatmentSuggestions: ['Consultar con especialista'],
          redFlags: ['Buscar atención médica si los síntomas empeoran'],
          physicalExamFocus: ['Examen físico completo recomendado'],
          followUpRecommendations: ['Seguimiento según criterio médico']
        };
      }
      
    } catch (error) {
      this.logger.error('Error al generar sugerencias médicas:', error);
      
      // Manejo específico de errores de OpenAI
      if (error.status === 403) {
        this.logger.error('Error 403: Restricción regional de OpenAI detectada');
        this.logger.error('Detalles del error:', {
          status: error.status,
          message: error.message,
          code: error.code,
          type: error.type
        });
        
        // Devolver respuesta de fallback para error 403
        this.logger.warn('Devolviendo respuesta de fallback debido a restricción regional');
        return {
          differentialDiagnosis: [
            'Evaluación clínica requerida - Servicio de IA temporalmente no disponible',
            'Consultar protocolos clínicos estándar para ' + specialty,
            'Revisar guías de práctica clínica actuales'
          ],
          recommendedTests: [
            'Evaluación médica presencial recomendada',
            'Seguir protocolos diagnósticos estándar',
            'Considerar interconsulta si es necesario'
          ],
          treatmentSuggestions: [
            'Tratamiento según criterio médico profesional',
            'Seguir guías clínicas establecidas',
            'Monitoreo clínico apropiado'
          ],
          redFlags: [
            'Buscar atención médica inmediata si los síntomas empeoran',
            'Vigilar signos de deterioro clínico',
            'Seguimiento médico regular'
          ],
          physicalExamFocus: [
            'Examen físico completo según especialidad',
            'Evaluación sistémica apropiada',
            'Documentación detallada de hallazgos'
          ],
          followUpRecommendations: [
            'Seguimiento según criterio médico',
            'Programar citas de control apropiadas',
            'Educación al paciente sobre su condición'
          ]
        };
      }
      
      // Otros errores de OpenAI
      if (error.status === 429) {
        this.logger.error('Error 429: Límite de tasa excedido');
        throw new Error('Servicio temporalmente saturado. Por favor, inténtalo en unos minutos.');
      }
      
      if (error.status === 401) {
        this.logger.error('Error 401: API Key inválida o expirada');
        throw new Error('Error de autenticación con el servicio de IA. Contacta al administrador.');
      }
      
      // Error genérico
      this.logger.error('Error genérico al generar sugerencias médicas:', error.message);
      throw new Error('Error al generar sugerencias médicas: ' + (error.message || 'Error desconocido'));
    }
  }
}
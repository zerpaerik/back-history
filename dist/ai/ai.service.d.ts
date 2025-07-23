import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private openai;
    private readonly logger;
    constructor(configService: ConfigService);
    transcribeAudio(audioBuffer: Buffer, language?: string): Promise<string>;
    translateText(text: string, targetLanguage: string): Promise<string>;
    generateMedicalSuggestions({ symptoms, specialty, patientAge, patientGender, currentFindings, vitalSigns }: {
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
    }>;
}

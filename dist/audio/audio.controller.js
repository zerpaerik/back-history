"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AudioController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const ai_service_1 = require("../ai/ai.service");
let AudioController = AudioController_1 = class AudioController {
    aiService;
    logger = new common_1.Logger(AudioController_1.name);
    constructor(aiService) {
        this.aiService = aiService;
    }
    async translateAudio(audioFile, language) {
        this.logger.log('=== NUEVA SOLICITUD DE TRADUCCIÓN ===');
        this.logger.log(`Timestamp: ${new Date().toISOString()}`);
        this.logger.log('Información del archivo de audio:');
        if (audioFile) {
            this.logger.log(`- Nombre original: ${audioFile.originalname}`);
            this.logger.log(`- Tipo MIME: ${audioFile.mimetype}`);
            this.logger.log(`- Tamaño: ${audioFile.size} bytes`);
            this.logger.log(`- Buffer length: ${audioFile.buffer?.length || 'undefined'}`);
        }
        else {
            this.logger.error('- Archivo de audio NO recibido');
        }
        this.logger.log(`Idioma solicitado: ${language || 'NO ESPECIFICADO'}`);
        if (!audioFile) {
            this.logger.error('Error: Audio file is required');
            throw new common_1.BadRequestException('Audio file is required.');
        }
        if (!language) {
            this.logger.error('Error: Target language is required');
            throw new common_1.BadRequestException('Target language is required.');
        }
        try {
            this.logger.log('Iniciando proceso de transcripción...');
            const transcribedText = await this.aiService.transcribeAudio(audioFile.buffer);
            this.logger.log(`Texto transcrito: "${transcribedText}"`);
            this.logger.log('Iniciando proceso de traducción...');
            const translatedText = await this.aiService.translateText(transcribedText, language);
            this.logger.log(`Texto traducido: "${translatedText}"`);
            const result = {
                original: transcribedText,
                translation: translatedText,
            };
            this.logger.log('=== SOLICITUD COMPLETADA EXITOSAMENTE ===');
            return result;
        }
        catch (error) {
            this.logger.error('=== ERROR EN LA SOLICITUD ===');
            this.logger.error(`Error: ${error.message}`);
            this.logger.error(`Stack: ${error.stack}`);
            throw error;
        }
    }
};
exports.AudioController = AudioController;
__decorate([
    (0, common_1.Post)('translate'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "translateAudio", null);
exports.AudioController = AudioController = AudioController_1 = __decorate([
    (0, common_1.Controller)('audio'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AudioController);
//# sourceMappingURL=audio.controller.js.map
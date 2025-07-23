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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const ai_service_1 = require("./ai.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const medical_suggestions_dto_1 = require("./dto/medical-suggestions.dto");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generateMedicalSuggestions(dto) {
        try {
            const suggestions = await this.aiService.generateMedicalSuggestions({
                symptoms: dto.symptoms,
                specialty: dto.specialty,
                patientAge: dto.patientAge,
                patientGender: dto.patientGender,
                currentFindings: dto.currentFindings,
                vitalSigns: dto.vitalSigns
            });
            return {
                success: true,
                data: suggestions,
                message: 'Sugerencias médicas generadas exitosamente'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Error al generar sugerencias médicas'
            };
        }
    }
    async transcribeAudio(audioFile, language = 'es') {
        try {
            if (!audioFile) {
                return {
                    success: false,
                    error: 'No se proporcionó archivo de audio'
                };
            }
            const maxSize = 25 * 1024 * 1024;
            if (audioFile.size > maxSize) {
                return {
                    success: false,
                    error: 'El archivo de audio es demasiado grande. Máximo 25MB.'
                };
            }
            const allowedTypes = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
            if (!allowedTypes.includes(audioFile.mimetype)) {
                return {
                    success: false,
                    error: 'Formato de audio no soportado. Use WebM, MP4, MP3, WAV u OGG.'
                };
            }
            const transcription = await this.aiService.transcribeAudio(audioFile.buffer, language);
            return {
                success: true,
                data: {
                    transcription,
                    originalFilename: audioFile.originalname,
                    fileSize: audioFile.size,
                    language
                }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Post)('medical-suggestions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [medical_suggestions_dto_1.MedicalSuggestionsDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateMedicalSuggestions", null);
__decorate([
    (0, common_1.Post)('transcribe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "transcribeAudio", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map
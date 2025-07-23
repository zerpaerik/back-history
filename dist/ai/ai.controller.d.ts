import { AiService } from './ai.service';
import { MedicalSuggestionsDto } from './dto/medical-suggestions.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateMedicalSuggestions(dto: MedicalSuggestionsDto): Promise<{
        success: boolean;
        data: {
            differentialDiagnosis: string[];
            recommendedTests: string[];
            treatmentSuggestions: string[];
            redFlags: string[];
            physicalExamFocus: string[];
            followUpRecommendations: string[];
        };
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message: string;
        data?: undefined;
    }>;
    transcribeAudio(audioFile: Express.Multer.File, language?: string): Promise<{
        success: boolean;
        data: {
            transcription: string;
            originalFilename: string;
            fileSize: number;
            language: string;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
}

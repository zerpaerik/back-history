import { AiService } from '../ai/ai.service';
export declare class AudioController {
    private readonly aiService;
    private readonly logger;
    constructor(aiService: AiService);
    translateAudio(audioFile: Express.Multer.File, language: string): Promise<{
        original: string;
        translation: string;
    }>;
}

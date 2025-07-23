export declare class TranscriptionDto {
    language?: string;
}
export interface TranscriptionResponse {
    success: boolean;
    data?: {
        transcription: string;
        originalFilename: string;
        fileSize: number;
        language: string;
    };
    error?: string;
}

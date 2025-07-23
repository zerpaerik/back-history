export declare class Triage {
    id: string;
    weight: string;
    height: string;
    bloodPressure: string;
    oxygenSaturation: string;
    heartRate: string;
    temperature: string;
    observations: string;
    createdAt: Date;
    updatedAt: Date;
    getTriageSummary(): string;
    hasData(): boolean;
}

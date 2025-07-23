export declare enum UserRole {
    ADMIN = "admin",
    DOCTOR = "doctor",
    NURSE = "nurse",
    RECEPTIONIST = "receptionist"
}
export declare class User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtyResponseDto = void 0;
class SpecialtyResponseDto {
    id;
    name;
    code;
    description;
    department;
    isActive;
    createdAt;
    updatedAt;
    fullInfo;
    constructor(specialty) {
        this.id = specialty.id;
        this.name = specialty.name;
        this.code = specialty.code;
        this.description = specialty.description;
        this.department = specialty.department;
        this.isActive = specialty.isActive;
        this.createdAt = specialty.createdAt;
        this.updatedAt = specialty.updatedAt;
        this.fullInfo = specialty.getFullInfo();
    }
}
exports.SpecialtyResponseDto = SpecialtyResponseDto;
//# sourceMappingURL=specialty-response.dto.js.map
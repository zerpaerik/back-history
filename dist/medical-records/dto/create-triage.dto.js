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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTriageDto = void 0;
const class_validator_1 = require("class-validator");
class CreateTriageDto {
    weight;
    height;
    bloodPressure;
    oxygenSaturation;
    heartRate;
    temperature;
    observations;
}
exports.CreateTriageDto = CreateTriageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[\d.,\s]+[kg|Kg|KG]*$/, {
        message: 'El peso debe ser un valor numérico válido (ej: 70.5 kg)',
    }),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[\d.,\s]+[cm|m|CM|M]*$/, {
        message: 'La talla debe ser un valor numérico válido (ej: 1.75 m o 175 cm)',
    }),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "height", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(30),
    (0, class_validator_1.Matches)(/^[\d/\s-]+[mmHg]*$/, {
        message: 'La tensión arterial debe tener formato válido (ej: 120/80 mmHg)',
    }),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "bloodPressure", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[\d.,\s]+[%]*$/, {
        message: 'La saturación debe ser un valor numérico válido (ej: 98%)',
    }),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[\d\s]+[bpm|lpm]*$/, {
        message: 'La frecuencia cardíaca debe ser un valor numérico válido (ej: 72 bpm)',
    }),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "heartRate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(20),
    (0, class_validator_1.Matches)(/^[\d.,\s]+[°C|°F|C|F]*$/, {
        message: 'La temperatura debe ser un valor numérico válido (ej: 36.5°C)',
    }),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateTriageDto.prototype, "observations", void 0);
//# sourceMappingURL=create-triage.dto.js.map
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
exports.Triage = void 0;
const typeorm_1 = require("typeorm");
let Triage = class Triage {
    id;
    weight;
    height;
    bloodPressure;
    oxygenSaturation;
    heartRate;
    temperature;
    observations;
    createdAt;
    updatedAt;
    getTriageSummary() {
        const parts = [];
        if (this.weight)
            parts.push(`Peso: ${this.weight}`);
        if (this.height)
            parts.push(`Talla: ${this.height}`);
        if (this.bloodPressure)
            parts.push(`TA: ${this.bloodPressure}`);
        if (this.oxygenSaturation)
            parts.push(`Sat: ${this.oxygenSaturation}%`);
        return parts.join(' | ') || 'Sin datos de triaje';
    }
    hasData() {
        return !!(this.weight || this.height || this.bloodPressure || this.oxygenSaturation ||
            this.heartRate || this.temperature || this.observations);
    }
};
exports.Triage = Triage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Triage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Triage.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Triage.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], Triage.prototype, "bloodPressure", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Triage.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Triage.prototype, "heartRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Triage.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Triage.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Triage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Triage.prototype, "updatedAt", void 0);
exports.Triage = Triage = __decorate([
    (0, typeorm_1.Entity)('triages')
], Triage);
//# sourceMappingURL=triage.entity.js.map
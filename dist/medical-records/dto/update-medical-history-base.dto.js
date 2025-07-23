"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMedicalHistoryBaseDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_medical_history_base_dto_1 = require("./create-medical-history-base.dto");
class UpdateMedicalHistoryBaseDto extends (0, mapped_types_1.PartialType)(create_medical_history_base_dto_1.CreateMedicalHistoryBaseDto) {
}
exports.UpdateMedicalHistoryBaseDto = UpdateMedicalHistoryBaseDto;
//# sourceMappingURL=update-medical-history-base.dto.js.map
import {
  IsString,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateTriageDto {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Matches(/^[\d.,\s]+[kg|Kg|KG]*$/, {
    message: 'El peso debe ser un valor numérico válido (ej: 70.5 kg)',
  })
  weight?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Matches(/^[\d.,\s]+[cm|m|CM|M]*$/, {
    message: 'La talla debe ser un valor numérico válido (ej: 1.75 m o 175 cm)',
  })
  height?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  @Matches(/^[\d/\s-]+[mmHg]*$/, {
    message: 'La tensión arterial debe tener formato válido (ej: 120/80 mmHg)',
  })
  bloodPressure?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Matches(/^[\d.,\s]+[%]*$/, {
    message: 'La saturación debe ser un valor numérico válido (ej: 98%)',
  })
  oxygenSaturation?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Matches(/^[\d\s]+[bpm|lpm]*$/, {
    message: 'La frecuencia cardíaca debe ser un valor numérico válido (ej: 72 bpm)',
  })
  heartRate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Matches(/^[\d.,\s]+[°C|°F|C|F]*$/, {
    message: 'La temperatura debe ser un valor numérico válido (ej: 36.5°C)',
  })
  temperature?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  observations?: string;
}

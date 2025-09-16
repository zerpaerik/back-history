-- Script de inicialización de la base de datos
-- Sistema de Historias Clínicas

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insertar especialidades médicas iniciales
INSERT INTO specialty (id, name, description, is_active, created_at, updated_at) VALUES
(uuid_generate_v4(), 'Medicina General', 'Atención médica general y preventiva', true, NOW(), NOW()),
(uuid_generate_v4(), 'Cardiología', 'Especialidad en enfermedades del corazón y sistema cardiovascular', true, NOW(), NOW()),
(uuid_generate_v4(), 'Neurología', 'Especialidad en enfermedades del sistema nervioso', true, NOW(), NOW()),
(uuid_generate_v4(), 'Pediatría', 'Atención médica especializada en niños y adolescentes', true, NOW(), NOW()),
(uuid_generate_v4(), 'Ginecología', 'Especialidad en salud reproductiva femenina', true, NOW(), NOW()),
(uuid_generate_v4(), 'Traumatología', 'Especialidad en lesiones del sistema musculoesquelético', true, NOW(), NOW()),
(uuid_generate_v4(), 'Dermatología', 'Especialidad en enfermedades de la piel', true, NOW(), NOW()),
(uuid_generate_v4(), 'Oftalmología', 'Especialidad en enfermedades de los ojos', true, NOW(), NOW()),
(uuid_generate_v4(), 'Otorrinolaringología', 'Especialidad en oído, nariz y garganta', true, NOW(), NOW()),
(uuid_generate_v4(), 'Psiquiatría', 'Especialidad en salud mental', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insertar usuario administrador por defecto
-- Contraseña: admin123 (hash bcrypt)
INSERT INTO "user" (id, username, email, password, role, is_active, created_at, updated_at) VALUES
(uuid_generate_v4(), 'admin', 'admin@sysmedic.com', '$2b$10$rQZ8kHWKQYXHqQQqQQqQQeQQqQQqQQqQQqQQqQQqQQqQQqQQqQQqQ', 'admin', true, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- Insertar algunos tipos de identificación comunes
-- (Esto dependerá de cómo hayas modelado los tipos de identificación)

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_patient_identification ON patient(identification_number);
CREATE INDEX IF NOT EXISTS idx_medical_record_patient ON medical_record(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_record_professional ON medical_record(professional_id);
CREATE INDEX IF NOT EXISTS idx_medical_record_specialty ON medical_record(specialty_id);
CREATE INDEX IF NOT EXISTS idx_triage_medical_record ON triage(medical_record_id);

-- Configurar secuencias para números de historia clínica
-- (Si usas secuencias personalizadas)

COMMIT;

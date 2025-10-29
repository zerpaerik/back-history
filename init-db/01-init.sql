-- Script de inicialización de la base de datos
-- Sistema de Historias Clínicas
-- Actualizado para coincidir con entidades TypeORM

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insertar especialidades médicas iniciales
-- Nota: TypeORM crea la tabla como 'specialties' y requiere campo 'code'
INSERT INTO specialties (id, name, code, description, department, "isActive", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'Medicina General', 'MED-GEN', 'Atención médica general y preventiva', 'Medicina', true, NOW(), NOW()),
(uuid_generate_v4(), 'Cardiología', 'CARDIO', 'Especialidad en enfermedades del corazón y sistema cardiovascular', 'Medicina', true, NOW(), NOW()),
(uuid_generate_v4(), 'Neurología', 'NEURO', 'Especialidad en enfermedades del sistema nervioso', 'Medicina', true, NOW(), NOW()),
(uuid_generate_v4(), 'Pediatría', 'PEDIAT', 'Atención médica especializada en niños y adolescentes', 'Medicina', true, NOW(), NOW()),
(uuid_generate_v4(), 'Ginecología', 'GINECO', 'Especialidad en salud reproductiva femenina', 'Medicina', true, NOW(), NOW()),
(uuid_generate_v4(), 'Traumatología', 'TRAUMA', 'Especialidad en lesiones del sistema musculoesquelético', 'Cirugía', true, NOW(), NOW()),
(uuid_generate_v4(), 'Dermatología', 'DERMATO', 'Especialidad en enfermedades de la piel', 'Medicina', true, NOW(), NOW()),
(uuid_generate_v4(), 'Oftalmología', 'OFTALMO', 'Especialidad en enfermedades de los ojos', 'Cirugía', true, NOW(), NOW()),
(uuid_generate_v4(), 'Otorrinolaringología', 'ORL', 'Especialidad en oído, nariz y garganta', 'Cirugía', true, NOW(), NOW()),
(uuid_generate_v4(), 'Psiquiatría', 'PSIQ', 'Especialidad en salud mental', 'Medicina', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Insertar usuario administrador por defecto
-- Tabla: users (no 'user')
-- Contraseña: admin123 (deberás cambiarla después del primer login)
-- Hash bcrypt generado para 'admin123'
INSERT INTO users (id, username, email, password, role, "isActive", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), 'admin', 'admin@sysmedic.com', '$2b$12$tBu0831LJ.F3J1kvuHem5OKhkiFKuibhnTDNFMFRdNya7Lu.kF6Zm', 'admin', true, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- Nota: El hash de arriba corresponde a la contraseña 'admin123'
-- Cambia la contraseña después del primer login por seguridad

COMMIT;

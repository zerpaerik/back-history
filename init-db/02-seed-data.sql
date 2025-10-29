-- Datos de prueba para el sistema de historias clínicas
-- Actualizado para coincidir con entidades TypeORM
-- Solo se ejecuta si no existen datos

DO $$
BEGIN
    -- Verificar si ya existen datos de prueba
    IF NOT EXISTS (SELECT 1 FROM patients LIMIT 1) THEN
        
        -- Insertar pacientes de prueba
        -- Nota: TypeORM crea la tabla como 'patients' y requiere campo 'gender'
        INSERT INTO patients (
            id, first_name, second_name, first_lastname, second_lastname,
            identification_type, identification_number, birth_date, gender,
            marital_status, education_level, phone, email, is_active,
            created_at, updated_at
        ) VALUES
        (
            uuid_generate_v4(), 'Juan', 'Carlos', 'Pérez', 'García',
            'DNI', '12345678', '1985-03-15', 'Masculino',
            'Soltero', 'Universitaria Completa', '987654321', 'juan.perez@email.com', true,
            NOW(), NOW()
        ),
        (
            uuid_generate_v4(), 'María', 'Elena', 'López', 'Martínez',
            'DNI', '87654321', '1990-07-22', 'Femenino',
            'Casado', 'Secundaria Completa', '987654322', 'maria.lopez@email.com', true,
            NOW(), NOW()
        ),
        (
            uuid_generate_v4(), 'Pedro', NULL, 'Rodríguez', 'Silva',
            'DNI', '11223344', '1978-12-10', 'Masculino',
            'Divorciado', 'Técnica', '987654323', 'pedro.rodriguez@email.com', true,
            NOW(), NOW()
        ),
        (
            uuid_generate_v4(), 'Ana', 'Lucía', 'Torres', 'Ramírez',
            'DNI', '55667788', '1995-05-18', 'Femenino',
            'Soltero', 'Universitaria Incompleta', '987654324', 'ana.torres@email.com', true,
            NOW(), NOW()
        );

        RAISE NOTICE 'Datos de prueba insertados correctamente';
    ELSE
        RAISE NOTICE 'Ya existen datos en la base de datos, omitiendo inserción de datos de prueba';
    END IF;
END $$;

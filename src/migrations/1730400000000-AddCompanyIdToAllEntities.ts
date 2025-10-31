import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyIdToAllEntities1730400000000 implements MigrationInterface {
  name = 'AddCompanyIdToAllEntities1730400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🚀 Iniciando migración: Agregar company_id a todas las entidades');

    // 1. Obtener la primera empresa (empresa por defecto)
    const companies = await queryRunner.query(
      `SELECT id FROM companies ORDER BY created_at ASC LIMIT 1`
    );
    
    if (!companies || companies.length === 0) {
      throw new Error(
        '❌ ERROR: No hay empresas en la base de datos.\n' +
        'Por favor, crea al menos una empresa antes de ejecutar esta migración.\n' +
        'Puedes crear una empresa usando el endpoint POST /companies'
      );
    }
    
    const defaultCompanyId = companies[0].id;
    console.log(`✅ Empresa por defecto encontrada: ${defaultCompanyId}`);
    console.log('📝 Todos los registros existentes serán asignados a esta empresa\n');
    
    // 2. Lista de tablas a actualizar
    const tables = [
      'patients',
      'professionals',
      'specialties',
      'medical_records',
      'triages',
      'medical_history_base',
      'specialty_medical_history',
    ];
    
    // 3. Procesar cada tabla
    for (const table of tables) {
      console.log(`\n📋 Procesando tabla: ${table}`);
      
      try {
        // a) Agregar columna company_id (nullable inicialmente)
        console.log(`  ➜ Agregando columna company_id...`);
        await queryRunner.query(
          `ALTER TABLE "${table}" ADD COLUMN "company_id" uuid`
        );
        
        // b) Asignar empresa por defecto a todos los registros existentes
        console.log(`  ➜ Asignando empresa por defecto a registros existentes...`);
        const result = await queryRunner.query(
          `UPDATE "${table}" SET "company_id" = $1 WHERE "company_id" IS NULL`,
          [defaultCompanyId]
        );
        console.log(`  ➜ ${result[1]} registros actualizados`);
        
        // c) Hacer columna NOT NULL
        console.log(`  ➜ Configurando columna como NOT NULL...`);
        await queryRunner.query(
          `ALTER TABLE "${table}" ALTER COLUMN "company_id" SET NOT NULL`
        );
        
        // d) Agregar índice para mejorar performance
        console.log(`  ➜ Creando índice...`);
        await queryRunner.query(
          `CREATE INDEX "IDX_${table}_company_id" ON "${table}" ("company_id")`
        );
        
        // e) Agregar foreign key constraint
        console.log(`  ➜ Agregando foreign key...`);
        await queryRunner.query(
          `ALTER TABLE "${table}" 
           ADD CONSTRAINT "FK_${table}_company" 
           FOREIGN KEY ("company_id") 
           REFERENCES "companies"("id") 
           ON DELETE RESTRICT 
           ON UPDATE CASCADE`
        );
        
        console.log(`  ✅ Tabla ${table} actualizada exitosamente`);
        
      } catch (error) {
        console.error(`  ❌ Error procesando tabla ${table}:`, error.message);
        throw error;
      }
    }
    
    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - ${tables.length} tablas actualizadas`);
    console.log(`   - Empresa por defecto: ${defaultCompanyId}`);
    console.log('   - Todos los registros existentes ahora tienen company_id');
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   - Reinicia el servidor backend');
    console.log('   - Los usuarios deben hacer logout/login para obtener nuevo token');
    console.log('   - Verifica que todos los usuarios tengan companyId asignado\n');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🔄 Revirtiendo migración: Eliminar company_id de todas las entidades');
    
    const tables = [
      'specialty_medical_history',
      'medical_history_base',
      'triages',
      'medical_records',
      'specialties',
      'professionals',
      'patients',
    ];
    
    for (const table of tables) {
      console.log(`\n📋 Revirtiendo tabla: ${table}`);
      
      try {
        // Eliminar foreign key
        console.log(`  ➜ Eliminando foreign key...`);
        await queryRunner.query(
          `ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "FK_${table}_company"`
        );
        
        // Eliminar índice
        console.log(`  ➜ Eliminando índice...`);
        await queryRunner.query(
          `DROP INDEX IF EXISTS "IDX_${table}_company_id"`
        );
        
        // Eliminar columna
        console.log(`  ➜ Eliminando columna company_id...`);
        await queryRunner.query(
          `ALTER TABLE "${table}" DROP COLUMN IF EXISTS "company_id"`
        );
        
        console.log(`  ✅ Tabla ${table} revertida`);
        
      } catch (error) {
        console.error(`  ❌ Error revirtiendo tabla ${table}:`, error.message);
        throw error;
      }
    }
    
    console.log('\n✅ Migración revertida exitosamente');
    console.log('⚠️  Los datos ahora NO tienen company_id\n');
  }
}

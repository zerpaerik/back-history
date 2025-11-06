import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGynecologicalFields1730934000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar campos gineco-obstétricos faltantes
    await queryRunner.addColumn(
      'medical_history_base',
      new TableColumn({
        name: 'pap',
        type: 'text',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'medical_history_base',
      new TableColumn({
        name: 'mac',
        type: 'text',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'medical_history_base',
      new TableColumn({
        name: 'andria',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('medical_history_base', 'andria');
    await queryRunner.dropColumn('medical_history_base', 'mac');
    await queryRunner.dropColumn('medical_history_base', 'pap');
  }
}

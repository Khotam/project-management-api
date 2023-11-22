import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectsTasks1700640383117 implements MigrationInterface {
  name = 'add-name-column-in-projects-and-tasks-table1700640383117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "projects"
        ADD COLUMN "name" character varying NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "projects"
        ADD CONSTRAINT "UQ_9b7ca6d30b94fef571cff876887" UNIQUE ("name");
    `);

    await queryRunner.query(`
        ALTER TABLE "tasks"
        ADD COLUMN "name" character varying NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "tasks"
        ADD CONSTRAINT "UQ_9c7ca6d30b94fef571cff876867" UNIQUE ("name");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "projects"
        DROP COLUMN "name";
    `);
    await queryRunner.query(`
        ALTER TABLE "tasks"
        DROP COLUMN "name";
    `);
  }
}

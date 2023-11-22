import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tasks1700579367004 implements MigrationInterface {
  name = 'set-nullable-fields-in-tasks-table1700508112438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "tasks"
        ALTER COLUMN "workerUserId" DROP NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "tasks"
        ALTER COLUMN "dueDate" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "tasks"
        ALTER COLUMN "workerUserId" SET NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "tasks"
        ALTER COLUMN "dueDate" SET NOT NULL
    `);
  }
}

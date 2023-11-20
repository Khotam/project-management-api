import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tasks1700509350017 implements MigrationInterface {
  name = 'create-tasks-table1700508112438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" SERIAL NOT NULL,
                "project_id" integer NOT NULL,
                "created_by" integer NOT NULL,
                "worker_user_id" integer NOT NULL,
                "status" character varying DEFAULT 'created',
                "due_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "done_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_6b031fcd0863e3f6b44230163c5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
        ALTER TABLE "tasks"
        ADD CONSTRAINT "FK_a6aa735704d3f00c6033c57f21w" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE
        SET NULL ON UPDATE CASCADE
    `);
    await queryRunner.query(`
        ALTER TABLE "tasks"
        ADD CONSTRAINT "FK_a6aa735704d3f00c6033c57f21a" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE
        SET NULL ON UPDATE CASCADE
    `);
    await queryRunner.query(`
        ALTER TABLE "tasks"
        ADD CONSTRAINT "FK_a6aa735704d3f00c6033c57f21c" FOREIGN KEY ("worker_user_id") REFERENCES "users"("id") ON DELETE
        SET NULL ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE "tasks" DROP CONSTRAINT "FK_a6aa735704d3f00c6033c57f21w"
    `);
    await queryRunner.query(`
    ALTER TABLE "tasks" DROP CONSTRAINT "FK_a6aa735704d3f00c6033c57f21a"
    `);
    await queryRunner.query(`
    ALTER TABLE "tasks" DROP CONSTRAINT "FK_a6aa735704d3f00c6033c57f21c"
    `);
    await queryRunner.query(`
        DROP TABLE "tasks"
    `);
  }
}

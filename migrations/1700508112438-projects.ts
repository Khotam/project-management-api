import { MigrationInterface, QueryRunner } from 'typeorm';

export class Projects1700508112438 implements MigrationInterface {
  name = 'create-projects-table1700508112438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "projects" (
                "id" SERIAL NOT NULL,
                "orgId" integer NOT NULL,
                "createdBy" integer NOT NULL,
                CONSTRAINT "PK_6b031fcd0863e3f6b44230163e1" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
        ALTER TABLE "projects"
        ADD CONSTRAINT "FK_a6aa735704d3f00c6033c57f81h" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE
        SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
        ALTER TABLE "projects"
        ADD CONSTRAINT "FK_a6aa735704d3f00c6033c57f81j" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE
        SET NULL ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE "projects" DROP CONSTRAINT "FK_a6aa735704d3f00c6033c57f81h"
`);
    await queryRunner.query(`
    ALTER TABLE "projects" DROP CONSTRAINT "FK_a6aa735704d3f00c6033c57f81j"
`);
    await queryRunner.query(`
        DROP TABLE "projects"
    `);
  }
}

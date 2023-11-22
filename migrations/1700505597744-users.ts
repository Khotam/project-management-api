import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1700505597744 implements MigrationInterface {
  name = 'create-users-table-and-seed-with-values1700505597744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "role" character varying NOT NULL,
                "createdBy" integer NOT NULL,
                CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
    `);
    await queryRunner.query(`
        ALTER TABLE "users"
        ADD CONSTRAINT "FK_a6aa735704d3f00c6033c57f81f" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE
        SET NULL ON UPDATE CASCADE
    `);
    await queryRunner.query(`
        INSERT INTO "users" (name, role, "createdBy") VALUES ('ADMIN', 'admin', 1), ('MANAGER', 'manager', 1), ('EMPLOYEE', 'employee', 1)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "users" DROP CONSTRAINT "FK_a6aa735704d3f00c6033c57f81f"
    `);
    await queryRunner.query(`
            DROP TABLE "users"
    `);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1700506148615 implements MigrationInterface {
  name = 'organizations1700506148615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "organizations" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "created_by" integer NOT NULL,
                CONSTRAINT "UQ_9b7ca6d30b94fef571cff876884" UNIQUE ("name"),
                CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
        ALTER TABLE "organizations"
        ADD CONSTRAINT "FK_a6aa735704d3f00c6033c57f81a" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE
        SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
            CREATE TABLE "organization_users" (
                "id" SERIAL NOT NULL,
                "org_id" integer NOT NULL,
                "user_id" integer NOT NULL,
                CONSTRAINT "PK_af79a22d50256af35812ba60a87" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
        ALTER TABLE "organization_users"
        ADD CONSTRAINT "FK_a6aa735704d3f00c6033c57f81b" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE
        SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
        ALTER TABLE "organization_users"
        ADD CONSTRAINT "FK_a6aa735704d3f00c6033c57f81e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE
        SET NULL ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "organization_users" DROP CONSTRAINT "FK_a6aa735704d3f00c6033c57f81e"
    `);
    await queryRunner.query(`
        ALTER TABLE "organization_users" DROP CONSTRAINT "FK_a6aa735704d3f00c6033c57f81b"
    `);
    await queryRunner.query(`
        ALTER TABLE "organizations" DROP CONSTRAINT "FK_a6aa735704d3f00c6033c57f81a"
    `);
    await queryRunner.query(`
            DROP TABLE "organizations"
        `);
    await queryRunner.query(`
            DROP TABLE "organization_users"
        `);
  }
}

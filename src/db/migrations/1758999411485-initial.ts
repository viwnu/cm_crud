import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1758999411485 implements MigrationInterface {
    name = 'Initial1758999411485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_identity_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(40) NOT NULL, "password" character varying(250) NOT NULL, "refreshToken" character varying(250), CONSTRAINT "UQ_df5bb527c6423d0a20f91f81b0d" UNIQUE ("email"), CONSTRAINT "PK_12c2e010faf893995d6949b8da5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "managers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(40) NOT NULL, "userIdentityId" uuid, CONSTRAINT "REL_d67bcfa2631ab7cb2b29ea5c44" UNIQUE ("userIdentityId"), CONSTRAINT "PK_e70b8cc457276d9b4d82342a8ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(256) NOT NULL, "description" character varying(1024) NOT NULL, "content" text NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "managers" ADD CONSTRAINT "FK_d67bcfa2631ab7cb2b29ea5c447" FOREIGN KEY ("userIdentityId") REFERENCES "user_identity_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "managers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`ALTER TABLE "managers" DROP CONSTRAINT "FK_d67bcfa2631ab7cb2b29ea5c447"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TABLE "managers"`);
        await queryRunner.query(`DROP TABLE "user_identity_entity"`);
    }

}

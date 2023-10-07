import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1696689209525 implements MigrationInterface {
    name = 'UpdateUserEntity1696689209525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "resetPasswordToken" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetPasswordToken"`);
    }

}

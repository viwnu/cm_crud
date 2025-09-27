import * as bcrypt from 'bcryptjs';
import { MigrationInterface, QueryRunner } from "typeorm";

export class Seed1759000575176 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<void> {
    // 1️⃣ create user identity
    const passwordHash = await bcrypt.hash('123456789', 10);

    const userIdentity = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user_identity_entity')
      .values({
        email: 'manager@example.com',
        password: passwordHash,
        refreshToken: null, // or some token if needed
      })
      .returning('*')
      .execute();

    const userIdentityId = userIdentity.generatedMaps[0].id;

    // 2️⃣ create manager and link with userIdentity
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('managers')
      .values({
        name: 'Demo Manager',
        userIdentity: userIdentityId,
      })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // delete the manager and linked user identity by email (or name)
    const userIdentity = await queryRunner.manager
      .createQueryBuilder()
      .select('id')
      .from('user_identity_entity', 'u')
      .where('u.email = :email', { email: 'manager@example.com' })
      .getRawOne();

    if (userIdentity) {
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from('managers')
        .where('user_identity_id = :id', { id: userIdentity.id })
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from('user_identity_entity')
        .where('id = :id', { id: userIdentity.id })
        .execute();
    }
  }

}

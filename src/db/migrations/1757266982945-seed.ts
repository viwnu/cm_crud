import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1757266982945 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tasks = Array.from({ length: 10 }).map((_, i) => ({
      title: `Task ${i + 1}`,
      completed: i % 2 === 0, // для примера: чётные завершены
    }));

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('tasks') // название таблицы
      .values(tasks)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // откатим сиды по title
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('tasks')
      .where('title LIKE :title', { title: 'Task %' })
      .execute();
  }
}

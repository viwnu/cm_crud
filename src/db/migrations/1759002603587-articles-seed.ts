import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticlesSeed1759002603587 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Grab any existing manager
    const managerRows: Array<{ id: string }> = await queryRunner.query(
      `SELECT "id" FROM "managers" LIMIT 1`,
    );
    if (!managerRows?.length) {
      throw new Error('No managers found. Seed a manager before seeding articles.');
    }
    const managerId = managerRows[0].id;

    // 2) Build params for 10 rows (no id/created)
    const rows = Array.from({ length: 10 }, (_, i) => ({
      title: `Seed Article ${i + 1}`,
      description: `This is a seeded description for article #${i + 1}.`,
      content:
        `# Seed Article ${i + 1}\n\nThis is sample **content** for seeded article ${i + 1}.`,
      authorId: managerId, // FK column inferred by TypeORM for @ManyToOne author
    }));

    // 3) Bulk insert
    const cols = ['title', 'description', 'content', 'authorId'];
    const valuesSql = rows
      .map(
        (_r, i) =>
          `($${i * cols.length + 1}, $${i * cols.length + 2}, $${i * cols.length + 3}, $${i * cols.length + 4})`,
      )
      .join(', ');

    const params = rows.flatMap(r => [r.title, r.description, r.content, r.authorId]);

    await queryRunner.query(
      `INSERT INTO "articles" (${cols.map(c => `"${c}"`).join(', ')}) VALUES ${valuesSql};`,
      params,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove only our seeded rows (pattern match by title)
    await queryRunner.query(`DELETE FROM "articles" WHERE "title" LIKE 'Seed Article %';`);
  }

}

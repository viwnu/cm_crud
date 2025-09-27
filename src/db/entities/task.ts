import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Структура "Статьи" должна включать: название, описание, дату публикации, автора.

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 40 })
  title: string;

  @Column('varchar', { length: 40 })
  description: boolean;

  @CreateDateColumn()
  created: Date;

  @ManyToOne()
}

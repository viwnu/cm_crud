import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ManagerEntity } from './managers';

// Структура "Статьи" должна включать: название, описание, дату публикации, автора.

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 256 })
  title: string;

  @Column('varchar', { length: 1024 })
  description: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created: Date;

  @ManyToOne(() => ManagerEntity, 'articles')
  author: ManagerEntity;
}

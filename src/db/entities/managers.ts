import { UserIdentityEntity } from '@app/auth/db';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from './article';

@Entity('managers')
export class ManagerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 40 })
  name: string;

  @OneToOne(() => UserIdentityEntity, 'user', { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn()
  userIdentity: UserIdentityEntity;

  @OneToMany(() => ArticleEntity, 'manager')
  articles: ArticleEntity[];
}

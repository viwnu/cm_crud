import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserIdentityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 40, unique: true })
  email: string;

  @Column('varchar', { length: 250 })
  password: string;

  @Column('varchar', { length: 250, nullable: true })
  refreshToken: string;
}

import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserIdentityEntity } from '../../src/db/user.identity.entity';

dotenv.config({
  path: `.env.${process.env.NODE_ENV.trim()}`,
});

const Config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [UserIdentityEntity],
  synchronize: Boolean(process.env.SYNC_DB === 'true') || false,
};

export const AuthDataSource: DataSource = new DataSource(Config);

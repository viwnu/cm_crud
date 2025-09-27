import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserIdentityEntity } from '../../src/db/user.identity.entity';

dotenv.config({
  path: `.env.${process.env.NODE_ENV.trim()}`,
});

const Config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PS_HOST,
  port: Number(process.env.PS_PORT),
  username: process.env.PS_USER,
  password: process.env.PS_PASSWORD,
  database: process.env.PS_DB_NAME,
  entities: [UserIdentityEntity],
  synchronize: Boolean(process.env.SYNC_DB === 'true') || false,
};

export const AuthDataSource: DataSource = new DataSource(Config);

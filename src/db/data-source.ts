import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { ENTITIES } from './entities';
import { MIGRATIONS } from './migrations';

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
  entities: ENTITIES,
  synchronize: Boolean(process.env.SYNC_DB === 'true') || false,
  migrations: MIGRATIONS,
};

export const AppDataSource: DataSource = new DataSource(Config);

export const getDataSource = async (): Promise<DataSource> => {
  const dataSource = new DataSource(Config);
  await dataSource.initialize();
  return dataSource;
};

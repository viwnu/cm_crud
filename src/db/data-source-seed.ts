import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { ENTITIES } from './entities';
import { SEEDS } from './migrations';

dotenv.config({
  path: `.env.api.${process.env.NODE_ENV.trim()}`,
});

const Config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PS_HOST,
  port: Number(process.env.PS_PORT),
  username: process.env.PS_USER,
  password: process.env.PS_PASSWORD,
  database: process.env.PS_DB_NAME,
  entities: ENTITIES,
  synchronize: Boolean(process.env.SYNC_DB === 'true') || false,
  migrations: SEEDS,
};

export const AppDataSource: DataSource = new DataSource(Config);

export const getDataSource = async (): Promise<DataSource> => {
  const dataSource = new DataSource(Config);
  await dataSource.initialize();
  return dataSource;
};

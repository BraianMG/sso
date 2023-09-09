import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_DATABASE || 'sso',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Abc.123456',
  synchronize: false,
  keepConnectionAlive: true,
  logging: process.env.STAGE === 'development',
  entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
} as DataSourceOptions);

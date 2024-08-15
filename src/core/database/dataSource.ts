import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENVIRONMENT } from '../../shared/enum';
import { isEnvironmentMatch } from '../../shared/functions';

ConfigModule.forRoot();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  database: configService.get<string>('DB_NAME'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  synchronize: false,
  keepConnectionAlive: true,
  logging: isEnvironmentMatch(ENVIRONMENT.Development),
  entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
} as DataSourceOptions);

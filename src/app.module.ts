import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { SeedModule } from './modules/seed/seed.module';
import { isEnvironmentMatch } from '@shared/functions';
import { ENVIRONMENT } from '@shared/enum';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // TODO: Try to load connection data from src\core\database\dataSource.ts
    TypeOrmModule.forRoot({
      ssl: isEnvironmentMatch(ENVIRONMENT.Production),
      extra: {
        ssl: isEnvironmentMatch(ENVIRONMENT.Production)
          ? { rejectUnauthorized: false }
          : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@core/database/entities/user.entity';
import { RolesModule } from '@modules/roles/roles.module';

@Module({
  controllers: [],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  exports: [UsersService],
})
export class UsersModule {}

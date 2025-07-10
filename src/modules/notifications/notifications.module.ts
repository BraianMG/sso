import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [NotificationsService],
  controllers: [],
  imports: [ConfigModule],
  exports: [NotificationsService],
})
export class NotificationsModule {}

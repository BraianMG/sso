import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {} from 'nodemailer';

@Module({
  providers: [NotificationsService],
  controllers: [],
  imports: [],
  exports: [NotificationsService],
})
export class NotificationsModule {}

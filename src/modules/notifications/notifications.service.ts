import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
// TODO: Verify that it is imported from the correct place
import { SentMessageInfo } from 'nodemailer/lib/smtp-pool';
// import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly transporter: Transporter;
  private readonly USERNAME: string;
  private readonly SENDER_NAME: string;

  constructor(private readonly configService: ConfigService) {
    this.USERNAME = this.configService.get<string>('SMTP_USERNAME');
    this.SENDER_NAME = this.configService.get<string>('SMTP_SENDER_NAME');
    this.transporter = createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'), // true for port 465, false for other ports
      auth: {
        user: this.USERNAME,
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<SentMessageInfo> {
    const mailOptions: Mail.Options = {
      from: `${this.SENDER_NAME} <${this.USERNAME}>`,
      to,
      subject,
      text,
      html,
    };

    const info: SentMessageInfo = await this.transporter.sendMail(mailOptions);

    this.logger.log(`Message sent: ${info.messageId}`);
    return info;
  }
}

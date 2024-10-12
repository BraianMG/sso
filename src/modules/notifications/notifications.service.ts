import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "braianmg.software.tests@gmail.com",
        pass: "YourPassword",
      },
    })
  }
}

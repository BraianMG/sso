import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

jest.mock('nodemailer');

describe('NotificationsService', () => {
  let notificationsService: NotificationsService;
  let configService: ConfigService;
  const sendMailMock = jest.fn();

  beforeEach(async () => {
    (createTransport as jest.Mock).mockReturnValue({ sendMail: sendMailMock });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                SMTP_USERNAME: 'test_user@test.com',
                SMTP_SENDER_NAME: 'Test Sender',
                SMTP_HOST: 'smtp.test.com',
                SMTP_PORT: 465,
                SMTP_SECURE: true,
                SMTP_PASSWORD: 'test_password',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    notificationsService =
      module.get<NotificationsService>(NotificationsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(notificationsService).toBeDefined();
  });

  it('configService should be defined', () => {
    expect(configService).toBeDefined();
  });

  describe('send email', () => {
    it('should send email', async () => {
      sendMailMock.mockResolvedValue({ messageId: 'test_message_id' });

      const email = 'test@example.com';
      const subject = 'Test Email';
      const message = 'This is a test email';

      const transporterSendMailSpy = jest.spyOn(
        notificationsService['transporter'],
        'sendMail',
      );

      await notificationsService.sendEmail(email, subject, message, message);

      const info = await transporterSendMailSpy.mock.results[0].value;

      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock).toHaveBeenCalledWith({
        from: 'Test Sender <test_user@test.com>',
        to: email,
        subject,
        text: message,
        html: message,
      });
      expect(info).toEqual({ messageId: 'test_message_id' }); // Verificar resultado
    });
  });
});

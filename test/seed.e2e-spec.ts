import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('SeedController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET:/seed/', () => {
    it('should return SEED EXECUTED and status code 200', async () => {
      return request(app.getHttpServer())
        .get('/seed/')
        .expect(200)
        .expect('SEED EXECUTED');
    });
  });
});

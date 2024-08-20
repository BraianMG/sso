import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  ResetPasswordDto,
  SignInDto,
  SignInResponseDto,
  SignUpDto,
} from '@modules/auth/dto';
import { PartialType } from '@nestjs/mapped-types';
import { setAppConfig } from '../src/setAppConfig';
import { RolesEnum } from '@modules/auth/enums';
import { Repository } from 'typeorm';
import { User } from '@core/database/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@modules/auth/constants';

class WrongBody extends PartialType(SignUpDto) {}
const registeredUser: SignUpDto = {
  email: 'test@test.com',
  fullName: 'Test User',
  password: 'Str0ng_passW0rd',
};

async function signupAndGetTokens(
  app: INestApplication,
): Promise<SignInResponseDto> {
  await request(app.getHttpServer())
    .post('/api/v1/auth/signup')
    .send(registeredUser);

  const credentials: SignInDto = {
    email: registeredUser.email,
    password: registeredUser.password,
  };

  const response = await request(app.getHttpServer())
    .post('/api/v1/auth/signin')
    .send(credentials);

  return {
    accessToken: response.body[ACCESS_TOKEN],
    refreshToken: response.body[REFRESH_TOKEN],
  };
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    setAppConfig(app);

    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(userRepositoryToken);

    await userRepository.query('DELETE FROM "user";');
  });

  describe('POST:/api/v1/auth/signup', () => {
    it('should create a new user with role USER', async () => {
      const correctBody: WrongBody = {
        email: 'test@test.com',
        fullName: 'Test User',
        password: 'Str0ng_passW0rd',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(correctBody);

      expect(response.statusCode).toEqual(201);
      expect(response.body.roles).toContainEqual({ name: RolesEnum.User });
    });

    it('should return a 400 when some property is not provided', async () => {
      const wrongBody: WrongBody = {
        fullName: 'Test User',
        password: 'password',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(wrongBody);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toBeDefined();
    });

    it('should return a 400 when an invalid email is provided', async () => {
      const wrongBody: WrongBody = {
        email: 'test.com',
        fullName: 'Test User',
        password: 'Str0ng_passW0rd',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(wrongBody);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toBeDefined();
    });

    it('should return a 400 when a weak password is provided', async () => {
      const wrongBody: WrongBody = {
        email: 'test@test.com',
        fullName: 'Test User',
        password: 'weak-password',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send(wrongBody);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST:/api/v1/auth/signin', () => {
    beforeEach(async () => {
      await signupAndGetTokens(app);
    });

    it('shuld loging', async () => {
      const credentials: SignInDto = {
        email: registeredUser.email,
        password: registeredUser.password,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signin')
        .send(credentials);

      expect(response.statusCode).toEqual(201);
      expect(response.body[ACCESS_TOKEN]).toBeDefined();
      expect(response.body[REFRESH_TOKEN]).toBeDefined();
    });

    it('should return a 401 when invalid credentials are provided', async () => {
      const wriongCredentials: SignInDto = {
        email: registeredUser.email,
        password: registeredUser.password + 'asd',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/signin')
        .send(wriongCredentials);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST:/api/v1/auth/refresh-token', () => {
    let jwtTokens: SignInResponseDto;

    beforeEach(async () => {
      jwtTokens = await signupAndGetTokens(app);
    });

    it('shuld return a new access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh-token')
        .send({ [REFRESH_TOKEN]: jwtTokens.refreshToken });

      expect(response.statusCode).toEqual(201);
      expect(response.body[ACCESS_TOKEN]).toBeDefined();
    });

    it('should return 401 when invalid token is provided', async () => {
      const wrongRefreshToken = jwtTokens.refreshToken + 'asd';

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh-token')
        .send({ [REFRESH_TOKEN]: wrongRefreshToken });

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toBeDefined();
    });

    it('should return 401 when refresh token is not provided in the body', async () => {
      const response = await request(app.getHttpServer()).post(
        '/api/v1/auth/refresh-token',
      );

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST:/api/v1/auth/request-reset-password', () => {
    beforeEach(async () => {
      await signupAndGetTokens(app);
    });

    it('should return a token if email is valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/request-reset-password')
        .send({ email: registeredUser.email });

      expect(response.statusCode).toEqual(201);
      expect(response.text).toBeDefined();
    });

    it('should return 404 if user not found', async () => {
      const wrongEmail = registeredUser.email + 'asd';

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/request-reset-password')
        .send({ email: wrongEmail });

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST:/api/v1/auth/reset-password', () => {
    let resetPasswordToken: string;

    beforeEach(async () => {
      await signupAndGetTokens(app);

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/request-reset-password')
        .send({ email: registeredUser.email });

      resetPasswordToken = response.text;
    });

    it('should return Success if data is valid', async () => {
      const newPassword = registeredUser.password + '2';

      const body: ResetPasswordDto = {
        email: registeredUser.email,
        password: newPassword,
        resetPasswordToken,
      };
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/reset-password')
        .send(body);

      expect(response.statusCode).toEqual(201);
      expect(response.text).toEqual('Success');
    });

    it('should return 404 if the token or email are invalids', async () => {
      const newPassword = registeredUser.password + '2';

      const wrongBody: ResetPasswordDto = {
        email: registeredUser.email + 'asd',
        password: newPassword,
        resetPasswordToken,
      };
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/reset-password')
        .send(wrongBody);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET:/api/v1/auth/check-status', () => {
    let jwtTokens: SignInResponseDto;

    beforeEach(async () => {
      jwtTokens = await signupAndGetTokens(app);
    });

    it('should return 200 and user data if the access token is valid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/check-status')
        .set('Authorization', `Bearer ${jwtTokens.accessToken}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body.user).toBeDefined();
    });

    it('should return 401 if the access token is not valid', async () => {
      const wrongJwtToken = jwtTokens.accessToken + 'asd';

      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/check-status')
        .set('Authorization', `Bearer ${wrongJwtToken}`);

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toBeDefined();
    });
  });
});

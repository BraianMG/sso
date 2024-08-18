import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserRoleGuard } from './guards/userRole.guard';
import { ResetPasswordDto, SignInDto, SignUpDto } from './dto';
import { User } from '@core/database/entities/user.entity';
import { RolesEnum } from './enums';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
            refreshToken: jest.fn(),
            requestResetPassword: jest.fn(),
            resetPassword: jest.fn(),
            checkStatus: jest.fn(),
          },
        },
        Reflector,
        {
          provide: UserRoleGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('authController should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('POST:/signup', () => {
    it('should invoke authService with the received values', async () => {
      const mockSignUpDto: SignUpDto = {
        email: 'test@test.com',
        fullName: 'Test User',
        password: 'password',
      };

      await authController.signup(mockSignUpDto);

      expect(authService.signup).toHaveBeenCalledTimes(1);
      expect(authService.signup).toHaveBeenCalledWith(mockSignUpDto);
    });
  });

  describe('POST:/signin', () => {
    it('should invoke authService with the received values', async () => {
      const mockSignInDto: SignInDto = {
        email: 'test@test.com',
        password: 'password',
      };

      await authController.signin(mockSignInDto);

      expect(authService.signin).toHaveBeenCalledTimes(1);
      expect(authService.signin).toHaveBeenCalledWith(mockSignInDto);
    });
  });

  describe('POST:/refresh-token', () => {
    it('should invoke authService with the received values', async () => {
      const mockUser: User = {
        email: 'test@test.com',
        fullName: 'Test User',
        password: 'password',
        isActive: true,
        roles: [{ name: RolesEnum.User }],
      };

      await authController.refreshToken(mockUser);

      expect(authService.refreshToken).toHaveBeenCalledTimes(1);
      expect(authService.refreshToken).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('POST:/request-reset-password', () => {
    it('should invoke authService with the received values', async () => {
      const email: string = 'test@test.com';

      await authController.requestResetPassword(email);

      expect(authService.requestResetPassword).toHaveBeenCalledTimes(1);
      expect(authService.requestResetPassword).toHaveBeenCalledWith(email);
    });
  });

  describe('POST:/reset-password', () => {
    it('should invoke authService with the received values', async () => {
      const mockResetPasswordDto: ResetPasswordDto = {
        email: 'test@test.com',
        password: 'new_password',
        resetPasswordToken: 'token',
      };

      await authController.resetPassword(mockResetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledTimes(1);
      expect(authService.resetPassword).toHaveBeenCalledWith(
        mockResetPasswordDto,
      );
    });
  });

  describe('POST:/check-status', () => {
    it('should invoke authService with the received values', async () => {
      const mockUser: User = {
        email: 'test@test.com',
        fullName: 'Test User',
        password: 'password',
        isActive: true,
        roles: [{ name: RolesEnum.User }],
      };

      await authController.checkStatus(mockUser);

      expect(authService.checkStatus).toHaveBeenCalledTimes(1);
      expect(authService.checkStatus).toHaveBeenCalledWith(mockUser);
    });
  });
});

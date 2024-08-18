import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RolesEnum } from './enums';
import { User } from '@core/database/entities/user.entity';
import { ResetPasswordDto, SignInDto, SignUpDto } from './dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

const encriptedPassword = '_.encripted__password._';
const mockedToken = 'mocked_token';
const mockedUuid = '123-1234-1234-1234-123';

const getEncryptedPassword = jest.fn();
const comparePasswords = jest.fn();
const getUuid = jest.fn();

jest.mock('bcrypt', () => ({
  hashSync: () => getEncryptedPassword(),
  compareSync: () => comparePasswords(),
}));

jest.mock('uuid', () => ({
  v4: () => getUuid(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            getUserAndValidateStatus: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(mockedToken),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mocked_value'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('usersService should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('jwtService should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('sign up', () => {
    it('should signup a user', async () => {
      const mockSignUpDto: SignUpDto = {
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test User',
      };

      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        fullName: 'Test User',
        roles: [{ name: RolesEnum.User }],
        isActive: true,
        password: 'password',
      };

      const expectedResult = {
        id: '1',
        email: 'test@test.com',
        fullName: 'Test User',
        roles: [{ name: RolesEnum.User }],
        isActive: true,
      };

      getEncryptedPassword.mockReturnValueOnce(encriptedPassword);

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await authService.signup(mockSignUpDto);

      expect(result).toEqual(expectedResult);
      expect(usersService.create).toHaveBeenCalledWith({
        ...mockSignUpDto,
        password: encriptedPassword,
      });
    });
  });

  describe('sign in', () => {
    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const mockSignInDto: SignInDto = {
        email: 'test@test.com',
        password: 'wrong',
      };

      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        fullName: 'Test User',
        roles: [{ name: RolesEnum.User }],
        isActive: true,
        password: 'password',
      };

      comparePasswords.mockReturnValueOnce(false);

      jest
        .spyOn(usersService, 'getUserAndValidateStatus')
        .mockResolvedValue(mockUser);

      await expect(authService.signin(mockSignInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return the access and refresh token if the credentials are valid', async () => {
      const mockSignInDto: SignInDto = {
        email: 'test@test.com',
        password: 'wrong',
      };

      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        fullName: 'Test User',
        roles: [{ name: RolesEnum.User }],
        isActive: true,
        password: 'password',
      };

      const expectedResult = {
        accessToken: mockedToken,
        refreshToken: mockedToken,
      };

      comparePasswords.mockReturnValueOnce(true);

      jest
        .spyOn(usersService, 'getUserAndValidateStatus')
        .mockResolvedValue(mockUser);

      const result = await authService.signin(mockSignInDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('refresh token', () => {
    it('should generate a new access token with refreshToken', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@test.com',
        fullName: 'Test User',
        roles: [{ name: RolesEnum.User }],
        isActive: true,
        password: 'password',
      };

      const expectedResult = { accessToken: mockedToken };

      const result = await authService.refreshToken(mockUser);

      expect(result).toEqual(expectedResult);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        useremail: mockUser.email,
      });
    });
  });

  describe('request reset password', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      fullName: 'Test User',
      roles: [{ name: RolesEnum.User }],
      isActive: true,
      password: 'password',
    };

    beforeEach(() => {
      getUuid.mockReturnValue(mockedUuid);

      jest
        .spyOn(usersService, 'getUserAndValidateStatus')
        .mockResolvedValue(mockUser);
    });

    it('should update the user data with the generated token to reset password', async () => {
      await authService.requestResetPassword(mockUser.email);

      expect(usersService.update).toHaveBeenCalledTimes(1);
      expect(usersService.update).toHaveBeenCalledWith(mockUser.id, {
        ...mockUser,
        resetPasswordToken: mockedUuid,
      });
    });

    it('should return a token if the user data was successfully updated', async () => {
      const expectedResult = mockedUuid;

      const result = await authService.requestResetPassword(mockUser.email);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('reset password', () => {
    const invalidResetPasswordToken = '123';
    const expectedResult = 'Success';

    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      fullName: 'Test User',
      roles: [{ name: RolesEnum.User }],
      isActive: true,
      password: 'password',
      resetPasswordToken: mockedUuid,
    };

    const mockInvalidResetPasswordDto: ResetPasswordDto = {
      email: mockUser.email,
      password: 'new_password',
      resetPasswordToken: invalidResetPasswordToken,
    };

    const mockValidResetPasswordDto: ResetPasswordDto = {
      email: mockUser.email,
      password: 'new_password',
      resetPasswordToken: mockUser.resetPasswordToken,
    };

    beforeEach(() => {
      getUuid.mockReturnValue(mockedUuid);

      jest
        .spyOn(usersService, 'getUserAndValidateStatus')
        .mockResolvedValue(mockUser);
    });

    it('should throw BadRequestException if the received token is invalid', async () => {
      await expect(
        authService.resetPassword(mockInvalidResetPasswordDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update user password if the received token is valid', async () => {
      getEncryptedPassword.mockReturnValue(encriptedPassword);

      await authService.resetPassword(mockValidResetPasswordDto);

      expect(usersService.update).toHaveBeenCalledTimes(1);
      expect(usersService.update).toHaveBeenCalledWith(mockUser.id, {
        ...mockUser,
        resetPasswordToken: null,
      });
    });

    it('should return Success if everything went well', async () => {
      const result = await authService.resetPassword(mockValidResetPasswordDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe.skip('check status', () => {
    it('should not be necessary', () => {});
  });

  describe.skip('get jwt access token', () => {
    it('should not be necessary', () => {});
  });

  describe.skip('get jwt refresh token', () => {
    it('should not be necessary', () => {});
  });
});

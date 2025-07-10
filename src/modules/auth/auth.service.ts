import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  SignInResponseDto,
  RefreshTokenReponseDto,
} from './dto';
import { UsersService } from '@modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { User } from '@core/database/entities/user.entity';
import { v4 as uuid } from 'uuid';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  saltOrRounds = Number(this.configService.get<number>('BCRYPT_SALTORROUNDS'));

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const { password, ...userData } = signUpDto;

    const user = await this.usersService.create({
      ...userData,
      password: bcrypt.hashSync(password, this.saltOrRounds),
    });
    delete user.password;
    user.roles = user.roles.map((role) => ({
      name: role.name,
    }));

    return user;
  }

  async signin(signInDto: SignInDto): Promise<SignInResponseDto> {
    const { email, password } = signInDto;

    const user = await this.usersService.getUserAndValidateStatus({
      where: { email },
      relations: ['roles'],
      select: {
        email: true,
        password: true,
        id: true,
        isActive: true,
        fullName: true,
        roles: {
          name: true,
        },
      },
    });

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;
    delete user.isActive;

    const accessToken = this.getJwtAccessToken({
      sub: user.id,
      useremail: user.email,
    });

    const refreshToken = this.getJwtRefreshToken({
      sub: user.id,
      useremail: user.email,
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(user: User): Promise<RefreshTokenReponseDto> {
    const accessToken = this.getJwtAccessToken({
      sub: user.id,
      useremail: user.email,
    });

    return { accessToken };
  }

  async requestResetPassword(email: string): Promise<string> {
    const user = await this.usersService.getUserAndValidateStatus({
      where: { email },
    });

    const resetPasswordToken = uuid();

    user.resetPasswordToken = resetPasswordToken;

    const subject = 'Reestablecer contraseña';
    const message = `Hola ${user.fullName}.<br>Utiliza el siguiente código para reestablecer tu contraseña: ${resetPasswordToken}`;

    try {
      await this.usersService.update(user.id, user);
      await this.notificationsService.sendEmail(
        email,
        subject,
        message,
        message,
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }

    return resetPasswordToken;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { email, password, resetPasswordToken } = resetPasswordDto;
    const user = await this.usersService.getUserAndValidateStatus({
      where: { email },
    });

    if (
      user.resetPasswordToken &&
      user.resetPasswordToken !== resetPasswordToken
    ) {
      throw new BadRequestException('Invalid Token');
    }

    try {
      user.password = bcrypt.hashSync(password, this.saltOrRounds);
      user.resetPasswordToken = null;
      await this.usersService.update(user.id, user);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return 'Success';
  }

  async checkStatus(user: User) {
    const { id, email, fullName, roles } = user;
    return { user: { id, email, fullName, roles } };
  }

  private getJwtAccessToken(payload: JwtPayload): string {
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  private getJwtRefreshToken(payload: JwtPayload): string {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });
    return refreshToken;
  }
}

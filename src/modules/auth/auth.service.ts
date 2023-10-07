import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResetPasswordDto, SignInDto, SignUpDto } from './dto';
import { UsersService } from '@modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { User } from '@core/database/entities/user.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  saltOrRounds = Number(this.configService.get<number>('BCRYPT_SALTORROUNDS'));

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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

  async signin(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.usersService.findOneWithOptions({
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

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials');

    delete user.password;
    delete user.isActive;

    const access_token = this.getJwtToken({
      sub: user.id,
      useremail: user.email,
    });

    return { access_token };
  }

  async requestResetPassword(email: string): Promise<string> {
    const user = await this.usersService.findOneWithOptions({
      where: { email },
    });

    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin');

    const resetPasswordToken = uuid();

    user.resetPasswordToken = resetPasswordToken;

    try {
      await this.usersService.update(user.id, user);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return resetPasswordToken;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { email, password, resetPasswordToken } = resetPasswordDto;
    const user = await this.usersService.findOneWithOptions({
      where: { email },
    });

    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin');

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

  private getJwtToken(payload: JwtPayload): string {
    const access_token = this.jwtService.sign(payload);
    return access_token;
  }
}

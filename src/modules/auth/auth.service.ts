import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { UsersService } from '@modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { User } from '@core/database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const { password, ...userData } = signUpDto;
    const saltOrRounds = Number(
      this.configService.get<number>('BCRYPT_SALTORROUNDS'),
    );

    const user = await this.usersService.create({
      ...userData,
      password: bcrypt.hashSync(password, saltOrRounds),
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

  async checkStatus(user: User) {
    const { id, email, fullName, roles } = user;
    return { user: { id, email, fullName, roles } };
  }

  private getJwtToken(payload: JwtPayload): string {
    const access_token = this.jwtService.sign(payload);
    return access_token;
  }
}

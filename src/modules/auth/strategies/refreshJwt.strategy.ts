import { User } from '@core/database/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces';
import { UsersService } from '@modules/users/users.service';
import { REFRESH_TOKEN } from '../constants';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromBodyField(REFRESH_TOKEN),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub } = payload;

    const user = await this.usersService.getUserAndValidateStatus({
      where: { id: sub },
      relations: ['roles'],
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        isActive: true,
        roles: {
          id: false,
          createdAt: false,
          updatedAt: false,
          deletedAt: false,
          name: true,
        },
      },
    });

    return user;
  }
}

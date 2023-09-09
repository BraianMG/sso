import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { UsersService } from '@modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(signUpDto: SignUpDto) {
    return this.usersService.create(signUpDto);
  }

  async signin(signInDto: SignInDto) {
    console.log(signInDto);
    return signInDto;
  }
}

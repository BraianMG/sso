import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordDto, SignInDto, SignUpDto } from './dto';
import { Auth, GetUser } from './decorators';
import { User } from '@core/database/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Post('signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @Post('request-reset-password')
  requestResetPassword(@Body('email') email: string) {
    return this.authService.requestResetPassword(email);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('check-status')
  @Auth()
  checkStatus(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }
}

import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RefreshTokenDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  TokensResponseDto,
} from './dto';
import { Auth, GetUser } from './decorators';
import { User } from '@core/database/entities/user.entity';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Post('signin')
  signin(@Body() signInDto: SignInDto): Promise<TokensResponseDto> {
    return this.authService.signin(signInDto);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard)
  refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @GetUser() user: User,
  ): Promise<TokensResponseDto> {
    return this.authService.refresh(user, refreshTokenDto);
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

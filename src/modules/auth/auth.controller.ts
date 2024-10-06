import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  SignInResponseDto,
  RefreshTokenReponseDto,
} from './dto';
import { Auth, GetUser } from './decorators';
import { User } from '@core/database/entities/user.entity';
import { RefreshJwtGuard } from './guards/refreshJwtAuth.guard';
import { RolesEnum } from './enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Post('signin')
  signin(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signin(signInDto);
  }

  @Post('refresh-token')
  @UseGuards(RefreshJwtGuard)
  refreshToken(@GetUser() user: User): Promise<RefreshTokenReponseDto> {
    return this.authService.refreshToken(user);
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

  //#region Test routes
  @Get('admins-only')
  @Auth(RolesEnum.Admin)
  async adminsOnly(): Promise<string> {
    return 'Hello admin!'
  }

  @Get('users-only')
  @Auth(RolesEnum.User)
  async usersOnly(): Promise<string> {
    return 'Hello user!'
  }

  @Get('public')
  async public(): Promise<string> {
    return 'Hello anonymous user!'
  }
  //#endregion
}

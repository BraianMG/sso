import { IsString, IsUUID } from 'class-validator';
import { SignInDto } from './signIn.dto';

export class ResetPasswordDto extends SignInDto {
  @IsString()
  @IsUUID()
  resetPasswordToken: string;
}

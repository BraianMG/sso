import { IsString, IsUUID } from 'class-validator';
import { SignInDto } from './sign-in.dto';

export class ResetPasswordDto extends SignInDto {
  @IsString()
  @IsUUID()
  resetPasswordToken: string;
}

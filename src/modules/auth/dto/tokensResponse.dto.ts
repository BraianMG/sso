import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

export class TokensResponseDto {
  [ACCESS_TOKEN]: string;
  [REFRESH_TOKEN]: string;
}

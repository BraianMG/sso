import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../enums';
import { META_ROLES } from '../constants';

export const RoleProtected = (...args: RolesEnum[]) => {
  return SetMetadata(META_ROLES, args);
};

import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/userRole.guard';
import { RoleProtected } from './roleProtected.decorator';
import { RolesEnum } from '../enums';

export function Auth(...roles: RolesEnum[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}

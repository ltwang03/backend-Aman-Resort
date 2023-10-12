import { ROLES_KEY } from '../../common';
import { Role } from './role.enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '@app/shared/guards/roles.guard';

export const Roles = (...roles: Role[]) => {
  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
};

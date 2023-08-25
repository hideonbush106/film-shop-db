import { SetMetadata } from '@nestjs/common/decorators/core';
import { Role as RoleEnum } from '@prisma/client';

export const Role = (role: RoleEnum) => SetMetadata('role', role);

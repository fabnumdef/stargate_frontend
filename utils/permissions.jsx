import { ROLES } from './constants/enums';

export const isAdmin = (userRole) => (
  userRole === ROLES.ROLE_ADMIN
);

export const isSuperAdmin = (userRole) => (
  userRole === ROLES.ROLE_SUPERADMIN
);

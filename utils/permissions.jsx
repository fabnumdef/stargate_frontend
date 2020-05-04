import { ROLES } from './constants/enums';

// Waiting for other exports
// eslint-disable-next-line import/prefer-default-export
export const isAdmin = (userRole) => (
  userRole === ROLES.ROLE_SUPERADMIN || userRole === ROLES.ROLE_ADMIN
);

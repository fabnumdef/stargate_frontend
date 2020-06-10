import { ROLES } from './constants/enums';

export const isAdmin = (userRole) => (
  userRole === ROLES.ROLE_ADMIN.role
);

export const isSuperAdmin = (userRole) => (
  userRole === ROLES.ROLE_SUPERADMIN.role
);

export const urlAuthorization = (path, role) => {
  const allRoles = [
    '/',
    '/compte',
    '/login',
    '/contact',
    '/no-route',
  ];
  switch (true) {
    case allRoles.includes(path):
      return true;
    case path.includes('/administration/utilisateurs'):
      return role === ROLES.ROLE_ADMIN.role
        || role === ROLES.ROLE_SUPERADMIN.role
        || role === ROLES.ROLE_UNIT_CORRESPONDENT.role;
    case path === '/nouvelle-demande':
      return role === ROLES.ROLE_UNIT_CORRESPONDENT.role
        || role === ROLES.ROLE_SECURITY_OFFICER.role
        || role === ROLES.ROLE_ACCESS_OFFICE.role
        || role === ROLES.ROLE_HOST.role;
    default:
      return false;
  }
};

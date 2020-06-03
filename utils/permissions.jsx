import { ROLES } from './constants/enums';

export const isAdmin = (userRole) => (
  userRole === ROLES.ROLE_ADMIN
);

export const isSuperAdmin = (userRole) => (
  userRole === ROLES.ROLE_SUPERADMIN
);

export const urlAuthorization = (path, userRole) => {
  const allRoles = [
    '/',
    '/compte',
    '/login',
    '/contact',
  ];

  switch (true) {
    case allRoles.includes(path):
      return true;
    case path.includes('/administration/utilisateurs'):
      return userRole === (ROLES.ROLE_ADMIN || ROLES.ROLE_SUPERADMIN);
    case path === '/nouvelle-demande':
      return userRole !== (ROLES.ROLE_SUPERADMIN || ROLES.ROLE_OBSERVER || ROLES.ROLE_SCREENING);
    default:
      return false;
  }
};

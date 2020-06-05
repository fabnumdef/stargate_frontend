import gql from 'graphql-tag';
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
      return role === (ROLES.ROLE_ADMIN.role || ROLES.ROLE_SUPERADMIN.role);
    case path === '/nouvelle-demande':
      return role !== (
        ROLES.ROLE_SUPERADMIN.role
        || ROLES.ROLE_OBSERVER.role
        || ROLES.ROLE_SCREENING.role
      );
    default:
      return false;
  }
};

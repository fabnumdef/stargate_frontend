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
      return [
        ROLES.ROLE_ADMIN.role,
        ROLES.ROLE_SUPERADMIN.role,
        ROLES.ROLE_UNIT_CORRESPONDENT.role,
      ].includes(role);
    case path === '/nouvelle-demande':
      return [
        ROLES.ROLE_UNIT_CORRESPONDENT.role,
        ROLES.ROLE_SECURITY_OFFICER.role,
        ROLES.ROLE_ACCESS_OFFICE.role,
        ROLES.ROLE_HOST.role,
      ].includes(role);
    case path.includes('/demandes/'):
      return [
        ROLES.ROLE_UNIT_CORRESPONDENT.role,
        ROLES.ROLE_SECURITY_OFFICER.role,
        ROLES.ROLE_ACCESS_OFFICE.role,
        ROLES.ROLE_SCREENING.role,
      ].includes(role);
    default:
      return false;
  }
};

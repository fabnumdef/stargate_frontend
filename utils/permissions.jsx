import { ROLES } from './constants/enums';

export const isAdmin = (userRole) => (
  userRole === ROLES.ROLE_ADMIN.role
);

export const isSuperAdmin = (userRole) => (
  userRole === ROLES.ROLE_SUPERADMIN.role
);

export const urlAuthorization = (path, role) => {
  const allRoles = [
    '/compte',
    '/login',
    '/contact',
    '/no-route',
  ];
  switch (true) {
    case allRoles.includes(path):
      return true;
    case path === '/':
      return [
        ROLES.ROLE_ADMIN.role,
        ROLES.ROLE_UNIT_CORRESPONDENT.role,
        ROLES.ROLE_SECURITY_OFFICER.role,
        ROLES.ROLE_ACCESS_OFFICE.role,
        ROLES.ROLE_SCREENING.role,
        ROLES.ROLE_HOST.role,
      ].includes(role);
    case path.includes('/administration/unites'):
    case path.includes('/administration/utilisateurs'):
      return [
        ROLES.ROLE_ADMIN.role,
        ROLES.ROLE_SUPERADMIN.role,
        ROLES.ROLE_UNIT_CORRESPONDENT.role,
      ].includes(role);
    case path === '/nouvelle-demande':
    case path.includes('/demandes/en-cours'):
      return [
        ROLES.ROLE_UNIT_CORRESPONDENT.role,
        ROLES.ROLE_SECURITY_OFFICER.role,
        ROLES.ROLE_ACCESS_OFFICE.role,
        ROLES.ROLE_HOST.role,
      ].includes(role);
    case path.includes('/demandes/a-traiter'):
      return [
        ROLES.ROLE_UNIT_CORRESPONDENT.role,
        ROLES.ROLE_SECURITY_OFFICER.role,
        ROLES.ROLE_ACCESS_OFFICE.role,
        ROLES.ROLE_SCREENING.role,
      ].includes(role);
    case path.includes('/demandes/traitees'):
      return [
        ROLES.ROLE_UNIT_CORRESPONDENT.role,
        ROLES.ROLE_SECURITY_OFFICER.role,
        ROLES.ROLE_ACCESS_OFFICE.role,
        ROLES.ROLE_SCREENING.role,
        ROLES.ROLE_HOST.role,
      ].includes(role);
    default:
      return false;
  }
};

export const checkRequestDetailAuth = (data, activeRole) => {
  const isInWorkflow = data.getCampus.getRequest.listVisitors.list.find(
    (visitor) => visitor.status.find(
      (s) => (s.unitId === activeRole.unit || !activeRole.unit) && s.steps.find(
        (step) => step.role === activeRole.role,
      ),
    ),
  );
  return !!isInWorkflow;
};

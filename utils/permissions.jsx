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
  ];
  switch (true) {
    case allRoles.includes(path):
      return true;
    case path === '/':
      return [
        ROLES.ROLE_UNIT_CORRESPONDENT.role,
        ROLES.ROLE_SECURITY_OFFICER.role,
        ROLES.ROLE_ACCESS_OFFICE.role,
        ROLES.ROLE_SCREENING.role,
        ROLES.ROLE_HOST.role,
        ROLES.ROLE_OBSERVER.role,
        ROLES.ROLE_GATEKEEPER.role,
      ].includes(role);
    case path.includes('/administration/base'):
    case path.includes('/administration/unites'):
      return [
        ROLES.ROLE_ADMIN.role,
      ].includes(role);
    case path === '/administration':
    case path.includes('/administration/utilisateurs'):
      return [
        ROLES.ROLE_ADMIN.role,
        ROLES.ROLE_SUPERADMIN.role,
        ROLES.ROLE_UNIT_CORRESPONDENT.role,
      ].includes(role);
    case path === '/mes-demandes':
    case path === '/nouvelle-demande':
    case path === '/nouvelle-demande-groupe':
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
      // @todo change to false when its over
      return true;
  }
};

export const checkRequestDetailAuth = (data, activeRole) => {
  const isInWorkflow = data.getCampus.getRequest.listVisitors.list.find(
    (visitor) => visitor.units.find(
      (u) => (u.id === activeRole.unit || !activeRole.unit) && u.steps.find(
        (step) => step.role === activeRole.role,
      ),
    ),
  );
  return !!isInWorkflow;
};

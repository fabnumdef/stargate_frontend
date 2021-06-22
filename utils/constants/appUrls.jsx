export const ADMIN_CAMPUS_ADMINISTRATION = '/administration/base';
export const ADMIN_CAMPUS_EDITION = (id) => `/administration/base/${id}/edition`;
export const ADMIN_CAMPUS_MANAGEMENT = (id) => `/administration/base/${id}`;
export const ADMIN_CAMPUS_ROLE_EDITION = (campusId) => `/administration/base/${campusId}/role`;
export const ADMIN_CAMPUS_PLACES_EDITION = (campusId) => `/administration/base/${campusId}/lieux`;
export const ADMIN_CAMPUS_UNITS_EDITION = (campusId, id) =>
    `/administration/base/${campusId}/unites/${id}`;
export const ADMIN_CAMPUS_UNIT_CREATE = (campusId) =>
    `/administration/base/${campusId}/unites/creation`;

export const REQUEST_OBJECT = {
  PRIVATE: 'PRIVATE',
  PROFESSIONAL: 'PROFESSIONAL',
};

export const ROLES = {
  ROLE_SUPERADMIN: { role: 'ROLE_SUPERADMIN', label: 'Super Administrateur' },
  ROLE_ADMIN: { role: 'ROLE_ADMIN', label: 'Administrateur' },
  ROLE_UNIT_CORRESPONDENT: { role: 'ROLE_UNIT_CORRESPONDENT', label: "Correspondant d'unité" },
  ROLE_SECURITY_OFFICER: { role: 'ROLE_SECURITY_OFFICER', label: 'Officier de sécurité' },
  ROLE_ACCESS_OFFICE: { role: 'ROLE_ACCESS_OFFICE', label: 'Bureau des accès' },
  ROLE_SCREENING: { role: 'ROLE_SCREENING', label: 'Criblage' },
  ROLE_HOST: { role: 'ROLE_HOST', label: 'Hôte' },
  ROLE_OBSERVER: { role: 'ROLE_OBSERVER', label: 'Observateur' },
};

export const STATE_REQUEST = {
  STATE_DRAFTED: { state: 'drafted' },
  STATE_CREATED: { state: 'created' },
  STATE_CANCELED: { state: 'canceled' },
  STATE_REMOVED: { state: 'removed' },
  STATE_ACCEPTED: { state: 'accepted' },
  STATE_REJECTED: { state: 'rejeted' },
  STATE_MIXED: { state: 'mixed' },
};

export const ID_DOCUMENT = {
  IDCARD: 'IDCard',
  PASSPORT: 'Passport',
  CIMSCARD: 'CIMSCard',
};

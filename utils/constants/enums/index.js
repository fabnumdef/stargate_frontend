export const REQUEST_OBJECT = {
  PRIVATE: 'PRIVATE',
  PROFESSIONAL: 'PROFESSIONAL',
};

export const WORKFLOW_BEHAVIOR = {
  VALIDATION: {
    positive: 'accept',
    negative: 'reject',
  },
  ADVISEMENT: {
    positive: 'positive',
    negative: 'negative',
    externally: 'externally',
  },
  INFORMATION: {
    positive: 'validated',
  },
};

export const ROLES = {
  ROLE_SUPERADMIN: { role: 'ROLE_SUPERADMIN', label: 'Super Administrateur' },
  ROLE_ADMIN: { role: 'ROLE_ADMIN', label: 'Administrateur' },
  ROLE_UNIT_CORRESPONDENT: { role: 'ROLE_UNIT_CORRESPONDENT', label: "Correspondant d'unité", workflow: WORKFLOW_BEHAVIOR.VALIDATION },
  ROLE_SECURITY_OFFICER: { role: 'ROLE_SECURITY_OFFICER', label: 'Officier de sécurité', workflow: WORKFLOW_BEHAVIOR.VALIDATION },
  ROLE_ACCESS_OFFICE: { role: 'ROLE_ACCESS_OFFICE', label: 'Bureau des accès', workflow: WORKFLOW_BEHAVIOR.VALIDATION },
  ROLE_SCREENING: { role: 'ROLE_SCREENING', label: 'Criblage', workflow: WORKFLOW_BEHAVIOR.ADVISEMENT },
  ROLE_HOST: { role: 'ROLE_HOST', label: 'Hôte' },
  ROLE_OBSERVER: { role: 'ROLE_OBSERVER', label: 'Observateur', workflow: WORKFLOW_BEHAVIOR.INFORMATION },
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

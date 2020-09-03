export const REQUEST_OBJECT = {
  PRIVATE: 'PRIVATE',
  PROFESSIONAL: 'PROFESSIONAL',
};

export const WORKFLOW_BEHAVIOR = {
  VALIDATION: {
    value: 'VALIDATION',
    RESPONSE: {
      positive: 'ACCEPTED',
      negative: 'REJECTED',
    },
  },
  ADVISEMENT: {
    value: 'ADVISEMENT',
    RESPONSE: {
      positive: 'POSITIVE',
      negative: 'NEGATIVE',
      externally: 'EXTERNALLY',
    },
  },
  INFORMATION: {
    value: 'INFORMATION',
    RESPONSE: {
      positive: 'validated',
    },
  },
};

export const VISITOR_STATUS = {
  ACCEPTED: 'Accepté',
  REJECTED: 'Refusé',
  MIXED: 'Partiellement accepté',
  CREATED: 'En cours',
  CANCELED: 'Annulé',
};

export const ROLES = {
  ROLE_SUPERADMIN: { role: 'ROLE_SUPERADMIN', label: 'Super Administrateur' },
  ROLE_ADMIN: { role: 'ROLE_ADMIN', label: 'Administrateur' },
  ROLE_UNIT_CORRESPONDENT: {
    role: 'ROLE_UNIT_CORRESPONDENT',
    label: "Correspondant d'unité",
    shortLabel: 'CU',
    workflow: WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE,
    behavior: WORKFLOW_BEHAVIOR.VALIDATION.value,
  },
  ROLE_SECURITY_OFFICER: {
    role: 'ROLE_SECURITY_OFFICER',
    label: 'Officier de sécurité',
    shortLabel: 'OS',
    workflow: WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE,
    behavior: WORKFLOW_BEHAVIOR.VALIDATION.value,
  },
  ROLE_ACCESS_OFFICE: {
    role: 'ROLE_ACCESS_OFFICE',
    label: 'Bureau des accès',
    shortLabel: 'BA',
    workflow: WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE,
    behavior: WORKFLOW_BEHAVIOR.VALIDATION.value,
  },
  ROLE_SCREENING: {
    role: 'ROLE_SCREENING',
    label: 'Criblage',
    workflow: WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE,
    behavior: WORKFLOW_BEHAVIOR.ADVISEMENT.value,
  },
  ROLE_HOST: { role: 'ROLE_HOST', label: 'Hôte' },
  ROLE_OBSERVER: {
    role: 'ROLE_OBSERVER',
    label: 'Observateur',
    workflow: WORKFLOW_BEHAVIOR.INFORMATION.RESPONSE,
    behavior: WORKFLOW_BEHAVIOR.INFORMATION.value,
  },
};

export const STATE_REQUEST = {
  STATE_DRAFTED: { state: 'DRAFTED' },
  STATE_CREATED: { state: 'CREATED' },
  STATE_CANCELED: { state: 'CANCELED' },
  STATE_REMOVED: { state: 'REMOVED' },
  STATE_ACCEPTED: { state: 'ACCEPTED' },
  STATE_REJECTED: { state: 'REJECTED' },
  STATE_MIXED: { state: 'MIXED' },
};

export const ID_DOCUMENT = {
  IDCARD: 'IDCard',
  PASSPORT: 'Passport',
  CIMSCARD: 'CIMSCard',
};

export const EMPLOYEE_TYPE = {
  TYPE_VISITOR: 'Visiteur',
  TYPE_SUBCONTRACTOR: 'Sous-traitant',
  TYPE_INTERIM: 'Intérimaire',
  TYPE_TRAINEE: 'Stagiaire',
  TYPE_DELIVERER: 'Livreur',
  TYPE_ACTIVE_MILITARY: "Militaire d'active",
  TYPE_RESERVIST: 'Réserviste',
  TYPE_CIVILIAN_DEFENSE: 'Civil de la défense',
  TYPE_FAMILY: 'Famille',
  TYPE_AUTHORITY: 'Autorité',
};

export const FORMS_LIST = {
  CORRES_ASSISTANTS: 'CORRES_ASSISTANTS',
  OFFICER_ASSISTANTS: 'OFFICER_ASSISTANTS',
  ADMIN_ASSISTANTS: 'ADMIN_ASSISTANTS',
};

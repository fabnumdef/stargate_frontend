export const REQUEST_OBJECT = {
    PRIVATE: 'PRIVATE',
    PROFESSIONAL: 'PROFESSIONAL'
};

export const WORKFLOW_BEHAVIOR = {
    VALIDATION: {
        value: 'VALIDATION',
        RESPONSE: {
            positive: 'ACCEPTED',
            negative: 'REJECTED'
        }
    },
    ADVISEMENT: {
        value: 'ADVISEMENT',
        RESPONSE: {
            positive: 'POSITIVE',
            negative: 'NEGATIVE',
            externally: 'EXTERNALLY'
        }
    },
    INFORMATION: {
        value: 'INFORMATION',
        RESPONSE: {
            positive: 'validated'
        }
    }
};

export const VISITOR_STATUS = {
    ACCEPTED: 'Accepté',
    REJECTED: 'Refusé',
    MIXED: 'Partiellement accepté',
    CREATED: 'En cours',
    CANCELED: 'Annulé'
};

export const ROLES = {
    ROLE_SUPERADMIN: {
        role: 'ROLE_SUPERADMIN',
        label: 'Super Administrateur',
        shortLabel: 'SA',
        permission: [
            '/',
            '/a-propos',
            '/contactez-nous',
            '/compte',
            '/administration',
            '/administration/base',
            '/administration/base/creation',
            '/administration/utilisateurs',
            '/administration/utilisateurs/creation'
        ]
    },
    ROLE_ADMIN: {
        role: 'ROLE_ADMIN',
        label: 'Administrateur',
        shortLabel: 'A',
        permission: [
            '/',
            '/a-propos',
            '/contactez-nous',
            '/compte',
            '/administration',
            '/administration/base',
            '/administration/utilisateurs',
            '/administration/utilisateurs/creation'
        ]
    },
    ROLE_UNIT_CORRESPONDENT: {
        role: 'ROLE_UNIT_CORRESPONDENT',
        label: "Correspondant d'unité",
        shortLabel: 'CORR U',
        workflow: WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE,
        behavior: WORKFLOW_BEHAVIOR.VALIDATION.value,
        permission: [
            '/',
            '/a-propos',
            '/contactez-nous',
            '/compte',
            '/demandes',
            '/mes-traitements',
            '/nouvelle-demande',
            '/nouvelle-demande/simple',
            '/nouvelle-demande/groupe',
            '/administration',
            '/administration/utilisateurs'
        ]
    },
    ROLE_SCREENING: {
        role: 'ROLE_SCREENING',
        label: 'Criblage',
        shortLabel: 'CRIBLAGE',
        workflow: WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE,
        behavior: WORKFLOW_BEHAVIOR.ADVISEMENT.value,
        permission: ['/', '/compte', '/a-propos', '/contactez-nous'],
        editable: true
    },
    ROLE_SECURITY_OFFICER: {
        role: 'ROLE_SECURITY_OFFICER',
        label: 'Officier de sécurité',
        shortLabel: 'OS',
        workflow: WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE,
        behavior: WORKFLOW_BEHAVIOR.VALIDATION.value,
        permission: [
            '/',
            '/a-propos',
            '/contactez-nous',
            '/compte',
            '/demandes',
            '/mes-traitements',
            '/nouvelle-demande',
            '/nouvelle-demande/simple',
            '/nouvelle-demande/groupe'
        ]
    },
    ROLE_ACCESS_OFFICE: {
        role: 'ROLE_ACCESS_OFFICE',
        label: 'Bureau des accès',
        shortLabel: 'BA',
        workflow: WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE,
        behavior: WORKFLOW_BEHAVIOR.VALIDATION.value,
        permission: ['/', '/a-propos', '/contactez-nous', '/compte'],
        editable: true
    },
    ROLE_HOST: {
        role: 'ROLE_HOST',
        label: 'Hôte',
        shortLabel: 'H',
        permission: [
            '/',
            '/compte',
            '/demandes',
            '/nouvelle-demande',
            '/nouvelle-demande/simple',
            '/nouvelle-demande/groupe',
            '/a-propos',
            '/contactez-nous'
        ]
    },
    ROLE_GATEKEEPER: {
        role: 'ROLE_GATEKEEPER',
        label: 'Gardien',
        shortLabel: 'G',
        permission: ['/', '/compte', '/a-propos', '/contactez-nous']
    },
    ROLE_OBSERVER: {
        role: 'ROLE_OBSERVER',
        label: 'Observateur',
        shortLabel: 'OBS.',
        permission: ['/', '/compte', '/a-propos', '/contactez-nous']
    }
};

export const STATE_REQUEST = {
    STATE_DRAFTED: { state: 'DRAFTED' },
    STATE_CREATED: { state: 'CREATED' },
    STATE_CANCELED: { state: 'CANCELED' },
    STATE_REMOVED: { state: 'REMOVED' },
    STATE_ACCEPTED: { state: 'ACCEPTED' },
    STATE_REJECTED: { state: 'REJECTED' },
    STATE_MIXED: { state: 'MIXED' }
};

export const ID_DOCUMENT = {
    IDCard: { label: "Carte d'identité", regex: /^[a-z0-9]+$/gi },
    Passport: { label: 'Passeport', regex: /^\d{2}[A-Za-z]{2}\d{5}$/ },
    CIMSCard: { label: 'Carte CIMS', regex: /^\d{10}$/ }
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
    TYPE_AUTHORITY: 'Autorité'
};

export const FORMS_LIST = {
    CORRES_ASSISTANTS: 'CORRES_ASSISTANTS',
    OFFICER_ASSISTANTS: 'OFFICER_ASSISTANTS',
    ADMIN_ASSISTANTS: 'ADMIN_ASSISTANTS'
};

export const VISITOR_INFOS = {
    firstname: 'Prénom',
    employeeType: 'Type employé',
    birthLastname: 'Nom de naissance',
    usageLastname: "Nom d'usage",
    rank: 'Grade',
    company: 'Unité/Entreprise',
    email: 'Mail',
    vip: 'VIP',
    vipReason: 'Motif VIP',
    nationality: 'Nationalitée',
    birthday: 'Date de Naissance',
    birthplace: 'Lieux de Naissance',
    kind: 'Type Document',
    reference: 'Numero Document'
};

export const ERROR_TYPE = {
    required: 'Ce champ est obligatoire',
    enum: 'Pas la valeur attendue',
    regexp: 'Mail non conforme',
    date: 'Format de date invalide'
};

export const ACCESS_OFFICE_VALIDATION_CHOICES = [
    {
        label: 'VA',
        description: 'Visiteur Accompagné',
        tags: ['VA'],
        mainList: true
    },
    {
        label: 'VL',
        description: 'Visiteur Libre',
        tags: ['VL'],
        mainList: true
    },
    {
        label: 'VIP',
        description: 'Visiteur Important',
        tags: ['VIP'],
        mainList: true
    },
    {
        label: 'HMSA',
        description: 'Hors MINARM Stagiaire accompagné',
        tags: ['-13'],
        mainList: false
    },
    {
        label: 'CIMS',
        description: 'Carte CIMS Nominative',
        tags: ['CIMS'],
        mainList: false
    }
];

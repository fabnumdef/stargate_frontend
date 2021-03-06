import { ROLES } from '../constants/enums';

export const workflowCards = Object.values(ROLES)
    .filter((role) => role.workflow)
    .map((role, i) => ({
        id: i + 1,
        text: role.shortLabel,
        role: role.role,
        behavior: role.behavior
    }));

export const mapUserData = (data) => {
    return {
        roles: {
            role: data.role,
            campus: { id: data.campus.id, label: data.campus.label },
            unit: data.unit ? { id: data.unit.id, label: data.unit.label } : null
        },
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email
    };
};

export const mapUnitData = (data, cards) => ({
    label: data.name,
    trigram: data.trigram.trim().toUpperCase(),
    workflow: {
        steps: cards.map((card) => ({ role: card.role, behavior: card.behavior }))
    }
});

export const mapEditUnit = (unitData) => {
    const cards = unitData.workflow.steps.map((card) =>
        workflowCards.find((c) => c.role === card.role)
    );
    return {
        id: unitData.id,
        name: unitData.label,
        trigram: unitData.trigram,
        cards
    };
};

export const mapUsersList = (usersList) =>
    usersList.map((user) => ({
        id: user.id,
        lastname: user.lastname,
        firstname: user.firstname,
        campus: user.roles[0] && user.roles[0].campuses[0] ? user.roles[0].campuses[0].label : '-',
        unit: user.roles[0] && user.roles[0].units[0] ? user.roles[0].units[0].label : '-',
        role: user.roles[0] ? ROLES[user.roles[0].role].label : '-',
        userRole: user.roles[0] ? user.roles[0].role : null,
        deleteLabel: user.email.original
    }));

export const mapUnitsList = (unitsList, usersList) =>
    unitsList.map((unit) => {
        const findName = (userRole) => {
            const findUser = usersList.find((user) =>
                user.roles.find(
                    (role) =>
                        role.role === userRole &&
                        role.userInCharge === user.id &&
                        role.units.find((userUnit) => userUnit.id === unit.id)
                )
            );
            return findUser ? `${findUser.firstname} ${findUser.lastname}` : '-';
        };
        return {
            id: unit.id,
            trigram: unit.trigram,
            name: unit.label,
            [ROLES.ROLE_SECURITY_OFFICER.role]: findName(ROLES.ROLE_SECURITY_OFFICER.role),
            [ROLES.ROLE_UNIT_CORRESPONDENT.role]: findName(ROLES.ROLE_UNIT_CORRESPONDENT.role),
            deleteLabel: unit.label
        };
    });

export const mapEditCampus = (campus, adminsList) => {
    const admin = adminsList.find((user) =>
        user.roles.find(
            (role) => role.userInCharge === user.id && role.campuses.find((c) => c.id === campus.id)
        )
    );
    const assistants = adminsList.filter((user) =>
        user.roles.find(
            (role) =>
                role.userInCharge &&
                role.userInCharge !== user.id &&
                role.campuses.find((c) => c.id === campus.id)
        )
    );
    return {
        id: campus.id,
        label: campus.label,
        trigram: campus.trigram,
        admin: admin || null,
        assistants
    };
};

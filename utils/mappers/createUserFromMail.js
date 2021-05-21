const normalizeName = (data) => {
    const numberLessData = data.replace(new RegExp('[^(a-zA-Z)]', 'g'), '').trim();
    return numberLessData.charAt(0).toUpperCase() + numberLessData.substring(1).toLowerCase();
};

export const createUserData = (email, roles) => {
    const [firstname, lastname] = email.split('@')[0].split('.');
    return {
        firstname: normalizeName(firstname),
        lastname: normalizeName(lastname),
        email,
        roles
    };
};

export const checkMailFormat = (value) => {
    const [username, mail] = value.split('@');
    return username.split('.').length === 2 && mail === 'intradef.gouv.fr';
};

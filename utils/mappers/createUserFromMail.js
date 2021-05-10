const normalizeName = (data) => {
    const numberLessData = data.replace(new RegExp('[^(a-zA-Z)]', 'g'), '').trim();
    return numberLessData.charAt(0).toUpperCase() + numberLessData.substring(1).toLowerCase();
};

export const createUserFromMail = (email, roles) => {
    const [firstname, lastname] = email.split('@')[0].split('.');
    return {
        firstname: normalizeName(firstname),
        lastname: normalizeName(lastname),
        email,
        roles
    };
};

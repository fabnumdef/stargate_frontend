import { ROLES } from '../constants/enums';

export const mapUserData = (data, dataCampuses, dataUnits) => {
  const { listCampuses: { list: campuses } } = dataCampuses;
  const { getCampus: { listUnits: { list: units } } } = dataUnits;

  return {
    roles: [
      {
        role: data.role,
        campuses: [{
          id: data.campus,
          label: campuses.find((campus) => campus.id === data.campus).label,
        }],
        units: data.unit
          ? [{
            id: data.unit,
            label: units.find((unit) => unit.id === data.unit).label,
          }]
          : [],
      },
    ],
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
  };
};

export const mapUsersList = (usersList) => usersList.map((user) => ({
  id: user.id,
  lastname: user.lastname,
  firstname: user.firstname,
  campus: user.roles[0].campuses[0] ? user.roles[0].campuses[0].label : '',
  unit: user.roles[0].units[0] ? user.roles[0].units[0].label : '',
  role: ROLES[user.roles[0].role].label,
}));

export const mapUnitsList = (unitsList, usersList) => unitsList.map((unit) => {
  const securityOfficer = usersList.find((user) => user.roles.find((role) => role.role === ROLES.ROLE_SECURITY_OFFICER.role && role.units.find((userUnit) => userUnit.id === unit.id)));
  const unitCorrespondent = usersList.find((user) => user.roles.find((role) => role.role === ROLES.ROLE_UNIT_CORRESPONDENT.role && role.units.find((userUnit) => userUnit.id === unit.id)));
  return {
    id: unit.id,
    trigram: unit.trigram,
    name: unit.label,
    securityOfficer: `${securityOfficer.firstname} ${securityOfficer.lastname}`,
    unitCorrespondent: `${unitCorrespondent.firstname} ${unitCorrespondent.lastname}`,
  };
});

// disable eslint, waiting for others mappers
// eslint-disable-next-line import/prefer-default-export
export const mapUserData = (data, dataCampuses, dataUnits) => {
  const { listCampuses: { list: campuses } } = dataCampuses;
  const { getCampus: { listUnits: { list: units } } } = dataUnits;

  return {
    roles: [
      {
        role: data.role,
        campuses: [{
          _id: data.campus,
          label: campuses.find((campus) => campus.id === data.campus).label,
        }],
        units: [{
          _id: data.unit,
          label: units.find((unit) => unit.id === data.unit).label,
        }],
      },
    ],
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
  };
};

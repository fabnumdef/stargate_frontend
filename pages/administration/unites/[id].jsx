import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { withApollo } from '../../../lib/apollo';
import PageTitle from '../../../components/styled/pageTitle';
import Template from '../../../containers/template';
import UnitForm from '../../../components/administrationForms/unitForm';
import { useSnackBar } from '../../../lib/ui-providers/snackbar';
import { useLogin } from '../../../lib/loginContext';
import { FORMS_LIST, ROLES } from '../../../utils/constants/enums';
import { mapEditUnit } from '../../../utils/mappers/adminMappers';

const GET_UNIT = gql`
    query getUnit($campusId: String!, $id: String!) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            getUnit(id: $id) {
                id
                label
                trigram
                workflow {
                    steps {
                        role
                        behavior
                    }
                }
            }
        }
    }
`;

const GET_USERS = gql`
    query listUsers($cursor: OffsetCursor, $hasRole: HasRoleInput) {
        listUsers(cursor: $cursor, hasRole: $hasRole) {
            list {
                id
                firstname
                lastname
                roles {
                    role
                    userInCharge
                    campuses {
                        id
                        label
                    }
                    units {
                        id
                        label
                    }
                }
            }
        }
    }
`;

const GET_PLACES = gql`
    query listPlaces($campusId: String!, $filters: PlaceFilters) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            listPlaces(filters: $filters) {
                list {
                    id
                    label
                    unitInCharge {
                        id
                        label
                    }
                }
            }
        }
    }
`;

const EDIT_UNIT = gql`
    mutation editUnit($campusId: String!,$id: String!, $unit: UnitInput!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            editUnit(id: $id, unit: $unit) {
                id
            }
        }
    }
`;

const EDIT_USER = gql`
    mutation editUser($id: String!, $user: UserInput!) {
        editUser(id: $id, user: $user) {
            id
        }
    }
`;

const EDIT_PLACE = gql`
    mutation editPlace($campusId: String!, $id: String!, $place: PlaceInput!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            editPlace(id: $id, place: $place) {
                id
            }
        }
    }
`;

function CreateUnit() {
  const { addAlert } = useSnackBar();
  const router = useRouter();
  const { id } = router.query;
  const { data: getUnitData } = useQuery(GET_UNIT, { variables: { id } });
  const { data: unitCorresDatas } = useQuery(GET_USERS, {
    variables: { hasRole: { role: ROLES.ROLE_UNIT_CORRESPONDENT.role, unit: id } },
  });
  const { data: unitOfficerDatas } = useQuery(GET_USERS, {
    variables: { hasRole: { role: ROLES.ROLE_SECURITY_OFFICER.role, unit: id } },
  });
  const { data: placesData } = useQuery(GET_PLACES, {
    variables: { filters: { unitInCharge: { id } } },
  });

  const [editUnit] = useMutation(EDIT_UNIT);
  const [editUserReq] = useMutation(EDIT_USER);
  const [editPlaceReq] = useMutation(EDIT_PLACE);
  const { activeRole } = useLogin();

  const [defaultValues, setDefaultValues] = useState(null);

  const editUser = async (userId, roles) => {
    try {
      await editUserReq({
        variables: {
          id: userId,
          user: { roles },
        },
      });
    } catch (e) {
      addAlert({ message: 'Une erreur est survenue', severity: 'error' });
    }
    return true;
  };

  const submitEditUnit = async (formData, unitData, assistantsList) => {
    try {
      await editUnit({ variables: { id, unit: unitData } });
      const unitId = id;
      await editUser(
        formData.unitCorrespondent,
        {
          role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
          userInCharge: formData.unitCorrespondent,
          campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
          units: { id: unitId, label: unitData.label },
        },
      );
      await Promise.all(formData.places.map(async (place) => {
        await editPlaceReq(
          {
            variables:
              {
                id: place,
                place:
                  { unitInCharge: unitId },
              },
          },
        );
      }));
      if (assistantsList[FORMS_LIST.CORRES_ASSISTANTS].length) {
        await Promise.all(assistantsList[FORMS_LIST.CORRES_ASSISTANTS].map(async (user) => {
          await editUser(
            user.id,
            {
              role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
              userInCharge: formData.unitCorrespondent,
              campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
              units: { id: unitId, label: unitData.label },
            },
          );
        }));
      }
      if (formData.unitOfficer) {
        await editUser(
          formData.unitOfficer,
          {
            role: ROLES.ROLE_SECURITY_OFFICER.role,
            userInCharge: formData.unitOfficer,
            campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
            units: { id: unitId, label: unitData.label },
          },
        );
      }
      if (assistantsList[FORMS_LIST.OFFICER_ASSISTANTS].length) {
        await Promise.all(assistantsList[FORMS_LIST.OFFICER_ASSISTANTS].map(async (user) => {
          await editUser(
            user.id,
            {
              role: ROLES.ROLE_SECURITY_OFFICER.role,
              userInCharge: formData.unitOfficer,
              campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
              units: { id: unitId, label: unitData.label },
            },
          );
        }));
      }
      addAlert({ message: 'L\'unité a bien été modifiée', severity: 'success' });
      return router.push('/administration/unites');
    } catch (e) {
      return addAlert({ message: 'Une erreur est survenue', severity: 'error' });
    }
  };

  useEffect(() => {
    if (getUnitData && unitCorresDatas && unitOfficerDatas && placesData) {
      setDefaultValues(mapEditUnit(
        getUnitData.getCampus.getUnit,
        unitCorresDatas.listUsers.list,
        unitOfficerDatas.listUsers.list,
        placesData.getCampus.listPlaces.list,
      ));
    }
  }, [getUnitData, unitCorresDatas, unitOfficerDatas, placesData]);


  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Unité', 'Editer unité']} />
      {defaultValues && (
      <UnitForm
        submitForm={submitEditUnit}
        defaultValues={defaultValues}
        userRole={activeRole}
        type="edit"
      />
      )}
    </Template>
  );
}

export default withApollo()(CreateUnit);

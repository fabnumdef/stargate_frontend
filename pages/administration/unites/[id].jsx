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
    query listPlaces($campusId: String!, $hasUnit: HasUnitFilter) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            listPlaces(hasUnit: $hasUnit) {
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

const DELETE_ROLE = gql`
    mutation deleteUserRole($id: String! $user: UserInput) {
        deleteUserRole(id: $id, user: $user) {
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
    variables: { hasUnit: { id } },
  });

  const [editUnit] = useMutation(EDIT_UNIT);
  const [editUserReq] = useMutation(EDIT_USER);
  const [editPlaceReq] = useMutation(EDIT_PLACE);
  const [deleteUserRoleReq] = useMutation(DELETE_ROLE);
  const { activeRole } = useLogin();

  const [defaultValues, setDefaultValues] = useState(null);

  const editUser = async (userId, role, userInCharge) => {
    try {
      await editUserReq({
        variables: {
          id: userId,
          user: {
            roles: {
              role,
              userInCharge,
              campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
              units: { id, label: getUnitData.getCampus.getUnit.label },
            },
          },
        },
      });
    } catch (e) {
      addAlert({ message: 'Une erreur est survenue', severity: 'error' });
    }
    return true;
  };

  const deleteRole = async (user, role) => {
    try {
      const userRoleDeleted = await deleteUserRoleReq({
        variables: {
          id: user.id,
          user: {
            roles: {
              role,
            },
          },
        },
      });
      return userRoleDeleted;
    } catch {
      return null;
    }
  };

  const editPlace = async (placeId, data) => {
    try {
      await editPlaceReq(
        {
          variables:
            {
              id: placeId,
              place:
                { unitInCharge: data },
            },
        },
      );
      return true;
    } catch (e) {
      return e;
    }
  };

  const submitEditUnit = async (formData, unitData, assistantsList) => {
    try {
      await editUnit({ variables: { id, unit: unitData } });
      const unitId = id;

      if (!defaultValues.unitCorrespondent.id
        || (defaultValues.unitCorrespondent.id !== formData.unitCorrespondent)) {
        if (defaultValues.unitCorrespondent.id) {
          await deleteRole(defaultValues.unitCorrespondent.id, ROLES.ROLE_UNIT_CORRESPONDENT.role);
        }
        await editUser(
          formData.unitCorrespondent,
          ROLES.ROLE_UNIT_CORRESPONDENT.role,
          formData.unitCorrespondent,
        );
      }
      if (!defaultValues.unitOfficer.id
        || (defaultValues.unitOfficer.id !== formData.unitOfficer)) {
        if (defaultValues.unitOfficer.id) {
          await deleteRole(defaultValues.unitOfficer.id, ROLES.ROLE_SECURITY_OFFICER.role);
        }
        await editUser(
          formData.unitOfficer,
          ROLES.ROLE_SECURITY_OFFICER.role,
          formData.unitOfficer,
        );
      }

      const placesToDelete = defaultValues.placesList.filter(
        (place) => !formData.placesList.find((p) => p.id === place.id),
      );
      const placesToAdd = formData.placesList.filter(
        (place) => !defaultValues.placesList.find((p) => p.id === place.id),
      );
      await Promise.all(placesToDelete.places.map(async (place) => {
        await editPlace(place.id, null);
      }));
      await Promise.all(placesToAdd.places.map(async (place) => {
        await editPlace(place.id, unitId);
      }));

      if (assistantsList[FORMS_LIST.CORRES_ASSISTANTS].length) {
        await Promise.all(assistantsList[FORMS_LIST.CORRES_ASSISTANTS].map(async (user) => {
          if (user.toDelete) {
            return deleteRole(user.id, ROLES.ROLE_UNIT_CORRESPONDENT.role);
          }
          const haveRole = user.roles.find(
            (role) => role.role === ROLES.ROLE_UNIT_CORRESPONDENT.role,
          );
          if ((!haveRole || haveRole.userInCharge !== formData.unitCorrespondent)) {
            await editUser(user, ROLES.ROLE_UNIT_CORRESPONDENT.role, formData.unitCorrespondent);
          }
          return user;
        }));
      }

      if (assistantsList[FORMS_LIST.OFFICER_ASSISTANTS].length) {
        await Promise.all(assistantsList[FORMS_LIST.OFFICER_ASSISTANTS].map(async (user) => {
          if (user.toDelete) {
            return deleteRole(user.id, ROLES.ROLE_SECURITY_OFFICER.role);
          }
          const haveRole = user.roles.find(
            (role) => role.role === ROLES.ROLE_SECURITY_OFFICER.role,
          );
          if ((!haveRole || haveRole.userInCharge !== formData.unitCorrespondent)) {
            await editUser(user, ROLES.ROLE_SECURITY_OFFICER.role, formData.unitCorrespondent);
          }
          return user;
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

import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../components/styled/pageTitle';
import Template from '../../../containers/template';
import UnitForm from '../../../components/administrationForms/unitForm';
import { useSnackBar } from '../../../lib/hooks/snackbar';
import { useLogin } from '../../../lib/loginContext';
import { FORMS_LIST, ROLES } from '../../../utils/constants/enums';

const CREATE_UNIT = gql`
    mutation createUnit($campusId: String!, $unit: UnitInput!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            createUnit(unit: $unit) {
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

const EDIT_USER = gql`
    mutation editUser($id: ObjectID!, $user: UserInput!) {
        editUser(id: $id, user: $user) {
            id
        }
    }
`;

const EDIT_PLACE = gql`
    mutation editPlace($campusId: String!, $id: ObjectID!, $place: PlaceInput!) {
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
  const [createUnit] = useMutation(CREATE_UNIT);
  const [editUserReq] = useMutation(EDIT_USER);
  const [editPlaceReq] = useMutation(EDIT_PLACE);
  const { activeRole } = useLogin();

  const editUser = async (id, roles) => {
    try {
      await editUserReq({
        variables: {
          id,
          user: { roles },
        },
      });
    } catch (e) {
      addAlert({ message: 'Une erreur est survenue', severity: 'error' });
    }
    return true;
  };

  const submitCreateUnit = async (formData, unitData, assistantsList) => {
    try {
      const { data: unitResponse } = await createUnit({ variables: { unit: unitData } });
      const unitId = unitResponse.mutateCampus.createUnit.id;
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
                id: place.id,
                place:
                  { unitInCharge: { id: unitId } },
              },
          },
        );
      }));
      if (assistantsList[FORMS_LIST.CORRES_ASSISTANTS].length) {
        await Promise.all(assistantsList[FORMS_LIST.CORRES_ASSISTANTS].map(async (user) => {
          if (user.toDelete) {
            return user;
          }
          await editUser(
            user.id,
            {
              role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
              userInCharge: formData.unitCorrespondent,
              campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
              units: { id: unitId, label: unitData.label },
            },
          );
          return user;
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
          if (user.toDelete) {
            return user;
          }
          await editUser(
            user.id,
            {
              role: ROLES.ROLE_SECURITY_OFFICER.role,
              userInCharge: formData.unitOfficer,
              campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
              units: { id: unitId, label: unitData.label },
            },
          );
          return user;
        }));
      }
      addAlert({ message: 'L\'unité a bien été créé', severity: 'success' });
      return router.push('/administration/unites');
    } catch (e) {
      return addAlert({ message: 'Une erreur est survenue', severity: 'error' });
    }
  };

  const defaultValues = {
    assistantsList: {
      [FORMS_LIST.CORRES_ASSISTANTS]: [],
      [FORMS_LIST.OFFICER_ASSISTANTS]: [],
    },
    placesList: [],
    unitOfficer: {},
    unitCorrespondent: {},
  };

  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Unité', 'Nouvelle unité']} />
      <UnitForm
        submitForm={submitCreateUnit}
        defaultValues={defaultValues}
        userRole={activeRole}
        type="create"
      />
    </Template>
  );
}

export default CreateUnit;

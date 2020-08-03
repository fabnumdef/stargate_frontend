import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { withApollo } from '../../../lib/apollo';
import PageTitle from '../../../components/styled/pageTitle';
import Template from '../../../containers/template';
import UnitForm from '../../../components/administrationForms/unitForm';
import { useSnackBar } from '../../../lib/ui-providers/snackbar';
import { useLogin } from '../../../lib/loginContext';
import { FORMS_LIST, ROLES } from '../../../utils/constants/enums';

const CREATE_UNIT = gql`
    mutation createUnit($campusId: String!, $unit: UnitInput!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            createUnit(unit: $unit) {
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
      addAlert({ message: 'L\'unité a bien été créé', severity: 'success' });
      return router.push('/administration/unites');
    } catch (e) {
      return addAlert({ message: 'Une erreur est survenue', severity: 'error' });
    }
  };

  const defaultValues = {};

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

export default withApollo()(CreateUnit);

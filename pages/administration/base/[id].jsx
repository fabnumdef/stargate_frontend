import React from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { withApollo } from '../../../lib/apollo';
import PageTitle from '../../../components/styled/pageTitle';
import Template from '../../../containers/template';
import BaseForm from '../../../components/administrationForms/baseForm';
import { useSnackBar } from '../../../lib/ui-providers/snackbar';
import { useLogin } from '../../../lib/loginContext';

const GET_CAMPUS = gql`
    query getCampus($id: String!) {
        getCampus(id: $id) {
            id
            label
        }
    }
`;

const EDIT_CAMPUS = gql`
    mutation editCampus($user: CampusInput!, $id: String!) {
        editCampus(campus: $campus, id: $id) {
            id
        }
    }
`;

const GET_ADMINS = gql`
    query listUsers($filters: UserFilters) {
        listUsers(filters: $filters) {
            list {
                id
                firstname
                lastname
            }
        }
    }
`;

function EditCampus() {
  const { addAlert } = useSnackBar();
  const router = useRouter();
  const { id } = router.query;
  const [editCampus] = useMutation(EDIT_CAMPUS);
  const { activeRole } = useLogin();

  const { data: editCampusData } = useQuery(GET_CAMPUS, { variables: { id } });
  const { data: getAdminData } = useQuery(GET_ADMINS, {
    variables: { filters: {} },
  });

  const submitEditCampus = async (campus) => {
    try {
      const { data } = await editCampus({ variables: { campus, id } });

      return null;
    } catch (e) {
      return addAlert({
        message: 'Erreur serveur, merci de réessayer',
        severity: 'warning',
      });
    }
  };

  const mapEditCampus = () => ({
    name: editCampusData.getCampus.label,
    admin: getAdminData.listUsers.list[0],
  });

  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Base']} />
      {(editCampusData && getAdminData)
      && (
        <BaseForm
          submitForm={submitEditCampus}
          defaultValues={mapEditCampus()}
          userRole={activeRole}
        />
      )}
    </Template>
  );
}

export default withApollo()(EditCampus);

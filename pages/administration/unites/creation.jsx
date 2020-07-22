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

const CREATE_UNIT = gql`
    mutation createUnit($unit: UnitInput!) {
        createUnit(unit: $unit) {
            id
        }
    }
`;

function CreateUnit() {
  const { addAlert } = useSnackBar();
  const router = useRouter();
  const [createUser] = useMutation(CREATE_UNIT);
  const { activeRole } = useLogin();

  const submitCreateUnit = async (unit) => {
    try {
      const { data: { createUnit: { id } } } = await createUser({ variables: { unit } });
      if (id) {
        addAlert({ message: 'L\'unité a bien été créé', severity: 'success' });
        router.push('/administration/unites');
      }
      return null;
    } catch (e) {
      switch (true) {
        // case e.message === 'GraphQL error: User already exists':
        //   return addAlert({
        //     message: 'Un utilisateur est déjà enregistré avec cet e-mail',
        //     severity: 'error',
        //   });
        // case e.message.includes('User validation failed: email.original: queryMx ENOTFOUND'):
        //   return addAlert({
        //     message: 'Erreur, veuillez vérifier le domaine de l\'adresse e-mail',
        //     severity: 'warning',
        //   });
        default:
          return addAlert({
            message: 'Erreur serveur, merci de réessayer',
            severity: 'warning',
          });
      }
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

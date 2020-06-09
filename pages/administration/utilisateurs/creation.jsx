import React from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { withApollo } from '../../../lib/apollo';
import PageTitle from '../../../components/styled/pageTitle';
import Template from '../../../containers/template';
import UserForm from '../../../components/administrationForms/userForm';
import { useSnackBar } from '../../../lib/ui-providers/snackbar';
import { useLogin } from '../../../lib/loginContext';

const GET_ME = gql`
    query getMe {
        me {
            roles {
                role
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
`;

const CREATE_USER = gql`
  mutation createUser($user: UserInput!) {
      createUser(user: $user) {
          id
      }
  }
`;

function CreateUser() {
  const { addAlert } = useSnackBar();
  const router = useRouter();
  const [createUser] = useMutation(CREATE_USER);
  const { data: userData } = useQuery(GET_ME);
  const { activeRole } = useLogin();

  const submitCreateUser = async (user) => {
    try {
      const { data: { createUser: { id } } } = await createUser({ variables: { user } });
      if (id) {
        addAlert({ message: 'L\'utilisateur a bien été créé', severity: 'success' });
        router.push('/administration/utilisateurs');
      }
      return null;
    } catch (e) {
      if (e.message === 'GraphQL error: User already exists') {
        return addAlert({ message: 'Un utilisateur est déjà enregistré avec cet e-mail', severity: 'error' });
      }
      return addAlert({ message: 'Erreur serveur, merci de réessayer', severity: 'warning' });
    }
  };

  let defaultValues = {};
  if (userData) {
    const selectedRole = userData.me.roles.find((role) => role.role === activeRole.role);
    defaultValues = {
      campus: selectedRole.campuses[0].id || null,
      unit: selectedRole.units[0].id || null,
    };
  }


  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Utilisateur', 'Nouvel utilisateur']} />
      {userData
        && (
        <UserForm
          submitForm={submitCreateUser}
          defaultValues={defaultValues}
          userRole={activeRole}
        />
        )}
    </Template>
  );
}

export default withApollo()(CreateUser);

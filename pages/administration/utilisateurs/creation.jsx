import React from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { withApollo } from '../../../lib/apollo';
import PageTitle from '../../../components/styled/pageTitle';
import Template from '../../../containers/template';
import UserForm from '../../../components/administrationForms/userForm';
import { useSnackBar } from '../../../lib/ui-providers/snackbar';

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
  let userRole = {};
  if (userData) {
    [userRole] = userData.me.roles;
    defaultValues = {
      campus: userRole.campuses[0] ? userRole.campuses[0].id : null,
      unit: userRole.units[0] ? userRole.units[0].id : null,
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
          userRole={userRole}
        />
        )}
    </Template>
  );
}

export default withApollo()(CreateUser);

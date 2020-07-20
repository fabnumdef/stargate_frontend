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

const GET_USER = gql`
    query getUser($id: String!) {
        getUser(id: $id) {
            id
            firstname
            lastname
            email {
                original
            }
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

const EDIT_USER = gql`
    mutation editUser($user: UserInput!, $id: String!) {
        editUser(user: $user, id: $id) {
            id
        }
    }
`;

function EditUser() {
  const { addAlert } = useSnackBar();
  const router = useRouter();
  const { id } = router.query;
  const [editUser] = useMutation(EDIT_USER);
  const { data: editUserData } = useQuery(GET_USER, { variables: { id } });
  const { activeRole } = useLogin();

  const submitEditUser = async (user) => {
    try {
      const { data: { editUser: { id: userId } } } = await editUser({ variables: { user, id } });
      if (userId) {
        addAlert({ message: 'L\'utilisateur a bien été modifié', severity: 'success' });
        router.push('/administration/utilisateurs');
      }
      return null;
    } catch (e) {
      switch (true) {
        case e.message === 'GraphQL error: User already exists':
          return addAlert({
            message: 'Un utilisateur est déjà enregistré avec cet e-mail',
            severity: 'error',
          });
        case e.message.includes('User validation failed: email.original: queryMx ENOTFOUND'):
          return addAlert({
            message: 'Erreur, veuillez vérifier le domaine de l\'adresse e-mail',
            severity: 'warning',
          });
        default:
          return addAlert({
            message: 'Erreur serveur, merci de réessayer',
            severity: 'warning',
          });
      }
    }
  };

  const mapEditUser = (data) => {
    const roleUser = data.roles.find((role) => role.role === 'ROLE_OBSERVER' || 'ROLE_HOST');
    console.log('roleUser', roleUser)
    return {
      ...data,
      email: data.email.original,
      campus: roleUser.campuses[0] ? roleUser.campuses[0].id : null,
      unit: roleUser.units[0] ? roleUser.units[0].id : null,
      role: roleUser ? roleUser.role : null,
    };
  };

  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Utilisateur', 'Modifier utilisateur']} />
      {editUserData
      && (
        <UserForm
          submitForm={submitEditUser}
          defaultValues={mapEditUser(editUserData.getUser)}
          userRole={activeRole}
          type="edit"
        />
      )}
    </Template>
  );
}

export default withApollo()(EditUser);

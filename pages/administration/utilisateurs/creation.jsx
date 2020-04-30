import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { withApollo } from '../../../lib/apollo';
import PageTitle from '../../../components/styled/pageTitle';
import Template from '../../../containers/template';
import UserForm from '../../../components/administrationForms/userForm';


// eslint-disable-next-line no-unused-vars
const creatorRole = {
  role: 'CU',
  campuses: [{
    id: 'MIDDLE-EARTH',
    label: 'Middle-Earth',
  }],
  units: [{
    id: '5eaac5d6c94d620728b05511',
    label: 'Orcs',
  }],
};

const creatorRoleAdmin = {
  role: 'Admin',
  campuses: [{
    id: 'MORDOR',
    label: 'Test',
  }],
  units: [{
    id: '5eaac5f9c94d620728b05514',
    label: 'Mages',
  }],
};

const CREATE_USER = gql`
  mutation createUser($user: UserInput!) {
      createUser(user: $user) {
          id
      }
  }
`;

const mapCreateUser = (data) => ({
  roles: [
    {
      role: data.role,
      campuses: [{ _id: data.campus, label: data.campus }],
    },
  ],
  firstname: data.firstname,
  lastname: data.lastname,
  email: data.email,
});

function CreateUser() {

  const [createUser] = useMutation(CREATE_USER);

  const onSubmit = async (formData) => {
    console.log('formData', formData);
    const user = mapCreateUser(formData);
    console.log('user', user);
    try {
      await createUser({ variables: { user } });
    } catch (e) {
      console.log(e);
    }
  };

  const creator = creatorRoleAdmin;

  const defaultValues = {
    campus: { id: creator.campuses[0].id, label: creator.campuses[0].label },
    unit: { id: creator.units[0].id, label: creator.units[0].label },
  };

  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Utilisateur', 'Nouvel utilisateur']} />
      <UserForm onSubmit={onSubmit} defaultValues={defaultValues} user={creator} />
    </Template>
  );
}

export default withApollo()(CreateUser);

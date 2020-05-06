import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { withApollo } from '../../../lib/apollo';
import Template from '../../../containers/template';
import PageTitle from '../../../components/styled/pageTitle';
import TabAdminUsers from '../../../components/tabs/tabAdminUsers';
import { mapUsersList } from '../../../utils/mappers/adminMappers';

const columns = [
  { id: 'firstname', label: 'Nom' },
  { id: 'lastname', label: 'Prénom' },
  { id: 'campus', label: 'Base' },
  { id: 'unit', label: 'Unité' },
  { id: 'role', label: 'Rôle' },
];

const GET_USERS_LIST = gql`
    query listUsers {
        listUsers {
          list {
              lastname
              firstname
              roles {
                  role
                  campuses {
                      label
                  }
                  units {
                      label
                  }
              }
          }
        }
    }
`;

function UserAdministration() {
  let tabData = [];

  const { data: usersList } = useQuery(GET_USERS_LIST);

  if (usersList && usersList.listUsers) {
    tabData = mapUsersList(usersList.listUsers.list);
  }

  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Utilisateur']} />
      <TabAdminUsers tabData={tabData} columns={columns} />
    </Template>
  );
}

export default withApollo({ ssr: true })(UserAdministration);

import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
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
    query listUsers($cursor: OffsetCursor, $filters: UserFilters) {
        listUsers(cursor: $cursor, filters: $filters) {
          meta {
            total 
          }  
          list {
              id
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

const DELETE_USER = gql`
  mutation deleteUser($id: String!) {
      deleteUser(id: $id) {
          id
      }
  }
`;

function UserAdministration() {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('');
  const [getUsersList, { data: usersList }] = useLazyQuery(GET_USERS_LIST);
  const [deleteUserMutation] = useMutation(DELETE_USER);

  const handleChangePage = (selectedPage) => {
    setPage(selectedPage);
    getUsersList({
      variables: { cursor: { first: 10, offset: selectedPage * 10 }, filter },
    });
  };

  const handleChangeFilter = (e) => {
    setFilter(e.target.value);
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserMutation({ variables: { id } });
      getUsersList({
        variables: { cursor: { first: 10, offset: page * 10 }, filter },
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!usersList) {
      getUsersList({
        variables: { cursor: { first: 10, offset: 0 }, filter },
      });
    }
  });

  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Utilisateur']} />
      <div>
        <button type="button" onClick={() => handleChangePage(1)}>Page 2</button>
        <input value={filter} onChange={handleChangeFilter} />
      </div>
      {usersList
        && (
        <TabAdminUsers
          rows={mapUsersList(usersList.listUsers.list)}
          columns={columns}
          deleteItem={deleteUser}
        />
        )}
    </Template>
  );
}

export default withApollo({ ssr: true })(UserAdministration);

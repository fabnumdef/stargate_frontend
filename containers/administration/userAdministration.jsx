import React, { useState } from 'react';
import gql from 'graphql-tag';
import IndexAdministration from '../../components/administration';
import { mapUsersList } from '../../utils/mappers/adminMappers';
import { useApolloClient } from '@apollo/react-hooks';

const columns = [
  { id: 'lastname', label: 'Nom' },
  { id: 'firstname', label: 'Prénom' },
  { id: 'campus', label: 'Base' },
  { id: 'unit', label: 'Unité' },
  { id: 'role', label: 'Rôle' },
];

const GET_USERS_LIST = gql`
    query listUsers($cursor: OffsetCursor, $filters: UserFilters) {
        listUsers(cursor: $cursor, filters: $filters) {
          meta {
              offset
              first
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

const createUserData = {
  createUserPath: '/administration/utilisateurs/creation',
  deleteText: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
};

function UserAdministration() {
  const client = useApolloClient();

  const [usersList, setUsersList] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const getList = async (rowsPerPage, page) => {
    const filters = searchInput.length ? { lastname: searchInput } : null;
    const { data } = await client.query({
      query: GET_USERS_LIST,
      variables: { cursor: { first: rowsPerPage, offset: page * rowsPerPage }, filters },
      fetchPolicy: 'no-cache',
    });
    return setUsersList(data);
  };

  return (
    <IndexAdministration
      getList={getList}
      list={usersList ? mapUsersList(usersList.listUsers.list) : []}
      count={usersList && usersList.listUsers.meta.total}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      deleteMutation={DELETE_USER}
      tabData={createUserData}
      columns={columns}
      subtitles={['Utilisateurs']}
    />
  );
}

export default UserAdministration;

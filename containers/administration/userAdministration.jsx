import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useApolloClient } from '@apollo/react-hooks';
import IndexAdministration from '../../components/administration';
import { mapUsersList } from '../../utils/mappers/adminMappers';
import { isAdmin, isSuperAdmin } from '../../utils/permissions';
import { useLogin } from '../../lib/loginContext';

const columns = [
  { id: 'lastname', label: 'Nom' },
  { id: 'firstname', label: 'Prénom' },
  { id: 'campus', label: 'Base' },
  { id: 'unit', label: 'Unité' },
  { id: 'role', label: 'Rôle' },
];

const GET_USERS_LIST = gql`
    query listUsers($cursor: OffsetCursor, $filters: UserFilters, $hasRole: HasRoleInput) {
        listUsers(cursor: $cursor, filters: $filters, hasRole: $hasRole) {
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
              email {
                  original
              }
          }
        }
    }
`;

const DELETE_USER = gql`
  mutation deleteUser($id: ObjectID!) {
      deleteUser(id: $id) {
          id
      }
  }
`;

const createUserData = (data) => ({
  createPath: '/administration/utilisateurs/creation',
  confirmDeleteText: `Êtes-vous sûr de vouloir supprimer cet utilisateur: ${data} ?`,
  deletedText: `L'utilisateur ${data} a bien été supprimé`,
});

function UserAdministration() {
  const client = useApolloClient();
  const { activeRole } = useLogin();

  const [usersList, setUsersList] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const getList = async (rowsPerPage, page) => {
    const filters = searchInput.length ? { lastname: searchInput } : null;
    const { data } = await client.query({
      query: GET_USERS_LIST,
      variables: {
        cursor: { first: rowsPerPage, offset: page * rowsPerPage },
        filters,
        hasRole: (isAdmin(activeRole.role) || isSuperAdmin(activeRole.role))
          ? {}
          : { unit: activeRole.unit },
      },
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

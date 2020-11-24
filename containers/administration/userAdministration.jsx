import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
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
    query listUsers($cursor: OffsetCursor, $filters: UserFilters, $hasRole: HasRoleInput, $search: String) {
        listUsers(cursor: $cursor, filters: $filters, hasRole: $hasRole, search: $search) {
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
  const { activeRole } = useLogin();
  const [usersList, setUsersList] = useState({ list: [], total: 0 });
  const [searchInput, setSearchInput] = useState('');

  const onCompletedQuery = (data) => setUsersList({
    list: mapUsersList(data.listUsers.list),
    total: data.listUsers.meta.total,
  });

  const { refetch, fetchMore } = useQuery(GET_USERS_LIST, {
    variables: {
      cursor: { first: 10, offset: 0 },
      search: searchInput,
      hasRole: (isAdmin(activeRole.role) || isSuperAdmin(activeRole.role))
        ? {}
        : { unit: activeRole.unit },
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (d) => onCompletedQuery(d),
  });

  return (
    <IndexAdministration
      fetchMore={fetchMore}
      refetch={refetch}
      result={usersList}
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

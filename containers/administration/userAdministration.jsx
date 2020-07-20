import React from 'react';
import gql from 'graphql-tag';
import IndexAdministration from '../../components/administration';

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
  return (
    <IndexAdministration
      query={GET_USERS_LIST}
      deleteMutation={DELETE_USER}
      tabData={createUserData}
      columns={columns}
    />
  );
}

export default UserAdministration;

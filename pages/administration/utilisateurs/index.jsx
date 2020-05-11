import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';
import { withApollo } from '../../../lib/apollo';
import Template from '../../../containers/template';
import PageTitle from '../../../components/styled/pageTitle';
import TabAdminUsers from '../../../components/tabs/tabAdminUsers';
import { mapUsersList } from '../../../utils/mappers/adminMappers';

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
  const [actualPage, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(null);

  const [deleteUserMutation] = useMutation(DELETE_USER);

  const getList = async (page = actualPage, filters = null) => {
    const { data } = await client.query({
      query: GET_USERS_LIST,
      variables: { cursor: { first: 10, offset: (page - 1) * 10 }, filters },
      fetchPolicy: 'no-cache',
    });
    return setUsersList(data);
  };

  const setPaginationCount = (totalItems) => Math.ceil(totalItems / 10) || 1;

  const handleChangePage = (selectedPage) => {
    setPage(selectedPage);
    getList(selectedPage);
  };

  const handleChangeFilter = (e) => {
    setSearchInput(e.target.value);
    getList(actualPage, {
      firstname: e.target.value,
      lastname: e.target.value,
    });
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserMutation({ variables: { id } });
      if (usersList && usersList.listUsers.list.length === 1) {
        await setPage(actualPage - 1);
        return getList(actualPage - 1);
      }
      return getList();
    } catch (e) {
      // TODO toast
      return e;
    }
  };

  useEffect(() => {
    if (!usersList) {
      getList();
    }
  });

  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Utilisateur']} />
      <Grid container justify="space-between" style={{ margin: '20px 0' }}>
        <Pagination
          count={usersList ? setPaginationCount(usersList.listUsers.meta.total) : 1}
          page={actualPage}
          onChange={(e, page) => handleChangePage(page)}
          color="primary"
        />
        <input value={searchInput} onChange={handleChangeFilter} />
      </Grid>
      <TabAdminUsers
        rows={usersList ? mapUsersList(usersList.listUsers.list) : []}
        columns={columns}
        deleteItem={deleteUser}
        tabData={createUserData}
      />
    </Template>
  );
}

export default withApollo({ ssr: true })(UserAdministration);

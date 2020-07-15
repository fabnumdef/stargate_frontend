import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import TablePagination from '@material-ui/core/TablePagination';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Template from '../template';
import PageTitle from '../../components/styled/pageTitle';
import TabAdminUsers from '../../components/tabs/tabAdminUsers';
import { mapUsersList } from '../../utils/mappers/adminMappers';
import { useSnackBar } from '../../lib/ui-providers/snackbar';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  searchInput: {
    height: '29px',
    fontSize: '0.9rem',
  },
});

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
  const classes = useStyles();
  const { addAlert } = useSnackBar();

  const [usersList, setUsersList] = useState(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [searchInput, setSearchInput] = useState('');

  const [deleteUserMutation] = useMutation(DELETE_USER);

  const getList = async () => {
    const filters = searchInput.length ? { lastname: searchInput } : null;
    const { data } = await client.query({
      query: GET_USERS_LIST,
      variables: { cursor: { first: rowsPerPage, offset: page * rowsPerPage }, filters },
      fetchPolicy: 'no-cache',
    });
    return setUsersList(data);
  };

  const handleChangePage = (event, selectedPage) => {
    setPage(selectedPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    getList();
  }, [page, rowsPerPage]);

  const handleChangeFilter = (e) => {
    setSearchInput(e.target.value);
    return getList();
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserMutation({ variables: { id } });
      setSearchInput(null);
      addAlert({ message: 'L\'utilisateur a bien été supprimé', severity: 'success' });
      if (usersList && usersList.listUsers.list.length === 1 && page > 1) {
        await setPage(page - 1);
        return getList(page - 1, searchInput);
      }
      return getList(page, searchInput);
    } catch (e) {
      addAlert({ message: 'Une erreur est survenue', severity: 'warning' });
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
      <Grid container spacing={1} justify="space-between" style={{ margin: '20px 0' }}>
        <Grid item sm={12} xs={12} md={12} lg={12}>
          <TextField
            style={{ float: 'right' }}
            InputProps={{
              className: classes.searchInput,
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchInput}
            onChange={handleChangeFilter}
            placeholder="Rechercher un nom..."
            variant="outlined"
          />
        </Grid>
        <Grid item sm={12}>
          <TabAdminUsers
            rows={usersList ? mapUsersList(usersList.listUsers.list) : []}
            columns={columns}
            deleteItem={deleteUser}
            tabData={createUserData}
          />
        </Grid>
        <Grid item sm={6} xs={12} md={8} lg={8}>
          <TablePagination
            rowsPerPageOptions={[10, 20, 30, 40, 50]}
            component="div"
            count={usersList && usersList.listUsers.meta.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </Template>
  );
}

export default UserAdministration;

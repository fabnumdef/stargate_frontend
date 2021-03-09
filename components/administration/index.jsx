import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import TablePagination from '@material-ui/core/TablePagination';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Template from '../../containers/template';
import PageTitle from '../styled/pageTitle';
import TabAdmin from '../tabs/tabAdmin';
import { useSnackBar } from '../../lib/hooks/snackbar';
import { useLogin } from '../../lib/loginContext';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  searchInput: {
    height: '29px',
    fontSize: '0.9rem',
  },
});

function IndexAdministration({
  getList,
  list,
  count,
  searchInput,
  setSearchInput,
  deleteMutation,
  tabData,
  columns,
  subtitles,
}) {
  const classes = useStyles();
  const { addAlert } = useSnackBar();
  const { activeRole } = useLogin();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [deleteItemReq] = useMutation(deleteMutation);

  const handleChangePage = (event, selectedPage) => {
    setPage(selectedPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    getList(rowsPerPage, page);
  }, [page, rowsPerPage, searchInput, activeRole]);

  const handleChangeFilter = (e) => {
    setSearchInput(e.target.value);
    setPage(0);
  };

  const deleteItem = async (id, deleteLabel) => {
    try {
      await deleteItemReq({ variables: { id } });
      setSearchInput('');
      addAlert({ message: tabData(deleteLabel).deletedText, severity: 'success' });
      if (list.length === 1 && page > 0) {
        return setPage(page - 1);
      }
      return getList(rowsPerPage, page);
    } catch (e) {
      addAlert({ message: 'Une erreur est survenue', severity: 'warning' });
      return e;
    }
  };

  return (
    <Template>
      <PageTitle title="Administration" subtitles={subtitles} />
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
          <TabAdmin
            rows={list}
            columns={columns}
            deleteItem={deleteItem}
            tabData={tabData}
          />
        </Grid>
        <Grid item sm={6} xs={12} md={8} lg={8}>
          <TablePagination
            rowsPerPageOptions={[10, 20, 30, 40, 50]}
            component="div"
            count={count}
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

IndexAdministration.propTypes = {
  getList: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  count: PropTypes.number,
  searchInput: PropTypes.string,
  setSearchInput: PropTypes.func.isRequired,
  deleteMutation: PropTypes.objectOf(PropTypes.shape).isRequired,
  tabData: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  subtitles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

IndexAdministration.defaultProps = {
  count: 10,
  searchInput: '',
};

export default IndexAdministration;

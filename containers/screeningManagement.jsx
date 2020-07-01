import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Material Import
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

import { CSVLink } from 'react-csv';
import { useSnackBar } from '../lib/ui-providers/snackbar';
import {
  TabPanel, TabScreeningVisitors,
} from '../components';
import Template from './template';

import { tableSort, getComparator } from '../utils/mappers/sortArrays';

import { MUTATE_VISITOR } from './requestDetail/requestDetailToTreat';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  pageTitle: {
    margin: '16px 0',
    color: '#0d40a0',
    fontWeight: theme.typography.fontWeightBold,
  },
  pageTitleHolder: {
    borderBottom: '1px solid #e5e5e5',
  },
  pageTitleControl: {
    marginLeft: 'auto',
  },
}));

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#0d40a0',
    minWidth: 72,
    fontSize: 22,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      opacity: 1,
    },
    '&$selected': {
      color: '#0d40a0',
      fontWeight: theme.typography.fontWeightBold,
      backgroundColor: 'rgba(219, 227, 239, 0)',
    },
    backgroundColor: 'rgba(219, 227, 239, .6)',
    borderRadius: '5%',
  },
  selected: {},
  // Many props needed by Material-UI
  // eslint-disable-next-line react/jsx-props-no-spreading
}))((props) => <Tab disableRipple {...props} />);


function csvName() {
  const date = new Date(Date.now());
  const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  };
  const titleCsv = `criblage du ${date.toLocaleString('fr-FR', options)}.csv`;
  return titleCsv;
}

const csvHeaders = [
  { label: 'Nom de N.', key: 'vBirthName' },
  { label: 'Date de N.', key: 'vBirthDate' },
  { label: 'Lieu de N.', key: 'vBirthPlace' },
  { label: 'Prénom', key: 'vFirstName' },
  { label: 'Nationalité', key: 'vNationality' },
];


export const LIST_VISITOR_REQUESTS = gql`
  query ListVisitorsRequestQuery($campusId: String!, $search: String, $cursor: OffsetCursor!) {
    campusId @client @export(as: "campusId")
    getCampus(id: $campusId) {
      listVisitors(search: $search, cursor: $cursor) {
        list {
          id
          firstname
          nationality
          birthday
          birthplace
          birthLastname
          unit
          }
        meta {
          total
        }
      }
    }
  }`;

export default function ScreeningManagement() {
  const classes = useStyles();

  const { addAlert } = useSnackBar();
  // submit values
  const [visitors, setVisitors] = useState([]);

  // tabMotor
  const [value, setValue] = useState(0);

  // filters
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('birthLastname');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { data, fetchMore, refetch } = useQuery(LIST_VISITOR_REQUESTS, {
    variables: {
      cursor: { first: rowsPerPage, offset: page * rowsPerPage },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const [shiftVisitor] = useMutation(MUTATE_VISITOR);

  const tabList = [
    {
      index: 0,
      label: `A traiter ${
        data && data.getCampus.listVisitors.meta.total > 0
          ? `(${data.getCampus.listVisitors.meta.total})`
          : ''
      }`,
    },
  ];

  const createSortHandler = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const sortArray = () => {
    if (!data) return [];
    return tableSort(data.getCampus.listVisitors.list, getComparator(order, orderBy))
      .filter((row) => Object.keys(row).some((x) => {
        if (search.length === 0) return true;
        if (search && typeof row[x] === 'string') {
          return row[x].toUpperCase().includes(search.toUpperCase());
        }
        return false;
      }));
  };

  const csvData = sortArray().map((row) => ({
    vBirthName: row.birthLastname.toUpperCase(),
    vBirthDate: row.birthdate,
    vBirthPlace: row.birthplace.toUpperCase(),
    vFirstName: row.firstname.toUpperCase(),
    vNationality: row.nationality.toUpperCase(),
  }));

  const handleFetchMore = async () => {
    fetchMore({
      variables: {
        cursor: { first: rowsPerPage, offset: page * rowsPerPage },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
  };

  const handlePageSize = () => {
    if (!data) return 0;
    return data.getCampus.listVisitors.meta.total;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    handleFetchMore();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    handleFetchMore();
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPage(0);
  };

  const submitForm = async () => {
    await Promise.all(
      visitors.map(async (visitor) => {
        if (visitor.validation !== null) {
          try {
            await shiftVisitor({
              variables: { requestId, visitorId: visitor.id, transition: visitor.report },
            });
          } catch (e) {
            addAlert({
              message: e.message,
              severity: 'error',
            });
          }
        }
      }),
    );
    // refresh the query
    refetch();
  };

  return (
    <Template>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center" className={classes.pageTitleHolder}>
            <Typography variant="h5" className={classes.pageTitle}>
              Demandes de contrôle
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
          {/** Tabulator  */}
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="off">
            {tabList.map((tab, index) => (
              <AntTab label={tab.label} id={index} aria-controls={index} key={tab.label} />
            ))}
          </Tabs>
        </Grid>
        <Grid item sm={12} xs={12}>
          <TabPanel value={value} index={0}>
            <Grid container spacing={1} className={classes.searchField}>
              <Grid item sm={2} xs={12} md={1} lg={1}>
                <Button size="small" variant="contained" color="primary" endIcon={<NoteAddIcon />}>
                  <CSVLink
                    className={classes.linkCsv}
                    data={csvData}
                    separator=";"
                    headers={csvHeaders}
                    filename={csvName()}
                  >
                    Export
                  </CSVLink>
                </Button>
              </Grid>
              <Grid item sm={6} xs={12} md={8} lg={8}>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 30, 40, 50]}
                  component="div"
                  count={handlePageSize()}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Grid>
              <Grid item sm={3} xs={12} md={2} lg={2}>
                <TextField
                  style={{ float: 'right' }}
                  margin="dense"
                  variant="outlined"
                  onChange={(event) => {
                    setPage(0);
                    setSearch(event.target.value);
                  }}
                  placeholder="Rechercher..."
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    inputProps: { 'data-testid': 'searchField' },
                  }}
                />
              </Grid>
            </Grid>
            <TabScreeningVisitors
              visitors={sortArray()}
              sortHandler={createSortHandler}
              oder={order}
              orderBy={orderBy}
              onChange={(visitorsChange) => setVisitors(visitorsChange)}
            />
          </TabPanel>
          <TabPanel value={value} index={1} />
        </Grid>

        <Grid item sm={12}>
          <Grid container justify="flex-end">
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={submitForm}
                disabled={!visitors.find((visitor) => visitor.report !== null)}
              >
                Soumettre
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Template>
  );
}

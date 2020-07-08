import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Material Import
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';


import {
  TabPanel, TabMesDemandesToTreat, TabDemandesProgress,
} from '../components';
import Template from './template';

import { STATE_REQUEST } from '../utils/constants/enums';
import { useLogin } from '../lib/loginContext';
import { urlAuthorization } from '../utils/permissions';

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

export const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#0d40a0',
    minWidth: 72,
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


export const LIST_REQUESTS = gql`
         query listRequests(
           $campusId: String!
           $as: ValidationPersonas!
           $filters: RequestFilters!
           $cursor: OffsetCursor!
         ) {
           campusId @client @export(as: "campusId")
           getCampus(id: $campusId) {
             listRequests(as: $as, filters: $filters, cursor: $cursor) {
               list {
                 id
                 from
                 to
                 reason
                 places {
                   label
                 }
                 owner {
                   firstname
                   lastname
                   unit
                 }
               }
               meta {
                 total
               }
             }
           }
         }
       `;

export const LIST_MY_REQUESTS = gql`
         query listMyRequests(
           $campusId: String!
           $cursor: OffsetCursor!
           $filters: RequestFilters!
         ) {
           campusId @client @export(as: "campusId")
           getCampus(id: $campusId) {
             listMyRequests(filters: $filters, cursor: $cursor) {
               list {
                 id
                 from
                 to
                 reason
                 places {
                   label
                 }
               }
               meta {
                 total
               }
             }
           }
         }
       `;

export default function MenuRequest() {
  const classes = useStyles();
  const { activeRole } = useLogin();


  const [value, setValue] = React.useState(0);

  /** @todo searchField filters
  const [search, setSearch] = React.useState('');
   */

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const initMount = React.useRef(true);

  const { data: toTreat, fetchMore: fetchToTreat } = useQuery(
    LIST_REQUESTS,
    {
      variables: {
        cursor: {
          first: rowsPerPage,
          offset: page * rowsPerPage,
        },
        filters: {
          status: STATE_REQUEST.STATE_CREATED.state,
        },
        as: {
          role: activeRole.role,
          unit: activeRole.unitLabel,
        },
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
    },
  );

  const { data: inProgress, fetchMore: fetchInProgress } = useQuery(LIST_MY_REQUESTS, {
    variables: {
      filters: { status: STATE_REQUEST.STATE_CREATED.state },
      cursor: {
        first: rowsPerPage,
        offset: page * rowsPerPage,
      },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const { data: treated, fetchMore: fetchTreated } = useQuery(LIST_REQUESTS, {
    variables: {
      filters: {
        status: [
          STATE_REQUEST.STATE_CANCELED.state,
          STATE_REQUEST.STATE_ACCEPTED.state,
          STATE_REQUEST.STATE_REJECTED.state,
          STATE_REQUEST.STATE_MIXED.state,
        ],
      },
      cursor: {
        first: rowsPerPage,
        offset: page * rowsPerPage,
      },
      as: { role: activeRole.role, unit: activeRole.unitLabel },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const handleFetchMore = () => {
    switch (value) {
      case 0:
        fetchToTreat({
          variables: {
            cursor: {
              first: rowsPerPage,
              offset: page * rowsPerPage,
            },
            filters: {
              status: STATE_REQUEST.STATE_CREATED.state,
            },
            as: {
              role: activeRole.role,
              unit: activeRole.unitLabel,
            },
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return fetchMoreResult;
          },
        });
        break;
      case 1:
        fetchInProgress({
          variables: {
            cursor: {
              first: rowsPerPage,
              offset: page * rowsPerPage,
            },
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            return fetchMoreResult;
          },
        });
        break;
      case 2:
        fetchTreated({
          variables: {
            filters: {
              status: [
                STATE_REQUEST.STATE_CANCELED.state,
                STATE_REQUEST.STATE_ACCEPTED.state,
                STATE_REQUEST.STATE_REJECTED.state,
                STATE_REQUEST.STATE_MIXED.state,
              ],
            },
            cursor: {
              first: rowsPerPage,
              offset: page * rowsPerPage,
            },
            as: { role: activeRole.role, unit: activeRole.unitLabel },
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return fetchMoreResult;
          },
        });
        break;
      default:
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    if (initMount.current) {
      initMount.current = false;
    }
    handleFetchMore();
  }, [page, rowsPerPage]);

  const refetchQueries = [
    {
      query: LIST_MY_REQUESTS,
      variables: {
        filters: { status: STATE_REQUEST.STATE_CREATED.state },
      },
      fetchPolicy: 'cache-and-network',
    },
    {
      query: LIST_REQUESTS,
      variables: {
        filters: { status: STATE_REQUEST.STATE_CREATED.state },
        as: { role: activeRole.role, unit: activeRole.unitLabel },
      },
      fetchPolicy: 'cache-and-network',
    }];


  const tabList = [
    {
      index: 0,
      label: `A traiter ${
        toTreat && toTreat.getCampus.listRequests.meta.total > 0
          ? `(${toTreat.getCampus.listRequests.meta.total})`
          : ''
      }`,
      access: urlAuthorization('/demandes/a-traiter', activeRole.role),
    },
    {
      index: 1,
      label: `En cours ${
        inProgress && inProgress.getCampus.listMyRequests.meta.total > 0
          ? `(${inProgress.getCampus.listMyRequests.meta.total})`
          : ''
      }`,
      access: urlAuthorization('/nouvelle-demande', activeRole.role),
    },
    {
      index: 2,
      label: `Traitées ${
        treated && treated.getCampus.listRequests.meta.total > 0
          ? `(${treated.getCampus.listRequests.meta.total})`
          : ''
      }`,
      access: true,
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPage(0);
  };

  const handlePageSize = () => {
    switch (value) {
      case 0:
        if (!toTreat) return 0;
        return toTreat.getCampus.listRequests.meta.total;
      case 1:
        if (!inProgress) return 0;
        return inProgress.getCampus.listMyRequests.meta.total;
      case 2:
        if (!treated) return 0;
        return treated.getCampus.listRequests.meta.total;
      default:
        return 0;
    }
  };

  return (
    <Template>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center">
            <Typography variant="h5" className={classes.pageTitle}>
              Mes Demandes
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
          {/** Tabulator  */}
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="off"
            aria-label="simple tabs example"
          >
            {tabList.map(
              (tab) => tab.access && (
              <AntTab
                label={tab.label}
                value={tab.index}
                id={tab.index}
                aria-controls={tab.index}
                key={tab.label}
              />
              ),
            )}
          </Tabs>
        </Grid>
        <Grid container className={classes.searchField}>
          <Grid item sm={12} xs={12} md={12} lg={12}>
            {handlePageSize() > 0 && (
              <TextField
                style={{ float: 'right' }}
                margin="dense"
                variant="outlined"
                onChange={() => {
                  setPage(0);
                  // @todo
                  // setSearch(event.target.value);
                }}
                placeholder="Rechercher..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  inputProps: {
                    'data-testid': 'searchField',
                  },
                }}
              />
            )}
          </Grid>
        </Grid>
        <Grid item sm={12} xs={12}>
          {urlAuthorization('/demandes/a-traiter', activeRole.role) && (
          <TabPanel value={value} index={0}>
            <TabMesDemandesToTreat
              request={toTreat ? toTreat.getCampus.listRequests.list : []}
              detailLink="a-traiter"
            />
          </TabPanel>
          )}
          {urlAuthorization('/nouvelle-demande', activeRole.role) && (
            <TabPanel value={value} index={1}>
              <TabDemandesProgress
                request={inProgress ? inProgress.getCampus.listMyRequests.list : []}
                queries={refetchQueries}
              />
            </TabPanel>
          )}
          <TabPanel value={value} index={2}>
            <TabMesDemandesToTreat
              request={treated ? treated.getCampus.listRequests.list : []}
              detailLink="traitees"
            />
          </TabPanel>
        </Grid>
        <Grid item sm={6} xs={12} md={8} lg={8}>
          {handlePageSize() > 0 && (
            <TablePagination
              rowsPerPageOptions={[10, 20, 30, 40, 50]}
              component="div"
              count={handlePageSize()}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          )}
        </Grid>
      </Grid>
    </Template>
  );
}

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
import Button from '@material-ui/core/Button';

import { fade } from '@material-ui/core/styles/colorManipulator';

import TablePagination from '@material-ui/core/TablePagination';
// import TextField from '@material-ui/core/TextField';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import SearchIcon from '@material-ui/icons/Search';

import {
  TabPanel, TabMesDemandesToTreat, TabDemandesProgress, TabMesDemandesTreated,
} from '../components';
import Template from './template';

import { ROLES, STATE_REQUEST } from '../utils/constants/enums';
import { useLogin } from '../lib/loginContext';
import { urlAuthorization } from '../utils/permissions';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  tab: {
    '& .MuiBox-root': {
      padding: 'Opx',
    },
  },
  pageTitle: {
    margin: '16px 0',
    color: '#0d40a0',
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
    color: theme.palette.primary.main,
    fontSize: '1rem',
    minWidth: 72,
    marginRight: theme.spacing(5),
    '&:hover': {
      opacity: 1,
    },
    '&$selected': {
      color: theme.palette.primary.main,
      fontWeight: 'bold',
      backgroundColor: fade(theme.palette.primary.main, 0),
    },
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    borderRadius: '5%',
  },
  selected: {},
// Many props needed by Material-UI
// eslint-disable-next-line react/jsx-props-no-spreading
}))((props) => <Tab disableRipple {...props} />);

export const LIST_REQUESTS = gql`
         query listRequestByVisitorStatus(
           $campusId: String!
           $as: ValidationPersonas!
           $filters: RequestVisitorFilters
           $cursor: OffsetCursor!
           $isDone: RequestVisitorIsDone!
         ) {
           campusId @client @export(as: "campusId")
           getCampus(id: $campusId) {
               listRequestByVisitorStatus(as: $as, filters: $filters, cursor: $cursor, isDone: $isDone) {
                 list {
                     id
                     requestData {
                         from
                         to
                         reason
                         status
                         places {
                             label
                         }
                         owner {
                             firstname
                             lastname
                             unit
                         }
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
                 status
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

  const [value, setValue] = React.useState(activeRole.role === ROLES.ROLE_HOST.role ? 1 : 0);

  /** @todo searchField filters
  const [search, setSearch] = React.useState('');
   */

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const childRef = React.useRef();

  const initMount = React.useRef(true);

  const { data: toTreat, loading: loadingToTreat, fetchMore: fetchToTreat } = useQuery(
    LIST_REQUESTS,
    {
      variables: {
        cursor: {
          first: rowsPerPage,
          offset: page * rowsPerPage,
        },
        as: {
          role: activeRole.role,
          unit: activeRole.unit,
        },
        isDone: { value: false },
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
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
    fetchPolicy: 'network-only',
  });

  const selectTreatedOptions = () => {
    if (activeRole.role === ROLES.ROLE_HOST.role) {
      return {
        cursor: {
          first: rowsPerPage,
          offset: page * rowsPerPage,
        },
        filters: {
          status: [
            STATE_REQUEST.STATE_CANCELED.state,
            STATE_REQUEST.STATE_ACCEPTED.state,
            STATE_REQUEST.STATE_MIXED.state,
            STATE_REQUEST.STATE_REJECTED.state,
          ],
        },
      };
    }
    return {
      cursor: {
        first: rowsPerPage,
        offset: page * rowsPerPage,
      },
      as: { role: activeRole.role, unit: activeRole.unit },
      isDone: { value: true },
    };
  };

  const selectTreatedPath = (treatedData) => {
    if (activeRole.role === ROLES.ROLE_HOST.role) {
      return treatedData.getCampus.listMyRequests;
    }
    return treatedData.getCampus.listRequestByVisitorStatus;
  };

  const { data: treated, fetchMore: fetchTreated } = useQuery(
    activeRole.role === ROLES.ROLE_HOST.role ? LIST_MY_REQUESTS : LIST_REQUESTS,
    {
      variables: selectTreatedOptions(),
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
    },
  );

  const mapRequestData = (data) => {
    if (activeRole.role === ROLES.ROLE_HOST.role) {
      return data.getCampus.listMyRequests.list;
    }
    return data.getCampus.listRequestByVisitorStatus.list.map((r) => ({
      id: r.id,
      ...r.requestData[0],
    }));
  };

  const handleFetchMore = () => {
    switch (value) {
      case 0:
        fetchToTreat({
          variables: {
            cursor: {
              first: rowsPerPage,
              offset: page * rowsPerPage,
            },
            as: {
              role: activeRole.role,
              unit: activeRole.unit,
            },
            isDone: { value: false },
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
          variables: selectTreatedOptions(),
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
        isDone: { value: true },
        as: { role: activeRole.role, unit: activeRole.unit },
      },
      fetchPolicy: 'cache-and-network',
    }];

  const tabList = [
    {
      index: 0,
      label: `A traiter ${
        toTreat && toTreat.getCampus.listRequestByVisitorStatus.meta.total > 0
          ? `(${toTreat.getCampus.listRequestByVisitorStatus.meta.total})`
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
        treated && selectTreatedPath(treated).meta.total > 0
          ? `(${selectTreatedPath(treated).meta.total})`
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
        return toTreat.getCampus.listRequestByVisitorStatus.meta.total;
      case 1:
        if (!inProgress) return 0;
        return inProgress.getCampus.listMyRequests.meta.total;
      case 2:
        if (!treated) return 0;
        return selectTreatedPath(treated).meta.total;
      default:
        return 0;
    }
  };

  return (
    <Template loading={loadingToTreat}>
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
            {/* handlePageSize() > 0 && (
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
            ) */}
          </Grid>
        </Grid>
        <Grid item sm={12} xs={12}>
          {urlAuthorization('/demandes/a-traiter', activeRole.role) && (
          <TabPanel value={value} index={0} classes={{ root: classes.tab }}>
            <TabMesDemandesToTreat
              requests={toTreat ? mapRequestData(toTreat) : []}
              detailLink="a-traiter"
              emptyLabel="à traiter"
            />
          </TabPanel>
          )}
          {urlAuthorization('/nouvelle-demande', activeRole.role) && (
            <TabPanel value={value} index={1} classes={{ root: classes.tab }}>
              <TabDemandesProgress
                request={inProgress ? inProgress.getCampus.listMyRequests.list : []}
                queries={refetchQueries}
                emptyLabel="en cours"
              />
            </TabPanel>
          )}
          <TabPanel value={value} index={2} classes={{ root: classes.tab }}>

            {activeRole.role === ROLES.ROLE_ACCESS_OFFICE.role ? (
              <TabMesDemandesTreated
                requests={treated ? treated.getCampus.listRequestByVisitorStatus.list : []}
                detailLink="traitees"
                emptyLabel="traitée"
                ref={childRef}
              />
            ) : (
              <TabMesDemandesToTreat
                requests={treated ? mapRequestData(treated) : []}
                detailLink="traitees"
                emptyLabel="traitée"
              />
            )}
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
        { (value === 2
        && activeRole.role === ROLES.ROLE_ACCESS_OFFICE.role
        && selectTreatedPath(treated).list.length > 0) && (
        <Grid item sm={2} xs={12} md={4} lg={4}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => { childRef.current.execExport(); }}
          >
            Exporter
          </Button>
        </Grid>
        )}

      </Grid>
    </Template>
  );
}

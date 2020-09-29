import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
// Material Import
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from 'next/link';


import { fade } from '@material-ui/core/styles/colorManipulator';

import TablePagination from '@material-ui/core/TablePagination';
// import TextField from '@material-ui/core/TextField';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import SearchIcon from '@material-ui/icons/Search';

import {
  TabPanel,
  TabMesDemandesToTreat,
  TabDemandesProgress,
} from '../components';
import Template from './template';

import { ROLES, STATE_REQUEST } from '../utils/constants/enums';
import { useLogin } from '../lib/loginContext';
import { urlAuthorization } from '../utils/permissions';
import GroupButton from '../components/styled/buttonGroupRequest';

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
  requestButtons: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  button: {
    width: '300px',
    textTransform: 'none',
    fontSize: '1.1rem',
  },
  buttonInfos: {
    display: 'block',
  },
  instruction: {
    fontStyle: 'italic',
    maxWidth: '300px',
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

export const LIST_MY_REQUESTS = gql`
  query listMyRequests($campusId: String!, $cursor: OffsetCursor!, $filters: RequestFilters!) {
    campusId @client @export(as: "campusId")
    getCampus(id: $campusId) {
      id
      listMyRequests(filters: $filters, cursor: $cursor) {
        list {
          id
          from
          to
          reason
          status
          places {
            id
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

export default function MyRequestAcces() {
  const classes = useStyles();
  const { activeRole } = useLogin();


  const [value, setValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = JSON.parse(window.localStorage.getItem('menuValue'));

      // Parse stored json or if none return initialValue
      if (item) return item;
      return (activeRole.role === ROLES.ROLE_HOST.role ? 1 : 0);
    } catch (error) {
      return (activeRole.role === ROLES.ROLE_HOST.role ? 1 : 0);
    }
  });
  /** @todo searchField filters
  const [search, setSearch] = React.useState('');
   */

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const {
    data: inProgress, loading: loadingInProgress, fetchMore: fetchInProgress,
  } = useQuery(LIST_MY_REQUESTS, {
    variables: {
      filters: { status: STATE_REQUEST.STATE_CREATED.state },
      cursor: {
        first: rowsPerPage,
        offset: page * rowsPerPage,
      },
    },
    fetchPolicy: 'cache-and-network',
  });


  const { data: treated, loading: loadingTreated, fetchMore: fetchTreated } = useQuery(
    // activeRole.role === ROLES.ROLE_HOST.role ? LIST_MY_REQUESTS : LIST_REQUESTS,
    LIST_MY_REQUESTS,
    {
      variables: {
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
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const mapRequestData = (data) => data.getCampus.listMyRequests.list;

  const handleFetchMore = () => {
    switch (value) {
      case 0:
        fetchInProgress({
          query: LIST_MY_REQUESTS,
          variables: {
            cursor: {
              first: rowsPerPage,
              offset: page * rowsPerPage,
            },
            filters: { status: STATE_REQUEST.STATE_CREATED.state },
          },
        });
        break;
      case 1:
        fetchTreated({
          query: LIST_MY_REQUESTS,
          variables: {
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
          },
        });
        break;
      default:
    }
  };

  const handleChangePage = (event, newPage) => {
    handleFetchMore();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    handleFetchMore();
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const refetchQueries = [
    {
      query: LIST_MY_REQUESTS,
      variables: {
        filters: { status: STATE_REQUEST.STATE_CREATED.state },
      },
    },
  ];

  const tabList = [
    {
      index: 0,
      label: `En cours ${
        inProgress && inProgress.getCampus.listMyRequests.meta.total > 0
          ? `(${inProgress.getCampus.listMyRequests.meta.total})`
          : ''
      }`,
      access: urlAuthorization('/mes-demandes', activeRole.role),
    },
    {
      index: 1,
      label: `Traitées ${
        treated && treated.getCampus.listMyRequests.meta.total > 0
          ? `(${treated.getCampus.listMyRequests.meta.total})`
          : ''
      }`,
      access: true,
    },
  ];

  const handleChange = async (event, newValue) => {
    window.localStorage.setItem('menuValue', JSON.stringify(newValue));
    setValue(newValue);
    setPage(0);
  };

  const handlePageSize = () => {
    switch (value) {
      case 0:
        if (!inProgress) return 0;
        return inProgress.getCampus.listMyRequests.meta.total;
      case 1:
        if (!treated) return 0;
        return treated.getCampus.listMyRequests.meta.total;
      default:
        return 0;
    }
  };

  return (
    <Template loading={loadingTreated && loadingInProgress}>
      <Grid container spacing={2}>
        <Grid item sm={12} md={4} className={classes.buttonInfos}>
          <Link href="/nouvelle-demande">
            <Button variant="contained" color="primary" className={classes.button}>
              Nouvelle demande
            </Button>
          </Link>
          <Typography variant="body2" className={`${classes.instruction} ${classes.pageTitle}`}>
            Conseillée pour les demandes simples, les petits groupes sans référent.
          </Typography>
        </Grid>
        <Grid item sm={12} md={4}>
          <GroupButton />
        </Grid>
      </Grid>
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
        <Grid item sm={12} xs={12}>
          {urlAuthorization('/mes-demandes', activeRole.role) && (
            <TabPanel value={value} index={0} classes={{ root: classes.tab }}>
              <TabDemandesProgress
                request={inProgress ? inProgress.getCampus.listMyRequests.list : []}
                queries={refetchQueries}
                emptyLabel="en cours"
              />
            </TabPanel>
          )}
          <TabPanel value={value} index={1} classes={{ root: classes.tab }}>
            <TabMesDemandesToTreat
              requests={treated ? mapRequestData(treated) : []}
              detailLink="traitees"
              emptyLabel="traitée"
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

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

import { TabPanel, TabDemandesProgress, TabMesDemandesToTreat } from '../components';
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

const AntTab = withStyles((theme) => ({
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

// Modify number with API data

// @todo check to implement fragments
// const REQUEST_ATTRIBUTES = {
//   requestResult: gql`
//   fragment RequestResult on Request {
//     id
//     to
//     places {
//       label
//     }
//   }
// `,
// };

export const LIST_REQUESTS = gql`
         query listRequests($campusId: String!, $as: ValidationPersonas!, $filters: RequestFilters!) {
           campusId @client @export(as: "campusId")
           getCampus(id: $campusId) {
             listRequests(as: $as, filters: $filters) {
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
           $campusId: String!, $filters: RequestFilters!
         ) {
           campusId @client @export(as: "campusId")
           getCampus(id: $campusId) {
             listMyRequests(filters: $filters)  {
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

  const {
    data: toTreat,
    loading: loadingToTreat,
    error: errorToTreat,
  } = useQuery(LIST_REQUESTS, {
    variables: {
      filters: { status: STATE_REQUEST.STATE_CREATED.state },
      as: { role: activeRole.role, unit: activeRole.unitLabel },
    },
    fetchPolicy: 'cache-and-network',
  });


  const { data: inProgress, loading: loadingInProgress, error: errorInProgress } = useQuery(
    LIST_MY_REQUESTS,
    {
      variables: {
        filters: { status: STATE_REQUEST.STATE_CREATED.state },
      },
      fetchPolicy: 'cache-and-network',
    },
  );

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

  const [value, setValue] = React.useState(0);

  const tabList = [
    { label: `A traiter (${!loadingToTreat ? toTreat.getCampus.listRequests.meta.total : '...'})`, access: true },
    { label: `En cours (${!loadingInProgress ? inProgress.getCampus.listMyRequests.meta.total : '...'})`, access: urlAuthorization('/nouvelle-demande', activeRole.role) },
    { label: 'Traitées', access: true },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // to remove
  if (loadingToTreat || loadingInProgress) return 'loading screen toDO';
  if (errorToTreat || errorInProgress) {
    return (
      <Template>
        Error:
        {' '}
        {errorToTreat}
      </Template>
    );
  }

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
            {tabList.map((tab, index) => (
              tab.access
              && <AntTab label={tab.label} id={index} aria-controls={index} key={tab.label} />
            ))}
          </Tabs>
        </Grid>
        <Grid item sm={12} xs={12}>
          <TabPanel value={value} index={0}>
            <TabMesDemandesToTreat request={toTreat.getCampus.listRequests.list} />
          </TabPanel>
          {urlAuthorization('/nouvelle-demande', activeRole.role) && (
          <TabPanel value={value} index={1}>
            <TabDemandesProgress
              request={inProgress.getCampus.listMyRequests.list}
              queries={refetchQueries}
            />
          </TabPanel>
          )}
          <TabPanel value={value} index={2}>
            <TabMesDemandesToTreat request={[]} />
          </TabPanel>
        </Grid>
      </Grid>
    </Template>
  );
}

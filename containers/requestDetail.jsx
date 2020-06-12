import React from 'react';

// Material Import
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { DetailsInfosRequest, DetailsVisitorsRequest } from '../components';

import Template from './template';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  pageTitle: {
    margin: '16px 0',
    color: '#0d40a0',
    fontWeight: theme.typography.fontWeightBold,
  },
  idRequest: {
    marginLeft: '10px',
    marginTop: '4px',
    color: '#0d40a0',
  },
  pageTitleHolder: {
    borderBottom: '1px solid #e5e5e5',
  },
  pageTitleControl: {
    marginLeft: 'auto',
  },
  tabContent: {
    margin: '20px 0',
  },
}));

// Provisory DATA
function getRequest(idRequest) {
  return {
    id: idRequest,
    reason: 'un motif raisonnable',
    from: new Date('2020-05-21T12:39:00.000+00:00'),
    to: new Date('2020-05-23T12:39:00.000+00:00'),
    owner: {
      firstname: 'Michel',
      birthLastname: 'Poquet',
      rank: 'SGC',
      company: 'Fort Lamalgue',
    },
    visitors: [
      {
        firstname: 'Michel',
        birthLastname: 'Poquet',
        rank: 'SGC',
        company: 'Fort Lamalgue',
      },
      {
        firstname: 'Stephen',
        birthLastname: 'Peanuts',
        rank: 'SGT',
        company: 'CDAD T',
      },
    ],
    places: ['BN TOULON'],
  };
}


export default function NestedList({ request }) {
  const classes = useStyles();

  // @todo GET REQUEST OBJECT WITH ID
  const data = getRequest(request);

  return (
    <Template>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center" className={classes.pageTitleHolder}>
            <Typography variant="h5" className={classes.pageTitle}>
              {/* @todo change title if treated */}
              Demandes à traiter:
            </Typography>
            <Typography variant="subtitle2" className={classes.idRequest}>
              {/* @todo change title if treated */}
              {data.id}
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
          <DetailsInfosRequest request={data} />
        </Grid>
        <Grid item sm={12} xs={12} className={classes.tabContent}>
          <DetailsVisitorsRequest
            visitors={data.visitors}
            onChange={(visitors) => {
              console.log(visitors);
            }}
          />
        </Grid>
        <Grid item sm={12}>
          <Grid container justify="flex-end">
            <div>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginRight: '5px' }}
              >
                Annuler
              </Button>
            </div>
            <div>
              <Button variant="contained" color="primary">
                Envoyer
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Template>
  );
}

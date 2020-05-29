import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { format } from 'date-fns';

const useStyles = makeStyles(() => ({
  categorie: {
    fontWeight: 'bold',
  },
}));

export default function DetailsInfosRequest({ request }) {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item sm={6}>
        <Typography variant="body1" className={classes.categorie}>
          Demandeur:
          {' '}
        </Typography>
        <Typography variant="body2">
          {request.owner.rank}
          {' '}
          {request.owner.birthLastname.toUpperCase()}
          {' '}
          {request.owner.firstname}
        </Typography>
      </Grid>
      <Grid item sm={6}>
        <Typography variant="body1" className={classes.categorie}>
          Période:
          {' '}
        </Typography>
        <Typography variant="body2">
          {format(new Date(request.from), 'dd/MM/yyyy')}
          {' '}
          au
          {' '}
          {format(new Date(request.to), 'dd/MM/yyyy')}
        </Typography>
      </Grid>
      <Grid item sm={6}>
        <Typography variant="body1" className={classes.categorie}>
          Lieux:
          {' '}
        </Typography>
        <Typography variant="body2">Base navale, HOMLET, Mess</Typography>
      </Grid>
      <Grid item sm={6}>
        <Typography variant="body1" className={classes.categorie}>
          Motif:
        </Typography>
        <Typography variant="body2">{request.reason}</Typography>
        {' '}
      </Grid>
    </Grid>
  );
}

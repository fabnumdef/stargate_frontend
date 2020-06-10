import React from 'react';
import PropTypes from 'prop-types';
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
        <Typography variant="body1" className={classes.categorie} color="primary">
          Demandeur:
          {' '}
        </Typography>
        <Typography variant="body2" color="primary">
          {request.owner.rank}
          {' '}
          {request.owner.birthLastname.toUpperCase()}
          {' '}
          {request.owner.firstname}
        </Typography>
      </Grid>
      <Grid item sm={6}>
        <Typography variant="body1" className={classes.categorie} color="primary">
          Période:
          {' '}
        </Typography>
        <Typography variant="body2" color="primary">
          {format(new Date(request.from), 'dd/MM/yyyy')}
          {' '}
          au
          {' '}
          {format(new Date(request.to), 'dd/MM/yyyy')}
        </Typography>
      </Grid>
      <Grid item sm={6}>
        <Typography variant="body1" className={classes.categorie} color="primary">
          Lieux:
          {' '}
        </Typography>
        <Typography variant="body2" color="primary">
          {' '}
          {request.places.map((lieu, index) => {
            if (index === request.places.length - 1) return `${lieu.label}.`;
            return `${lieu.label}, `;
          })}
        </Typography>
      </Grid>
      <Grid item sm={6}>
        <Typography variant="body1" className={classes.categorie} color="primary">
          Motif:
        </Typography>
        <Typography variant="body2" color="primary">
          {request.reason}
        </Typography>
      </Grid>
    </Grid>
  );
}


DetailsInfosRequest.propTypes = {
  request: PropTypes.shape({
    owner: PropTypes.shape({
      rank: PropTypes.string,
      birthLastname: PropTypes.string,
      firstname: PropTypes.string,
    }),
    places: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
      }),
    ),
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
    reason: PropTypes.string,
  }).isRequired,
};

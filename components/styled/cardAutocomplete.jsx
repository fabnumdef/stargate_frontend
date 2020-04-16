import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

export default function CardAutocomplete({ option, index }) {
  return (
    <Grid container alignItems="center">
      <Grid item>
        <AccountCircleIcon style={{ marginRight: '10px' }} />
      </Grid>
      <Grid item>
        <span key={index}>
          {option.gradeVisiteur}
          {' '}
          {option.nomVisiteur}
          {' '}
          {option.prenomVisiteur}
        </span>
        <Typography variant="body2" color="textSecondary">
          {option.emailVisiteur}
        </Typography>
      </Grid>
    </Grid>
  );
}

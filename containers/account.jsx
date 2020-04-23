import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Template from './template';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    height: '75vh',
    minWidth: 300,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  pageTitle: {
    margin: '16px 0',
    color: '#0d40a0',
    fontWeight: theme.typography.fontWeightBold,
  },
  pageTitleHolder: {
    borderBottom: '1px solid #e5e5e5',
  },
}));

export default function Account() {
  const classes = useStyles();

  return (
    <Template>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center" className={classes.pageTitleHolder}>
            <Typography variant="h5" className={classes.pageTitle}>
              Mon Compte
            </Typography>
          </Box>
        </Grid>

        <Grid item sm={12} xs={12} />
        <Grid item sm={12} xs={12} />
      </Grid>
    </Template>
  );
}

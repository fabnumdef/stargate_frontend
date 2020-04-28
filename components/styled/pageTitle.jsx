import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  pageTitle: {
    margin: '16px 0',
    color: '#0d40a0',
    fontSize: theme.overrides.MuiTypography.title.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },
  subtitle: {
    fontWeight: theme.overrides.MuiTypography.subtitle2.fontWeight,
  },
}));

function PageTitle({ title, subtitles = null }) {
  const classes = useStyles();

  return (
    <Grid item sm={12} xs={12}>
      <Typography variant="h2" className={classes.pageTitle}>
        { title }
        {' '}
        { subtitles && subtitles.map((sub) => (
          <span className={classes.subtitle}>
            &gt;
            {' '}
            { sub }
            {' '}
            {' '}
          </span>
        ))}
      </Typography>
    </Grid>
  );
}

export default PageTitle;

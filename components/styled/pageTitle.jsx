import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  pageTitle: {
    margin: '16px 0',
    color: '#0d40a0',
    fontSize: '1.4rem',
    fontWeight: 'bold',
  },
  subtitle: {
    fontWeight: theme.overrides.MuiTypography.subtitle2.fontWeight,
  },
}));

function PageTitle({ title, subtitles }) {
  const classes = useStyles();

  return (
    <Grid item sm={12} xs={12}>
      <Typography variant="h2" className={classes.pageTitle}>
        { `${title} ` }
        { subtitles && subtitles.map((sub) => (
          <span key={sub} className={classes.subtitle}>
            &gt;
            { ` ${sub} ` }
          </span>
        ))}
      </Typography>
    </Grid>
  );
}

PageTitle.defaultProps = {
  subtitles: [],
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitles: PropTypes.arrayOf(PropTypes.string),
};

export default PageTitle;

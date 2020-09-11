import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  iconStar: {
    height: 'auto',
  },
  gridNameIconVisit: {
    display: 'flex',
  },
}));

export default function Visitor({ name, vip }) {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item sm={9} xs={9} md={9} lg={9}>
        { name }
      </Grid>
      <Grid item sm={3} xs={3} md={3} lg={3} className={classes.gridNameIconVisit}>
        { vip && (<StarBorderRoundedIcon color="secondary" className={classes.iconStar} />) }
      </Grid>
    </Grid>
  );
}

Visitor.propTypes = {
  name: PropTypes.string.isRequired,
  vip: PropTypes.bool,
};

Visitor.defaultProps = {
  vip: false,
};

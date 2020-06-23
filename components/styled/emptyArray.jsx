import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import EmptyArrayLogo from './animations/empty';

const useStyles = makeStyles({
  svgContent: {
    textAlign: 'center',
    padding: '16px',
  },
  textContent: {
    maxWidth: '460px',
    margin: '0 auto',
    padding: '16px',
  },
});

export default function EmptyArray({ type }) {
  const classes = useStyles();
  return (
    <>
      <div className={classes.svgContent}>
        <EmptyArrayLogo />
      </div>
      <div className={classes.textContent}>
        <Typography variant="subtitle2" style={{ textAlign: 'center' }}>
          {`Aucune demande ${type}`}
        </Typography>
      </div>
    </>
  );
}

EmptyArray.propTypes = {
  type: PropTypes.string.isRequired,
};

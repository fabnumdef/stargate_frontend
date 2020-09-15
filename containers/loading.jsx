import React from 'react';

// Import Material
import { makeStyles } from '@material-ui/core/styles';

import LoadingAnimation from '../components/styled/animations/loading';

const useStyles = makeStyles(() => ({
  anim: {
    margin: '0 auto',
    width: '150px',
    height: '300px',
  },
}));

export default function Loading() {
  const classes = useStyles();

  return (
    <div className={classes.anim}>
      <LoadingAnimation />
    </div>
  );
}

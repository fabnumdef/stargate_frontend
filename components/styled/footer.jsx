import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    width: '100vw',
  },
  footerImg: {
    width: 'auto',
    height: '151px',
    position: 'relative',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  backgroundImg: {
    height: '83px',
    width: '100vw',
    position: 'absolute',
    bottom: '0',
    background: theme.palette.primary.main,
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <div className={classes.backgroundImg} />
      <img
        className={classes.footerImg}
        src="/img/footermarnat.png"
        alt="Footer Marine Nationale"
      />

    </div>
  );
}

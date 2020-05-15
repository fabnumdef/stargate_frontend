import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    width: '100%',
    height: '80px',
    backgroundColor: theme.palette.primary.main,
  },
  footerImg: {
    height: '151px',
    position: 'relative',
    top: '-90%',
    left: '50%',
    transform: 'translateX(-50%)',
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <img
        className={classes.footerImg}
        src="/img/footermarnat.png"
        alt="Footer Marine Nationale"
      />
    </div>
  );
}

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    width: '100%',
    textAlign: 'center',
    height: '78px',
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    bottom: 0,
  },
  footerImg: {
    height: '151px',
    position: 'absolute',
    bottom: 0,
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
        src="/img/footermarinenat.png"
        alt="Footer Marine Nationale"
      />
    </div>
  );
}

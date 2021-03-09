import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    width: '100%',
  },
  footerImg: {
    width: 'auto',
    height: '151px',
    position: 'relative',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  footerFabImg: {
    width: 'auto',
    height: '60px',
    position: 'absolute',
    bottom: '6%',
    right: '7%',
  },
  footerFabImgNone: {
    display: 'none',
  },
  backgroundImg: {
    height: '83px',
    width: '100%',
    position: 'absolute',
    bottom: '0',
    background: theme.palette.primary.main,
  },
}));

export default function Footer() {
  const classes = useStyles();
  const widthBreak = 850;
  const matches = useMediaQuery(`(min-width:${widthBreak}px)`);

  return (
    <div className={`${classes.footer} mui-fixed`}>
      <div className={classes.backgroundImg} />
      <img
        className={classes.footerImg}
        src="/img/footermarnat.png"
        alt="Footer Marine Nationale"
      />
      <img
        className={`${
          matches ? classes.footerFabImg : classes.footerFabImgNone} mui-fixed`}
        src="/img/footerFabNum.png"
        alt="Footer Fabrique numérique"
      />

    </div>
  );
}

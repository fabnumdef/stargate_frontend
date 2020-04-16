import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  footer: {
    width: '100%',
    height: '15%',
    position: 'absolute',
    bottom: 0,
  },
});

export default function Footer() {
  const classes = useStyles();

  return (
    <div>
      <img
        className={classes.footer}
        src="/img/footermarnat.png"
        alt="Footer Marine Nationale"
      />
    </div>
  );
}

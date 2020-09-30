import React from 'react';
import dynamic from 'next/dynamic';
// Material Imports
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';

const MenuItems = dynamic(() => import('./menu'));

const MenuIcon = dynamic(() => import('./menuIcon'));

function ElevationScroll(props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: props.window ? props.window() : undefined,
  });

  return React.cloneElement(props.children, {
    elevation: trigger ? 0 : 0,
  });
}

const useStyles = makeStyles((theme) => ({
  ellipse1: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 2,
    transform: 'translate(-50%, -50%)',
    backgroundColor: fade(theme.palette.primary.main, 0.85),
  },
  ellipse2: {
    marginTop: '10px',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    position: 'relative',
    backgroundColor: fade(theme.palette.primary.main, 0.65),
    zIndex: 'auto',
  },
  spanStar: {
    fontSize: '2.2em',
    position: 'absolute',
    lineHeight: '1.34',
    letterSpacing: '0.4px',
    top: '40%',
    right: '0',
    transform: 'translate(0, -50%)',
    color: '#ffffff',
    zIndex: 3,
  },
  spanGate: {
    fontSize: '2.2em',
    position: 'absolute',
    lineHeight: '1.34',
    letterSpacing: '0.4px',
    top: '40%',
    right: '0',
    transform: 'translate(100%, -50%)',
    color: theme.palette.secondary.main,
    zIndex: 3,
  },
  lineLogo: {
    position: 'absolute',
    backgroundColor: fade(theme.palette.primary.main, 0.65),
    width: '100vw',
    height: '2px',
    top: '51%',
    left: '100%',
  },
  lineLogoWhite: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    width: '100vw',
    height: '4px',
    top: '54%',
    left: '100%',
  },
  name: {
    position: 'absolute',
    color: fade(theme.palette.primary.main, 0.65),
    backgroundColor: '#ffffff',
    top: '55%',
    left: '110%',
    width: '45vw',
    height: '22px',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logo: {
    position: 'absolute',
    top: '13px',
  },
}));

const Logo = () => {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width: 740px)');

  if (matches) {
    return (
      <div className={classes.logo}>
        <div className={classes.ellipse2}>
          <div className={classes.ellipse1} />
          <span className={classes.spanStar}>STAR</span>
          <span className={classes.spanGate}>GATE</span>
          <div className={classes.lineLogo} />
          <div className={classes.lineLogoWhite} />
          <span className={classes.name}>
            Système de Traitement des Accès Règlementés Généralisé À Toutes les Entités
          </span>
        </div>
      </div>
    );
  }
  return <></>;
};

export default () => {
  const classes = useStyles();

  return (
    <>
      <ElevationScroll>
        <AppBar>
          <Toolbar variant="regular" style={{ height: '90px' }}>
            <Logo />
            <div className={classes.grow} />
            <MenuIcon />
            <MenuItems />
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </>
  );
};

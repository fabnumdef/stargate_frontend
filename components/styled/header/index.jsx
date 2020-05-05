import React from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
// Material Imports
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
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
    elevation: trigger ? 3 : 0,
  });
}

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logo: {
    height: '4vh',
  },
}));

export default () => {
  const classes = useStyles();

  return (
    <>
      <ElevationScroll>
        <AppBar>
          <Toolbar variant="regular">
            <Button
              edge="start"
              size="small"
              className={classes.menuButton}
              color="inherit"
              aria-label="logo"
            >
              <img className={classes.logo} src="/img/logo/stargate.png" alt="logo" />
            </Button>
            <div className={classes.grow} />
            <MenuIcon />
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <MenuItems />
    </>
  );
};

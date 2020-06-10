import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import PropTypes from 'prop-types';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { urlAuthorization } from '../../../utils/permissions';
import { useLogin } from '../../../lib/loginContext';


function getMenus() {
  return [
    { label: 'Mes Demandes', link: '/' },
    { label: 'Nouvelle Demande', link: '/nouvelle-demande' },
    { label: 'Administration', link: '/administration/utilisateurs' },
    { label: 'A propos', link: '/no-route' },
    { label: 'Contactez Nous', link: '/no-route' },
  ];
}

const ButtonMenu = withStyles(() => ({
  root: {
    textTransform: 'none',
    borderRadius: '0px',
  },
}))(Button);

function HideOnScroll({ children, window }) {
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger} timeout={1000}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

HideOnScroll.defaultProps = {
  window: null,
};

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'fixed',
    top: '55px',
    right: '0px',
  },
  grow: {
    flexGrow: 1,
  },
}));

export default function MenuItems(props) {
  const { activeRole } = useLogin();
  const menu = getMenus();
  const classes = useStyles();
  const router = useRouter();

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <HideOnScroll {...props}>
        <Toolbar className={classes.appBar}>
          <div className={classes.grow} />
          {menu.map(({ link, label }) => (
            urlAuthorization(link, activeRole.role) && (
            <Link href={link} key={label}>
              {router.pathname === link ? (
                <ButtonMenu size="small" variant="contained" color="secondary">
                  {label}
                </ButtonMenu>
              ) : (
                <ButtonMenu size="small" variant="contained" color="primary">
                  {label}
                </ButtonMenu>
              )}
            </Link>
            )
          ))}
        </Toolbar>
      </HideOnScroll>
    </>
  );
}

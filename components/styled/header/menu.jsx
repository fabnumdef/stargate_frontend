import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
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

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'fixed',
    top: '61px',
    right: '0px',
  },
  grow: {
    flexGrow: 1,
  },
}));

export default function MenuItems() {
  const { activeRole } = useLogin();
  const menu = getMenus();
  const classes = useStyles();
  const router = useRouter();

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
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
    </>
  );
}

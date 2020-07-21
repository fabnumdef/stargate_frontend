import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { urlAuthorization } from '../../../utils/permissions';
import { useLogin } from '../../../lib/loginContext';

function getMenus(router, setDisplay, display) {
  return [
    { label: 'Mes Demandes', permission: '/', action: () => router.push('/') },
    { label: 'Nouvelle Demande', permission: '/nouvelle-demande', action: () => router.push('/') },
    { label: 'Administration', permission: '/administration', action: () => setDisplay(!display) },
    { label: 'A propos', permission: '/no-route', action: () => router.push('/') },
    { label: 'Contactez Nous', permission: '/no-route', action: () => router.push('/') },
  ];
}

function getAdminMenu(router) {
  return [
    { label: 'Utilisateurs', permission: '/administration/utilisateurs', action: () => router.push('/administration/utilisateurs') },
    { label: 'Unités', permission: '/administration/unites', action: () => router.push('/administration/unites') },
  ];
}

const ButtonMenu = withStyles(() => ({
  root: {
    textTransform: 'none',
    borderRadius: '0px',
    position: 'relative',
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
  subButtons: {
    position: 'absolute',
    top: '42px',
    width: '100%',
    '& button': {
      width: '100%',
    },
  },
}));

export default function MenuItems() {
  const { activeRole } = useLogin();
  const router = useRouter();
  const [display, setDisplay] = React.useState(false);

  const menu = getMenus(router, setDisplay, display);
  const classes = useStyles();

  return (
    <>
      <Toolbar className={classes.appBar}>
        <div className={classes.grow} />
        {menu.map(({ permission, action, label }) => (
          urlAuthorization(permission, activeRole.role) && (
            <>
              {router.pathname.includes(permission) ? (
                <ButtonMenu size="small" variant="contained" color="secondary" onClick={action}>
                  {label}
                  {display && label === 'Administration' && (
                    <div className={classes.subButtons}>
                      {getAdminMenu(router).map((subMenu) => (
                        urlAuthorization(subMenu.permission, activeRole.role)
                          && router.pathname.includes(subMenu.permission) ? (
                            <ButtonMenu size="small" variant="contained" color="secondary" onClick={subMenu.action}>
                              {subMenu.label}
                            </ButtonMenu>
                          ) : (
                            <ButtonMenu size="small" variant="contained" color="primary" onClick={subMenu.action}>
                              {subMenu.label}
                            </ButtonMenu>
                          )
                      ))}
                    </div>
                  )}
                </ButtonMenu>
              ) : (
                <ButtonMenu size="small" variant="contained" color="primary">
                  {label}
                </ButtonMenu>
              )}
            </>
          )
        ))}
      </Toolbar>
    </>
  );
}

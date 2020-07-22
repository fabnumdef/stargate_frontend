import React from 'react';
import { useRouter } from 'next/router';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { urlAuthorization } from '../../../utils/permissions';
import { useLogin } from '../../../lib/loginContext';

function getMenus(router, setSubMenuAdmin, subMenuAdmin) {
  return [
    { label: 'Mes Demandes', permission: '/', action: () => router.push('/') },
    { label: 'Nouvelle Demande', permission: '/nouvelle-demande', action: () => router.push('/nouvelle-demande') },
    { label: 'Administration', permission: '/administration', action: () => setSubMenuAdmin(!subMenuAdmin) },
    { label: 'A propos', permission: '/no-route', action: () => router.push('/no-route') },
    { label: 'Contactez Nous', permission: '/no-route', action: () => router.push('/no-route') },
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
  const [subMenuAdmin, setSubMenuAdmin] = React.useState(false);

  const menu = getMenus(router, setSubMenuAdmin, subMenuAdmin);
  const classes = useStyles();

  const checkActiveButton = (permission) => (router.pathname === permission) || (router.pathname.includes(permission) && permission !== '/');

  return (
    <>
      <Toolbar className={classes.appBar}>
        <div className={classes.grow} />
        {menu.map(({ permission, action, label }) => (
          urlAuthorization(permission, activeRole.role) && (
            <>
              <ButtonMenu size="small" variant="contained" color={checkActiveButton(permission) ? 'secondary' : 'primary'} onClick={action}>
                {label}
                {subMenuAdmin && label === 'Administration' && (
                <div className={classes.subButtons}>
                  {getAdminMenu(router).map((subMenu) => (
                    urlAuthorization(subMenu.permission, activeRole.role) && (
                    <ButtonMenu size="small" variant="contained" color={router.pathname.includes(subMenu.permission) ? 'secondary' : 'primary'} onClick={subMenu.action}>
                      {subMenu.label}
                    </ButtonMenu>
                    )
                  ))}
                </div>
                )}
              </ButtonMenu>
            </>
          )
        ))}
      </Toolbar>
    </>
  );
}

import React from 'react';
import { useRouter } from 'next/router';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { gql, useApolloClient } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { urlAuthorization } from '../../../utils/permissions';
import { useLogin } from '../../../lib/loginContext';

function getMenus(router, setSubMenuAdmin, subMenuAdmin) {
  return [
    { label: 'Mes Traitements', permission: '/', action: () => router.push('/') },
    { label: 'Mes Demandes', permission: '/mes-demandes', action: () => router.push('/mes-demandes') },
    { label: 'Administration', permission: '/administration', action: () => setSubMenuAdmin(!subMenuAdmin) },
  ];
}

function getAdminMenu(router, campusId) {
  return [
    { label: 'Utilisateurs', permission: '/administration/utilisateurs', action: () => router.push('/administration/utilisateurs') },
    { label: 'Unités', permission: '/administration/unites', action: () => router.push('/administration/unites') },
    { label: 'Base', permission: '/administration/base', action: () => router.push(`/administration/base/${campusId}`) },
  ];
}

const ButtonMenu = withStyles(() => ({
  root: {
    width: '140px',
    height: '35px',
    textTransform: 'none',
    borderRadius: '0px',
    position: 'relative',
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'fixed',
    top: '71px',
    right: '0',
  },
  grow: {
    flexGrow: 1,
  },
  menuList: {
    width: '140px',
    height: '35px',
    color: '#fff',
    justifyContent: 'center',
    display: 'flex',

  },
  primaryColor: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'rgb(10, 45, 103)',
    },
  },
  secondaryColor: {
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: 'rgb(115, 19, 90)',
    },
  },

  subButtons: {
    position: 'absolute',
    top: '33px',
    width: '100%',
    '& button': {
      width: '100%',
    },
  },
}));

export default function MenuItems() {
  const { activeRole } = useLogin();
  const router = useRouter();
  const client = useApolloClient();
  const [subMenuAdmin, setSubMenuAdmin] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const adminClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const adminClose = () => {
    setAnchorEl(null);
  };

  const menu = getMenus(router, setSubMenuAdmin, subMenuAdmin);
  const campus = client.readQuery({
    query: gql`
      query getCampusId {
          campusId
      }
    `,
  });
  const classes = useStyles();

  const checkActiveButton = (permission) => (router.pathname === permission) || (router.pathname.includes(permission) && permission !== '/');

  return (
    <>
      <Toolbar className={`${classes.appBar} mui-fixed`}>
        <div className={classes.grow} />
        {menu.map(({ permission, action, label }) => (
          urlAuthorization(permission, activeRole.role) && (
            <Grid key={label}>
              <ButtonMenu size="small" variant="contained" aria-haspopup="true" color={checkActiveButton(permission) ? 'secondary' : 'primary'} onClick={label === 'Administration' ? adminClick : action}>
                {label}
              </ButtonMenu>
              {label === 'Administration'
              && (
              <Menu
                MenuListProps={{ disablePadding: true }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                elevation={0}
                getContentAnchorEl={null}
                id="adminMenu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={adminClose}
              >
                {campus && getAdminMenu(router, campus.campusId).map((subMenu) => (
                  urlAuthorization(subMenu.permission, activeRole.role) && (
                  <MenuItem key={subMenu.label} className={`${classes.menuList} ${router.pathname.includes(subMenu.permission) ? classes.secondaryColor : classes.primaryColor}`} onClick={subMenu.action}>
                    {subMenu.label}
                  </MenuItem>
                  )
                ))}
              </Menu>
              )}

            </Grid>
          )
        ))}
      </Toolbar>
    </>
  );
}

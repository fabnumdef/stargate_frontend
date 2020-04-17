import React from 'react';

// Import Material
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BuildIcon from '@material-ui/icons/Build';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LinkOffOutlinedIcon from '@material-ui/icons/LinkOffOutlined';
import { useLogin } from '../../../lib/loginContext';
import Avatar from './icon';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    // Props add manually, and by withStyles, needed by Material-UI
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default function MenuIcon() {
  const classes = useStyles();
  const { signOut } = useLogin();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <Box fontWeight="fontWeightLight" display="flex" flexDirection="column">
        <span>MP Durand Henri</span>
        <span>Correspondant unité</span>
      </Box>
      <IconButton size="small" onClick={handleOpenMenu}>
        <Avatar />
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <StyledMenuItem>
          <ListItemIcon>
            <AccountCircleIcon fontSize="default" />
          </ListItemIcon>
          <ListItemText title="myAccount" primary="Mon compte" />
        </StyledMenuItem>

        <StyledMenuItem>
          <ListItemIcon>
            <BuildIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Paramétrer" />
        </StyledMenuItem>

        <StyledMenuItem onClick={() => signOut('Vous avez bien été déconnecté')}>
          <ListItemIcon>
            <LinkOffOutlinedIcon fontSize="default" />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}

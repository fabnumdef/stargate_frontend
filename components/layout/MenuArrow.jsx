import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BuildIcon from '@material-ui/icons/Build';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import { useLogin } from '../../lib/loginContext';
import Divider from '@material-ui/core/Divider';

export const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5'
    }
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
        }}
        // Props add manually, and by withStyles, needed by Material-UI
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
    />
));

const useStyles = makeStyles(() => ({
    iconButtonStyle: {
        marginTop: 8
    }
}));

export default function MenuArrow() {
    const classes = useStyles();
    const { signOut } = useLogin();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleSignOut = () => {
        signOut({ message: 'Vous avez bien été déconnecté', severity: 'success' });
    };

    return (
        <>
            <IconButton
                className={classes.iconButtonStyle}
                aria-label="settings"
                onClick={handleOpenMenu}>
                <ExpandMoreIcon />
            </IconButton>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}>
                <MenuItem>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="default" />
                    </ListItemIcon>
                    <ListItemText title="myAccount" primary="Mon compte" />
                </MenuItem>
                <Divider variant="middle" />
                <MenuItem>
                    <ListItemIcon>
                        <BuildIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Paramétrer" />
                </MenuItem>
                <Divider variant="middle" />
                <MenuItem onClick={() => handleSignOut()}>
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="default" />
                    </ListItemIcon>
                    <ListItemText primary="Déconnexion" />
                </MenuItem>
            </StyledMenu>
        </>
    );
}

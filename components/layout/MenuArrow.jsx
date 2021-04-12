import React, { useState } from 'react';
import { useRouter } from 'next/router';
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

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.primary.main
            }
        }
    }
}))(MenuItem);

const useStyles = makeStyles(() => ({
    iconButtonStyle: {
        margin: '14px 4px 0 4px'
    }
}));

export default function MenuArrow() {
    const classes = useStyles();
    const router = useRouter();
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

    const handlePush = (to) => {
        router.push(to);
        handleCloseMenu();
    };

    return (
        <>
            <div className={classes.iconButtonStyle}>
                <IconButton aria-label="settings" size="small" onClick={handleOpenMenu}>
                    <ExpandMoreIcon />
                </IconButton>
            </div>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}>
                <StyledMenuItem onClick={() => handlePush('/compte')}>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="default" />
                    </ListItemIcon>
                    <ListItemText title="myAccount" primary="Mon compte" />
                </StyledMenuItem>
                <Divider variant="middle" />
                <StyledMenuItem>
                    <ListItemIcon>
                        <BuildIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Paramétrer" />
                </StyledMenuItem>
                <Divider variant="middle" />
                <StyledMenuItem onClick={() => handleSignOut()}>
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="default" />
                    </ListItemIcon>
                    <ListItemText primary="Déconnexion" />
                </StyledMenuItem>
            </StyledMenu>
        </>
    );
}

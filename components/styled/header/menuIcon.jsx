import React, { useState } from 'react';
import { useRouter } from 'next/router';

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
import { gql, useApolloClient, useQuery } from '@apollo/client';
import { Select } from '@material-ui/core';
import { useLogin } from '../../../lib/loginContext';
import Avatar from './icon';
import { ROLES } from '../../../utils/constants/enums/index';

const GET_ME = gql`
    query getMe {
        me {
            id
            firstname
            lastname
            roles {
                role
                units {
                    id
                    label
                }
                campuses {
                    id
                }
            }
        }
    }
`;

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5'
    }
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
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
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white
            }
        }
    }
}))(MenuItem);

const useStyles = makeStyles(() => ({
    root: {
        margin: '10px 0 10px 0',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'right'
    },
    iconButton: {
        margin: '0 0 0 10px'
    }
}));

export default function MenuIcon() {
    const classes = useStyles();
    const router = useRouter();
    const { signOut, setActiveRole, activeRole } = useLogin();
    const client = useApolloClient();
    const { data } = useQuery(GET_ME, { fetchPolicy: 'cache-only' });

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

    const handleChangeRole = (evt) => {
        if (data) {
            const selectedRole = data.me.roles.find((role) => role.role === evt.target.value);
            const newRole = {
                role: selectedRole.role,
                unit: selectedRole.units[0] ? selectedRole.units[0].id : null,
                unitLabel: selectedRole.units[0] ? selectedRole.units[0].label : null
            };

            client.writeQuery({
                query: gql`
                    query setRoleUser {
                        activeRoleCache
                        campusId
                    }
                `,
                data: {
                    activeRoleCache: { ...newRole },
                    campusId: selectedRole.campuses[0] ? selectedRole.campuses[0].id : null
                }
            });
            localStorage.setItem(
                'activeRoleNumber',
                data.me.roles.findIndex((role) => role.role === evt.target.value)
            );
            setActiveRole(newRole);
            handleCloseMenu();
        }
    };

    return (
        <div className={classes.root}>
            <Box fontWeight="fontWeightLight" display="flex" flexDirection="column">
                <span>{data && `${data.me.firstname} ${data.me.lastname}`}</span>
                {data && data.me.roles && data.me.roles.length > 1 ? (
                    <Select
                        labelId="select-role"
                        id="role"
                        value={activeRole.role}
                        onChange={(evt) => handleChangeRole(evt)}>
                        {data.me.roles.map((role) => (
                            <MenuItem key={role.role} value={role.role}>
                                {ROLES[role.role].label}
                            </MenuItem>
                        ))}
                    </Select>
                ) : (
                    data && ROLES[data.me.roles[0].role].label
                )}

                <span>{activeRole.unitLabel ? activeRole.unitLabel : ''}</span>
            </Box>
            <IconButton className={classes.iconButton} size="small" onClick={handleOpenMenu}>
                <Avatar />
            </IconButton>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}>
                <StyledMenuItem onClick={() => router.push('/compte')}>
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

                <StyledMenuItem onClick={() => handleSignOut()}>
                    <ListItemIcon>
                        <LinkOffOutlinedIcon fontSize="default" />
                    </ListItemIcon>
                    <ListItemText primary="Déconnexion" />
                </StyledMenuItem>
            </StyledMenu>
        </div>
    );
}

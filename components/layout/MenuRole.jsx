import React, { useState } from 'react';

import PropTypes from 'prop-types';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import { makeStyles } from '@material-ui/core/styles';
import CheckBox from '@material-ui/icons/CheckBox';
import IconButton from '@material-ui/core/IconButton';
import { StyledMenu } from './MenuArrow';
import Person from '@material-ui/icons/Person';
import { activeRoleCacheVar, campusIdVar } from '../../lib/apollo/cache';
import { ROLES } from '../../utils/constants/enums/index';

const useStyles = makeStyles(() => ({
    iconButtonStyle: {
        margin: '14px 4px 0 4px'
    }
}));

export default function MenuRole({ roles }) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleChangeRole = (chosenRole) => {
        activeRoleCacheVar({
            role: chosenRole.role,
            unit: chosenRole?.units[0]?.id ?? null,
            unitLabel: chosenRole?.units[0]?.label ?? null
        });
        campusIdVar(chosenRole.campuses[0]?.id ?? '');

        handleCloseMenu();
    };

    return (
        <>
            <IconButton
                size="small"
                className={classes.iconButtonStyle}
                aria-label="roles"
                onClick={handleOpenMenu}>
                <Person />
            </IconButton>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}>
                {roles.map((role) => (
                    <MenuItem key={role.role} onClick={() => handleChangeRole(role)}>
                        <ListItemIcon>
                            {activeRoleCacheVar().role === role.role ? (
                                <CheckBox />
                            ) : (
                                <CheckBoxOutlineBlank />
                            )}
                        </ListItemIcon>
                        <ListItemText primary={ROLES[role.role].label} />
                    </MenuItem>
                ))}
            </StyledMenu>
        </>
    );
}

MenuRole.propTypes = {
    roles: PropTypes.array.isRequired
};

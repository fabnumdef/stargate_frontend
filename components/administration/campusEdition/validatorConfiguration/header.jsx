import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ItemCard from '../../../styled/itemCard';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../../../../styles/theme';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '20px 50px',
        borderRadius: 4,
        backgroundColor: theme.palette.background.layout
    }
}));

const itemCardStyle = (currentRole, selectedRole) => {
    let style = {
        cursor: currentRole.editable ? 'pointer' : '',
        justifyContent: 'center',
        opacity: currentRole.editable ? 1 : 0.6
    };
    if (currentRole.role === selectedRole) {
        style = {
            ...style,
            border: `1px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main
        };
    }
    return style;
};

const HeaderConfigurationValidator = ({ validatorsRoles, selectedRole, setSelectedRole }) => {
    const classes = useStyles();
    const handleSelectRole = (role) => {
        return setSelectedRole(role);
    };
    return (
        <Grid container className={classes.root}>
            {validatorsRoles.map((role) => (
                <Grid
                    item
                    key={role.role}
                    onClick={() => role.editable && handleSelectRole(role.role)}>
                    <ItemCard style={itemCardStyle(role, selectedRole)}>
                        <Typography variant="body1">{role.shortLabel}</Typography>
                    </ItemCard>
                </Grid>
            ))}
        </Grid>
    );
};

HeaderConfigurationValidator.propTypes = {
    validatorsRoles: PropTypes.arrayOf({
        role: PropTypes.string.isRequired,
        editable: PropTypes.bool,
        shortLabel: PropTypes.string
    }).isRequired,
    selectedRole: PropTypes.string,
    setSelectedRole: PropTypes.func.isRequired
};

export default HeaderConfigurationValidator;

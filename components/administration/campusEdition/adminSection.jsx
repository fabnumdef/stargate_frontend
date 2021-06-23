import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { GOUV_DOMAIN_MAIL } from '../../../utils/mappers/createUserFromMail';
import { CreateRoleField } from '../../index';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: `20px 10px 23px 50px`,
        backgroundColor: theme.palette.background.layout,
        borderRadius: 4
    }
}));

function AdminSection({ listAdmins, roleData }) {
    const classes = useStyles();
    return (
        <Grid container alignItems="center" className={classes.root}>
            <CreateRoleField
                roleData={roleData}
                usersList={listAdmins}
                mailDomain={GOUV_DOMAIN_MAIL}
                canDelete={listAdmins.length > 1}>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Administrateur(s) fonctionnel(s)
                </Typography>
            </CreateRoleField>
        </Grid>
    );
}

AdminSection.propTypes = {
    listAdmins: PropTypes.array.isRequired,
    roleData: PropTypes.shape({
        role: PropTypes.string,
        campus: PropTypes.objectOf(PropTypes.string)
    })
};

export default AdminSection;

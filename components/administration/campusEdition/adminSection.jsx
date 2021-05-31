import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { GOUV_DOMAIN_MAIL } from '../../../utils/mappers/createUserFromMail';
import { CreateRoleField } from '../../index';

function AdminSection({ listAdmins, roleData }) {
    return (
        <Grid container alignItems="center">
            <CreateRoleField
                roleData={roleData}
                usersList={listAdmins.list}
                mailDomain={GOUV_DOMAIN_MAIL}>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Administrateur(s) fonctionnel(s) ({listAdmins.meta.total})
                </Typography>
            </CreateRoleField>
        </Grid>
    );
}

AdminSection.propTypes = {
    listAdmins: PropTypes.array.isRequired,
    roleData: PropTypes.objectOf({
        role: PropTypes.string,
        campus: PropTypes.objectOf(PropTypes.string).isRequired
    }).isRequired
};

export default AdminSection;

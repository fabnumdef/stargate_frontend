import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { SCREENING_DOMAIN_MAIL } from '../../../../utils/mappers/createUserFromMail';
import { Typography } from '@material-ui/core';
import { CreateRoleField } from '../../../index';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        padding: '20px 50px'
    },
    tagSection: {
        marginLeft: 50,
        marginBottom: 30
    },
    tagTitle: {
        marginBottom: 20,
        fontWeight: 'bold'
    }
}));

function ScreeningEdit({ roleData, screeningUsers }) {
    const classes = useStyles();

    return (
        <Grid className={classes.root}>
            <CreateRoleField
                roleData={roleData}
                usersList={screeningUsers}
                mailDomain={SCREENING_DOMAIN_MAIL}>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Responsable(s)
                </Typography>
            </CreateRoleField>
        </Grid>
    );
}

ScreeningEdit.propTypes = {
    roleData: PropTypes.objectOf({
        role: PropTypes.string,
        campus: PropTypes.objectOf(PropTypes.string).isRequired
    }).isRequired,
    screeningUsers: PropTypes.array.isRequired
};

export default ScreeningEdit;

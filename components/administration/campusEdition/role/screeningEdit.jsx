import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import PageTitle from '../../../styled/common/pageTitle';
import { ROLES } from '../../../../utils/constants/enums';
import Button from '@material-ui/core/Button';
import { SCREENING_DOMAIN_MAIL } from '../../../../utils/mappers/createUserFromMail';
import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { ADMIN_CAMPUS_MANAGEMENT } from '../../../../utils/constants/appUrls';
import Paper from '@material-ui/core/Paper';
import { CreateRoleField } from '../../../index';

function ScreeningEdit({ roleData, screeningUsers }) {
    const router = useRouter();

    return (
        <Grid>
            <Grid style={{ marginBottom: 50 }}>
                <PageTitle subtitles={[roleData.campus.label, ROLES[roleData.role].label]}>
                    Base
                </PageTitle>
            </Grid>
            <Paper style={{ padding: 30 }} elevation={2}>
                <CreateRoleField
                    roleData={roleData}
                    usersList={screeningUsers}
                    mailDomain={SCREENING_DOMAIN_MAIL}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Responsable(s)
                    </Typography>
                </CreateRoleField>
                <Grid container justify="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push(ADMIN_CAMPUS_MANAGEMENT(roleData.campus.id))}>
                        Retour
                    </Button>
                </Grid>
            </Paper>
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

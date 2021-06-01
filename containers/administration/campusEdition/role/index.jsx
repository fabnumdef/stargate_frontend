import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PageTitle from '../../../../components/styled/common/pageTitle';
import { HeaderConfigurationValidator } from '../../../../components/index';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { ROLES } from '../../../../utils/constants/enums';
import AccOffEditContainer from './AccOffEditContainer';
import ScreeningEditContainer from './screeningEditContainer';
import { GET_CAMPUS } from '../../../../lib/apollo/queries';
import { useQuery } from '@apollo/client';

const subtitles = ['Configuration validateurs'];

const useStyles = makeStyles({
    backButton: {
        padding: 0,
        marginBottom: 15,
        fontWeight: 'bold',
        cursor: 'pointer'
    }
});

const selectRoleComponent = (role, campus) => {
    switch (role) {
        case ROLES.ROLE_ACCESS_OFFICE.role:
            return <AccOffEditContainer role={role} campus={campus} />;
        case ROLES.ROLE_SCREENING.role:
            return <ScreeningEditContainer role={role} campus={campus} />;
        default:
            return <div />;
    }
};

const ValidatorConfiguration = ({ campusId }) => {
    const router = useRouter();
    const classes = useStyles();
    const { data } = useQuery(GET_CAMPUS, { variables: { id: campusId } });
    const validatorsRoles = Object.values(ROLES).filter((r) => r.workflow);
    const [selectedRole, setSelectedRole] = useState(
        validatorsRoles.find((r) => r.editable).role || null
    );

    return (
        <Grid>
            <Button onClick={() => router.back()} className={classes.backButton}>
                <KeyboardBackspaceIcon />
                Retour administration de base
            </Button>
            <PageTitle subtitles={subtitles}>Administration</PageTitle>
            <Paper>
                <HeaderConfigurationValidator
                    validatorsRoles={validatorsRoles}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                />
                {data && selectRoleComponent(selectedRole, data.getCampus)}
            </Paper>
        </Grid>
    );
};

ValidatorConfiguration.propTypes = {
    campusId: PropTypes.string.isRequired
};

export default ValidatorConfiguration;

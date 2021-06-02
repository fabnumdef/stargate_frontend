import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PageTitle from '../../../../components/styled/common/pageTitle';
import { HeaderConfigurationValidator } from '../../../../components/index';
import { ROLES } from '../../../../utils/constants/enums';
import AccOffEditContainer from './AccOffEditContainer';
import ScreeningEditContainer from './screeningEditContainer';
import { GET_CAMPUS } from '../../../../lib/apollo/queries';
import { useQuery } from '@apollo/client';
import HeaderPageBackBtn from '../../../../components/styled/headerPageBackBtn';

const subtitles = ['Configuration validateurs'];

const selectRoleComponent = (role, campus) => {
    const campusData = { id: campus.id, label: campus.label };
    switch (role) {
        case ROLES.ROLE_ACCESS_OFFICE.role:
            return <AccOffEditContainer role={role} campus={campusData} />;
        case ROLES.ROLE_SCREENING.role:
            return <ScreeningEditContainer role={role} campus={campusData} />;
        default:
            return <div />;
    }
};

const ValidatorConfiguration = ({ campusId }) => {
    const { data } = useQuery(GET_CAMPUS, { variables: { id: campusId } });
    const validatorsRoles = Object.values(ROLES).filter((r) => r.workflow);
    const [selectedRole, setSelectedRole] = useState(
        validatorsRoles.find((r) => r.editable).role || null
    );

    return (
        <Grid>
            <HeaderPageBackBtn>Retour administration de base</HeaderPageBackBtn>
            <PageTitle subtitles={subtitles}>Administration bases</PageTitle>
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

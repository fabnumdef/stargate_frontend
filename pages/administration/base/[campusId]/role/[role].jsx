import React from 'react';
import { AccOffEditContainer, ScreeningEditContainer } from '../../../../../containers';
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import { ROLES } from '../../../../../utils/constants/enums';
import { GET_CAMPUS } from '../../../../../lib/apollo/queries';
import { useQuery } from '@apollo/client';

function RoleEditionPage() {
    const router = useRouter();
    const { campusId, role } = router.query;

    if (!campusId || !role) {
        return '';
    }

    const { data } = useQuery(GET_CAMPUS, { variables: { id: campusId } });

    const selectRoleComponent = () => {
        const { id, label } = data.getCampus;
        switch (role) {
            case ROLES.ROLE_ACCESS_OFFICE.role:
                return <AccOffEditContainer campus={{ id, label }} role={role} />;
            case ROLES.ROLE_SCREENING.role:
                return <ScreeningEditContainer campus={{ id, label }} role={role} />;
            default:
                return '';
        }
    };

    return <Grid>{data && selectRoleComponent()}</Grid>;
}

export default RoleEditionPage;

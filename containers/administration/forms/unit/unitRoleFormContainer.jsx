import React from 'react';
import PropTypes from 'prop-types';
import { UnitRoleForm } from '../../../../components';
import LoadingCircle from '../../../../components/styled/animations/loadingCircle';
import { useQuery } from '@apollo/client';
import { LIST_USERS } from '../../../../lib/apollo/queries';
import { ROLES } from '../../../../utils/constants/enums';

const UnitRoleFormContainer = ({ unit, campus }) => {
    const { data: unitCorrespondantData } = useQuery(LIST_USERS, {
        variables: {
            campus: campus.id,
            cursor: { offset: 0, first: 10 },
            hasRole: { role: ROLES.ROLE_UNIT_CORRESPONDENT.role, unit: unit.id }
        }
    });
    const { data: securityOfficerData } = useQuery(LIST_USERS, {
        variables: {
            campus: campus.id,
            cursor: { offset: 0, first: 10 },
            hasRole: { role: ROLES.ROLE_SECURITY_OFFICER.role, unit: unit.id }
        }
    });

    if (!unitCorrespondantData || !securityOfficerData) return <LoadingCircle />;

    return (
        <UnitRoleForm
            unit={unit}
            campus={campus}
            unitCorrespondantList={unitCorrespondantData.listUsers.list}
            securityOfficerList={securityOfficerData.listUsers.list}
        />
    );
};

UnitRoleFormContainer.propTypes = {
    unit: PropTypes.object.isRequired,
    campus: PropTypes.object.isRequired
};

export default UnitRoleFormContainer;

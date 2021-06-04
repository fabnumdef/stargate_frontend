import React from 'react';
import PropTypes from 'prop-types';
import { UnitRoleForm } from '../../../../components';

const UnitRoleFormContainer = ({ unit, campus }) => {
    return (
        <UnitRoleForm
            unit={unit}
            campus={campus}
            unitCorrespondandList={[]}
            securityOfficerList={[]}
        />
    );
};

UnitRoleFormContainer.propTypes = {
    unit: PropTypes.object.isRequired,
    campus: PropTypes.object.isRequired
};

export default UnitRoleFormContainer;

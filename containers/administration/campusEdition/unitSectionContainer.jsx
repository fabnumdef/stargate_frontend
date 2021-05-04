import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { UnitSection } from '../../../components';
import { GET_UNITS_LIST } from '../../../lib/apollo/queries';

function UnitSectionContainer({ campusId }) {
    const { data, loading } = useQuery(GET_UNITS_LIST, { variables: { campusId } });
    return (
        !loading && data && <UnitSection listUnits={data.getCampus.listUnits} campusId={campusId} />
    );
}

UnitSectionContainer.propTypes = {
    campusId: PropTypes.string.isRequired
};

export default UnitSectionContainer;

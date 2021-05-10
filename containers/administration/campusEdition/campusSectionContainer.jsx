import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { CampusSection } from '../../../components';
import { GET_CAMPUS } from '../../../lib/apollo/queries';

function CampusSectionContainer({ id }) {
    const { data, loading } = useQuery(GET_CAMPUS, { variables: { id } });
    return !loading && data && <CampusSection campusData={data.getCampus} />;
}

CampusSectionContainer.propTypes = {
    id: PropTypes.string.isRequired
};

export default CampusSectionContainer;

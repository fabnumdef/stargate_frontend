import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { PlaceSection } from '../../../components';
import { GET_PLACES_LIST } from '../../../lib/apollo/queries';

function PlaceSectionContainer({ campusId }) {
    const { data, loading } = useQuery(GET_PLACES_LIST, { variables: { campusId } });
    return (
        !loading &&
        data && <PlaceSection listPlaces={data.getCampus.listPlaces} campusId={campusId} />
    );
}

PlaceSectionContainer.propTypes = {
    campusId: PropTypes.string.isRequired
};

export default PlaceSectionContainer;

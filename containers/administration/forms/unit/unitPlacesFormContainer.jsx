import React from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation, useQuery } from '@apollo/client';
import { UnitPlacesForm } from '../../../../components';
import LoadingCircle from '../../../../components/styled/animations/loadingCircle';
import { GET_PLACES_LIST } from '../../../../lib/apollo/queries';

const GET_UNIT_PLACES = gql`
    query ListPlacesQuery($campusId: String!, $hasUnit: HasUnitFilter) {
        getCampus(id: $campusId) {
            listPlaces(hasUnit: $hasUnit) {
                list {
                    id
                    label
                }
            }
        }
    }
`;

const EDIT_PLACE = gql`
    mutation editPlace($campusId: String!, $id: ObjectID!, $place: PlaceInput!) {
        mutateCampus(id: $campusId) {
            editPlace(id: $id, place: $place) {
                id
                label
                unitInCharge {
                    id
                    label
                }
            }
        }
    }
`;

const UnitPlacesFormContainer = ({ campus, unit }) => {
    const { data: unitPlacesListRes } = useQuery(GET_UNIT_PLACES, {
        variables: { campusId: campus.id, hasUnit: { id: unit.id } }
    });
    const { data: placesListRes } = useQuery(GET_PLACES_LIST, {
        variables: { campusId: campus.id, filters: { unitInCharge: { id: null } } }
    });
    const [editPlaceReq] = useMutation(EDIT_PLACE);

    const updatePlaces = (formData) => {
        editPlaceReq({ variables: { campusId: campus.id, places: formData } });
    };

    if (!unitPlacesListRes || !placesListRes) return <LoadingCircle />;

    return (
        <UnitPlacesForm
            updatePlaces={updatePlaces}
            unitPlacesList={unitPlacesListRes.getCampus.listPlaces.list}
            placesList={placesListRes.getCampus.listPlaces.list}
        />
    );
};

UnitPlacesFormContainer.propTypes = {
    campus: PropTypes.object.isRequired,
    unit: PropTypes.object.isRequired
};

export default UnitPlacesFormContainer;

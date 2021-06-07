import React from 'react';
import PropTypes from 'prop-types';
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
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
    const { cache } = useApolloClient();
    const { data: unitPlacesListRes } = useQuery(GET_UNIT_PLACES, {
        variables: { campusId: campus.id, hasUnit: { id: unit.id } }
    });
    const { data: placesListRes } = useQuery(GET_PLACES_LIST, {
        variables: { campusId: campus.id, filters: { unitInCharge: null } }
    });
    const [editPlaceReq, { loading }] = useMutation(EDIT_PLACE);

    const updatePlaces = async (formData) => {
        console.log(formData);
        const placesToAdd = formData.places.filter(
            (newPlace) =>
                !unitPlacesListRes.getCampus.listPlaces.list.find(
                    (actualPlace) => actualPlace.id === newPlace.id
                )
        );
        const placesToRemove = unitPlacesListRes.getCampus.listPlaces.list.filter(
            (actualPlace) => !formData.places.find((newPlace) => newPlace.id === actualPlace.id)
        );

        try {
            await Promise.all(
                placesToAdd.map((p) =>
                    editPlaceReq({
                        variables: {
                            campusId: campus.id,
                            id: p.id,
                            place: { unitInCharge: { id: unit.id, label: unit.label } }
                        }
                    })
                )
            );
            await Promise.all(
                placesToRemove.map((p) =>
                    editPlaceReq({
                        variables: { campusId: campus.id, id: p.id, place: { unitInCharge: null } }
                    })
                )
            );

            return cache.writeQuery({
                query: GET_UNIT_PLACES,
                variables: { campusId: campus.id, hasUnit: { id: unit.id } },
                data: {
                    getCampus: {
                        listPlaces: {
                            list: formData.places
                        }
                    }
                }
            });
        } catch (e) {
            console.log(e);
        }
    };

    if (!unitPlacesListRes || !placesListRes) return <LoadingCircle />;

    return (
        <UnitPlacesForm
            updatePlaces={updatePlaces}
            unitPlacesList={unitPlacesListRes.getCampus.listPlaces.list}
            placesList={placesListRes.getCampus.listPlaces.list}
            loadValidateForm={loading}
        />
    );
};

UnitPlacesFormContainer.propTypes = {
    campus: PropTypes.object.isRequired,
    unit: PropTypes.object.isRequired
};

export default UnitPlacesFormContainer;

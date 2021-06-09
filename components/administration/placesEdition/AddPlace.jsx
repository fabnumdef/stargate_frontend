import React, { useRef } from 'react';

import PropTypes from 'prop-types';

import { Button, TextField } from '@material-ui/core';
import { gql, useMutation } from '@apollo/client';

import { GET_PLACES_LIST } from '../../../lib/apollo/fragments';

export const CREATE_PLACE = gql`
    mutation createPlace($campusId: String!, $place: PlaceInput!) {
        mutateCampus(id: $campusId) {
            createPlace(place: $place) {
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

export default function AddPlace({ campusId }) {
    const labelInput = useRef(null);
    const [createPlace] = useMutation(CREATE_PLACE);

    // Create method
    const handleCreatePlace = () => {
        createPlace({
            variables: {
                campusId,
                place: { label: labelInput.current.value }
            },
            update: (cache, { data: { mutateCampus: createPlace } }) => {
                const campus = cache.readFragment({
                    id: `Campus:${campusId}`,
                    fragment: GET_PLACES_LIST,
                    fragmentName: 'getPlacesList'
                });

                const updateList = {
                    ...campus,
                    listPlaces: {
                        ...campus.listPlaces,
                        list: [...campus.listPlaces.list, createPlace],
                        meta: campus.listPlaces.meta + 1
                    }
                };

                cache.writeFragment({
                    id: `Campus:${campusId}`,
                    fragment: GET_PLACES_LIST,
                    fragmentName: 'getPlacesList',
                    data: updateList
                });
            }
        });
    };

    return (
        <div>
            <TextField
                label="Nouveau lieu"
                variant="outlined"
                inputRef={labelInput}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') handleCreatePlace();
                }}
            />
            <Button variant="outlined" color="primary" onClick={handleCreatePlace}>
                Ajouter
            </Button>
        </div>
    );
}

AddPlace.propTypes = {
    campusId: PropTypes.string.isRequired
};

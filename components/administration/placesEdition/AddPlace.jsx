import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { Button, TextField } from '@material-ui/core';
import { gql, useMutation } from '@apollo/client';

import { GET_PLACES_LIST } from '../../../lib/apollo/fragments';
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles(() => ({
    addButton: {
        width: 109,
        height: 50,
        marginTop: 5,
        padding: '10px 27px 10px 26px',
        borderRadius: 25
    }
}));

export default function AddPlace({ campusId }) {
    const [placeValue, setPlaceValue] = useState('');
    const classes = useStyles();
    const [createPlace] = useMutation(CREATE_PLACE);

    // Create method
    const handleCreatePlace = () => {
        createPlace({
            variables: {
                campusId,
                place: { label: placeValue }
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
                setPlaceValue('');
            }
        });
    };

    return (
        <div>
            <TextField
                label="Nouveau lieu"
                variant="outlined"
                value={placeValue}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') handleCreatePlace();
                }}
                onChange={(event) => setPlaceValue(event.target.value)}
            />
            <Button
                variant="outlined"
                color="primary"
                className={classes.addButton}
                onClick={handleCreatePlace}>
                Ajouter
            </Button>
        </div>
    );
}

AddPlace.propTypes = {
    campusId: PropTypes.string.isRequired
};

import React, { useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';

import PropTypes from 'prop-types';

import { GET_PLACES_LIST } from '../../../lib/apollo/queries';
import { GET_PLACES_LIST as FRAGMENT_GET_PLACES_LIST } from '../../../lib/apollo/fragments';
import {
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    TextField,
    IconButton
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';

export const EDIT_PLACE = gql`
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

export const DELETE_PLACE = gql`
    mutation deletePlace($campusId: String!, $id: ObjectID!) {
        mutateCampus(id: $campusId) {
            deletePlace(id: $id) {
                id
            }
        }
    }
`;

export default function ListPlaces({ campusId }) {
    const { data, loading } = useQuery(GET_PLACES_LIST, {
        variables: { campusId },
        skip: !campusId
    });

    const [editId, setEditId] = useState(null);
    const [delId, setDelId] = useState(null);

    const [editValue, setEditValue] = useState('');

    const [editPlace] = useMutation(EDIT_PLACE);
    const [deletePlace] = useMutation(DELETE_PLACE);

    const handleEditPlace = () => {
        editPlace({
            variables: {
                campusId,
                id: editId,
                place: { label: editValue }
            }
        });
    };

    const handleDeletePlace = () => {
        deletePlace({
            variables: {
                campusId,
                id: delId
            },
            update: (cache, { data: { mutateCampus: deletePlace } }) => {
                const campus = cache.readFragment({
                    id: `Campus:${campusId}`,
                    fragment: FRAGMENT_GET_PLACES_LIST,
                    fragmentName: 'getPlacesList'
                });

                const newList = campus.listPlaces.list.filter((p) => p.id !== deletePlace.id);

                const updateList = {
                    ...campus,
                    listPlaces: {
                        ...campus.listPlaces,
                        list: newList,
                        meta: campus.listPlaces.meta - 1
                    }
                };

                cache.writeFragment({
                    id: `Campus:${campusId}`,
                    fragment: FRAGMENT_GET_PLACES_LIST,
                    fragmentName: 'getPlacesList',
                    data: updateList
                });
            }
        });
    };

    if (loading || !data) return '';

    return (
        <List>
            {data.getCampus.listPlaces.list.map((place) => (
                <ListItem key={place.id}>
                    {(() => {
                        if (delId === place.id)
                            return (
                                <>
                                    <ListItemText primary={`Supprimer ${place.label} ?`} />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            aria-label="edit"
                                            onClick={() => {
                                                setDelId(null);
                                            }}>
                                            <CancelIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={handleDeletePlace}>
                                            <CheckIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </>
                            );

                        if (editId === place.id)
                            return (
                                <>
                                    <TextField
                                        value={editValue}
                                        onChange={(event) => setEditValue(event.target.value)}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            aria-label="edit"
                                            onClick={() => {
                                                setEditId(null);
                                                setEditValue('');
                                            }}>
                                            <CancelIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => {
                                                handleEditPlace();
                                                setEditId(null);
                                            }}>
                                            <CheckIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </>
                            );

                        return (
                            <>
                                <ListItemText primary={place.label} />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => {
                                            setEditId(place.id);
                                            setEditValue(place.label);
                                        }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => {
                                            setDelId(place.id);
                                        }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </>
                        );
                    })()}
                </ListItem>
            ))}
        </List>
    );
}

ListPlaces.propTypes = {
    campusId: PropTypes.string.isRequired
};

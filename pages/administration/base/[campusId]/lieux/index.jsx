import React, { useState, useRef } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../../../components/styled/common/pageTitle';
import { GET_PLACES_LIST } from '../../../../../lib/apollo/queries';
import { GET_PLACES_LIST as FRAGMENT_GET_PLACES_LIST } from '../../../../../lib/apollo/fragments';
import {
    Button,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    TextField,
    IconButton
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import LinkBack from '../../../../../components/styled/common/Link';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        '& div[role=link]': {
            zIndex: 9000
        },
        '& section > div': {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '10px',
            '& >*:first-child': {
                marginRight: '10px'
            }
        },
        '& ul': {
            maxWidth: '440px',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            '& li button:first-child': {
                marginRight: '4px'
            }
        }
    }
}));

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

function CreatePlace() {
    const classes = useStyles();
    const router = useRouter();

    const { campusId } = router.query;

    const { data, loading } = useQuery(GET_PLACES_LIST, {
        variables: { campusId },
        skip: !campusId
    });

    const labelInput = useRef(null);

    const [editId, setEditId] = useState(null);
    const [delId, setDelId] = useState(null);

    const [editValue, setEditValue] = useState('');

    const [createPlace] = useMutation(CREATE_PLACE);
    const [editPlace] = useMutation(EDIT_PLACE);
    const [deletePlace] = useMutation(DELETE_PLACE);

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
                    fragment: FRAGMENT_GET_PLACES_LIST,
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
                    fragment: FRAGMENT_GET_PLACES_LIST,
                    fragmentName: 'getPlacesList',
                    data: updateList
                });
            }
        });
    };

    const handleEditPlace = () => {
        editPlace({
            variables: {
                campusId,
                id: editId,
                place: { label: editValue }
            },
            optimisticResponse: {
                __typename: 'Mutation',
                mutateCampus: {
                    __typename: 'CampusMutation',
                    editPlace: {
                        __typename: 'Place ',
                        id: editId,
                        label: editValue
                    }
                }
            }
        });
    };

    const handleDeletePlace = () => {
        deletePlace({
            variables: {
                campusId,
                id: delId
            },
            optimisticResponse: {
                __typename: 'Mutation',
                mutateCampus: {
                    __typename: 'CampusMutation',
                    deletePlace: {
                        __typename: 'Place ',
                        delId
                    }
                }
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
        <div className={classes.root}>
            <LinkBack onClick={() => router.back()} />
            <PageTitle subtitles={[data.getCampus.label, 'Lieux']}>Base</PageTitle>
            <section>
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
            </section>
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
        </div>
    );
}

export default CreatePlace;

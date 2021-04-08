import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PageTitle from '../../../components/styled/common/pageTitle';
import BaseForm from '../../../components/administrationForms/baseForm';
import PlaceForm from '../../../components/administrationForms/placeForm';
import { useSnackBar } from '../../../lib/hooks/snackbar';

const useStyles = makeStyles((theme) => ({
    rightBorder: {
        borderColor: theme.palette.primary.main,
        borderRight: '2px solid',
        minHeight: '50vh'
    }
}));

const GET_USERS = gql`
    query listUsers($cursor: OffsetCursor, $hasRole: HasRoleInput) {
        listUsers(cursor: $cursor, hasRole: $hasRole) {
            list {
                id
                firstname
                lastname
                roles {
                    role
                    userInCharge
                    campuses {
                        id
                        label
                    }
                    units {
                        id
                        label
                    }
                }
            }
            meta {
                offset
                first
                total
            }
        }
    }
`;

const GET_PLACES = gql`
    query listPlaces($id: String!) {
        getCampus(id: $id) {
            id
            listPlaces {
                list {
                    id
                    label
                }
            }
        }
    }
`;

const CREATE_PLACE = gql`
    mutation createPlaces($campusId: String!, $place: PlaceInput!) {
        mutateCampus(id: $campusId) {
            createPlace(place: $place) {
                id
                label
            }
        }
    }
`;

const DELETE_PLACE = gql`
    mutation deletePlaces($campusId: String!, $id: ObjectID!) {
        mutateCampus(id: $campusId) {
            deletePlace(id: $id) {
                id
            }
        }
    }
`;

function CampusFormContainer({ onSubmit, defaultValues, setDefaultValues, campusId, type }) {
    const widthBreak = 1030;
    const matches = useMediaQuery(`(min-width:${widthBreak}px)`);
    const { addAlert } = useSnackBar();
    const classes = useStyles();
    const [placesList, setPlacesList] = useState(defaultValues.placesList);
    const [createPlaceReq] = useMutation(CREATE_PLACE, {
        update: (
            cache,
            {
                data: {
                    mutateCampus: { createPlace: createdPlace }
                }
            }
        ) => {
            const currentPlaces = cache.readQuery({
                query: GET_PLACES,
                variables: { id: campusId }
            });
            const updatedPlaces = {
                ...currentPlaces,
                getCampus: {
                    ...currentPlaces.getCampus,
                    listPlaces: {
                        ...currentPlaces.getCampus.listPlaces,
                        list: [...currentPlaces.getCampus.listPlaces.list, createdPlace]
                    }
                }
            };
            cache.writeQuery({
                query: GET_PLACES,
                variables: { id: campusId },
                data: updatedPlaces
            });
            setPlacesList(updatedPlaces);
        }
    });
    const [deletePlaceReq] = useMutation(DELETE_PLACE, {
        update: (
            cache,
            {
                data: {
                    mutateCampus: { deletePlace: deletedPlace }
                }
            }
        ) => {
            const currentPlaces = cache.readQuery({
                query: GET_PLACES,
                variables: { id: campusId }
            });
            const newList = currentPlaces.getCampus.listPlaces.list.filter(
                (place) => place.id !== deletedPlace.id
            );
            const updatedPlaces = {
                ...currentPlaces,
                getCampus: {
                    ...currentPlaces.getCampus,
                    listPlaces: {
                        ...currentPlaces.getCampus.listPlaces,
                        list: newList
                    }
                }
            };
            cache.writeQuery({
                query: GET_PLACES,
                variables: { id: campusId },
                data: updatedPlaces
            });
            setPlacesList(updatedPlaces);
        }
    });

    const { data: usersList, fetchMore } = useQuery(GET_USERS, {
        variables: { cursor: { offset: 0, first: 10 } }
    });

    const createPlace = async (placeName) => {
        try {
            const { data: createdPlace } = await createPlaceReq({
                variables: {
                    campusId,
                    place: { label: placeName }
                }
            });
            return createdPlace;
        } catch {
            return null;
        }
    };

    const deletePlace = async (placeId) => {
        try {
            const { data: deletedPlace } = await deletePlaceReq({
                variables: {
                    campusId,
                    id: placeId
                }
            });
            return deletedPlace;
        } catch {
            return null;
        }
    };

    const submitPlaces = async (places) => {
        try {
            const resPlaces = await Promise.all(
                places.map(async (place) => {
                    if (!place.id && !place.toDelete) {
                        const createdPlace = await createPlace(place.label);
                        return createdPlace.mutateCampus.createPlace;
                    }
                    if (place.id && place.toDelete) {
                        await deletePlace(place.id);
                    }
                    return place;
                })
            );
            return resPlaces;
        } catch {
            return null;
        }
    };

    const submitEditPlaces = async (places) => {
        try {
            await submitPlaces(places);
            return addAlert({
                message: 'La modification a bien été effectuée',
                severity: 'success'
            });
        } catch (e) {
            return addAlert({
                message: 'Erreur serveur, merci de réessayer',
                severity: 'warning'
            });
        }
    };

    return (
        <>
            <PageTitle subtitles={['Base', type === 'edit' ? 'Edition' : 'Création']}>
                Administration
            </PageTitle>
            {defaultValues && usersList && (
                <>
                    <Grid container>
                        <Grid
                            item
                            sm={10}
                            xs={10}
                            md={6}
                            className={`${matches && type === 'edit' ? classes.rightBorder : ''}`}>
                            <BaseForm
                                submitForm={onSubmit}
                                defaultValues={defaultValues}
                                setDefaultValues={setDefaultValues}
                                usersList={usersList}
                                fetchMore={fetchMore}
                                type={type}
                            />
                        </Grid>
                        {type === 'edit' && (
                            <Grid item sm={10} xs={10} md={6}>
                                <PlaceForm submitForm={submitEditPlaces} list={placesList} />
                            </Grid>
                        )}
                    </Grid>
                </>
            )}
        </>
    );
}

CampusFormContainer.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    defaultValues: PropTypes.shape,
    setDefaultValues: PropTypes.func,
    campusId: PropTypes.string,
    type: PropTypes.string.isRequired
};

export default CampusFormContainer;

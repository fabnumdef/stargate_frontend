import React, { useState, useEffect } from 'react';
import {
  gql, useMutation, useQuery,
} from '@apollo/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PageTitle from '../../../components/styled/pageTitle';
import Template from '../../../containers/template';
import BaseForm from '../../../components/administrationForms/baseForm';
import PlaceForm from '../../../components/administrationForms/placeForm';
import { useSnackBar } from '../../../lib/hooks/snackbar';
import { FORMS_LIST, ROLES } from '../../../utils/constants/enums';
import { mapEditCampus } from '../../../utils/mappers/adminMappers';

const useStyles = makeStyles((theme) => ({

  rightBorder: {
    borderColor: theme.palette.primary.main,
    borderRight: '2px solid',
    minHeight: '50vh',
  },

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

const EDIT_USER = gql`
    mutation editUser($id: ObjectID!, $user: UserInput) {
        editUser(id: $id, user: $user) {
          id
        }
    }
`;

const DELETE_ROLE = gql`
    mutation deleteUserRole($id: ObjectID!, $user: UserInput) {
        deleteUserRole(id: $id, user: $user) {
            id
        }
    }
`;

const GET_CAMPUS = gql`
    query getCampus($id: String!) {
        getCampus(id: $id) {
            id
            label
        }
    }
`;

const EDIT_CAMPUS = gql`
    mutation editCampus($campus: CampusInput!, $id: String!) {
        editCampus(campus: $campus, id: $id) {
            id
            label
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

function EditCampus() {
  const widthBreak = 1030;
  const matches = useMediaQuery(`(min-width:${widthBreak}px)`);
  const { addAlert } = useSnackBar();
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  const [editCampus] = useMutation(EDIT_CAMPUS);
  const [editUserReq] = useMutation(EDIT_USER);
  const [deleteUserRoleReq] = useMutation(DELETE_ROLE);
  const [createPlaceReq] = useMutation(CREATE_PLACE,
    {
      update: (cache, { data: { mutateCampus: { createPlace: createdPlace } } }) => {
        const currentPlaces = cache.readQuery({ query: GET_PLACES, variables: { id } });
        const updatedPlaces = {
          ...currentPlaces,
          getCampus: {
            ...currentPlaces.getCampus,
            listPlaces: {
              ...currentPlaces.getCampus.listPlaces,
              list: [...currentPlaces.getCampus.listPlaces.list, createdPlace],
            },
          },
        };
        cache.writeQuery({
          query: GET_PLACES,
          variables: { id },
          data: updatedPlaces,
        });
      },
    });
  const [deletePlaceReq] = useMutation(DELETE_PLACE,
    {
      update: (cache, { data: { mutateCampus: { deletePlace: deletedPlace } } }) => {
        const currentPlaces = cache.readQuery({ query: GET_PLACES, variables: { id } });
        const newList = currentPlaces.getCampus.listPlaces.list.filter(
          (place) => place.id !== deletedPlace.id,
        );
        const updatedPlaces = {
          ...currentPlaces,
          getCampus: {
            ...currentPlaces.getCampus,
            listPlaces: {
              ...currentPlaces.getCampus.listPlaces,
              list: newList,
            },
          },
        };
        cache.writeQuery({
          query: GET_PLACES,
          variables: { id },
          data: updatedPlaces,
        });
      },
    });
  const { data: placesList } = useQuery(GET_PLACES, { variables: { id }, fetchPolicy: 'cache-and-network' });
  const { data: usersList, fetchMore } = useQuery(GET_USERS, {
    variables: { cursor: { offset: 0, first: 10 } },
  });
  const { data: adminsList } = useQuery(GET_USERS, {
    variables: { cursor: { offset: 0, first: 10 }, hasRole: { role: ROLES.ROLE_ADMIN.role } },
  });
  const { data: editCampusData } = useQuery(GET_CAMPUS, { variables: { id }, fetchPolicy: 'cache-and-network' });
  const [defaultValues, setDefaultValues] = useState(null);

  const createPlace = async (placeName) => {
    try {
      const { data: createdPlace } = await createPlaceReq({
        variables: {
          campusId: id,
          place: { label: placeName },
        },
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
          campusId: id,
          id: placeId,
        },
      });
      return deletedPlace;
    } catch {
      return null;
    }
  };

  const editUser = async (user, userInChargeId) => {
    const variables = {
      id: user.id,
      user: {
        roles: {
          role: ROLES.ROLE_ADMIN.role,
          userInCharge: userInChargeId,
          campuses: [{
            id,
            label: editCampusData.getCampus.label,
          }],
        },
      },
    };
    try {
      const { data: userData } = await editUserReq({ variables });
      return userData;
    } catch {
      return null;
    }
  };

  const deleteAssistant = async (assistant) => {
    try {
      const resAssistant = await deleteUserRoleReq({
        variables: {
          id: assistant.id,
          user: {
            roles: {
              role: ROLES.ROLE_ADMIN.role,
            },
          },
        },
      });
      return resAssistant;
    } catch {
      return null;
    }
  };

  const submitEditCampus = async (data, assistantsList) => {
    try {
      if (data.name !== editCampusData.getCampus.label) {
        await editCampus({ variables: { id, campus: { label: data.name } } });
      }

      if (!defaultValues.admin || (defaultValues.admin.id !== data.campusAdmin.id)) {
        if (defaultValues.admin) {
          await deleteAssistant(defaultValues.admin);
        }
        await editUser(data.campusAdmin, data.campusAdmin.id);
      }

      await Promise.all(assistantsList[FORMS_LIST.ADMIN_ASSISTANTS].map(async (assistant) => {
        if (assistant.toDelete) {
          await deleteAssistant(assistant);
          return assistant;
        }
        const haveRole = assistant.roles.find(
          (role) => role.role === ROLES.ROLE_ADMIN.role && role.campuses.find(
            (campus) => campus.id === id,
          ),
        );
        if ((!haveRole || haveRole.userInCharge !== data.campusAdmin.id)) {
          await editUser(assistant, data.campusAdmin.id);
        }
        return assistant;
      }));

      return addAlert({ message: 'La modification a bien été effectuée', severity: 'success' });
    } catch (e) {
      return addAlert({
        message: 'Erreur serveur, merci de réessayer',
        severity: 'warning',
      });
    }
  };

  const submitPlaces = async (places) => {
    try {
      const resPlaces = await Promise.all(places.map(async (place) => {
        if (!place.id && !place.toDelete) {
          const createdPlace = await createPlace(place.label);
          return createdPlace.mutateCampus.createPlace;
        }
        if (place.id && place.toDelete) {
          await deletePlace(place.id);
        }
        return place;
      }));
      return resPlaces;
    } catch {
      return null;
    }
  };

  const submitEditPlaces = async (places) => {
    try {
      await submitPlaces(places);
      return addAlert({ message: 'La modification a bien été effectuée', severity: 'success' });
    } catch (e) {
      return addAlert({
        message: 'Erreur serveur, merci de réessayer',
        severity: 'warning',
      });
    }
  };

  useEffect(() => {
    if (editCampusData && usersList && placesList && adminsList) {
      setDefaultValues(mapEditCampus(
        id,
        editCampusData.getCampus.label,
        placesList,
        adminsList.listUsers.list,
      ));
    }
  }, [editCampusData, usersList, placesList, adminsList]);

  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Base']} />
      {defaultValues
      && (
        <>
          <Grid container>
            <Grid
              item
              sm={10}
              xs={10}
              md={6}
              className={`${matches ? classes.rightBorder : ''}`}
            >
              <BaseForm
                submitForm={submitEditCampus}
                defaultValues={defaultValues}
                usersList={usersList}
                fetchMore={fetchMore}
              />
            </Grid>
            <Grid item sm={10} xs={10} md={6}>
              <PlaceForm
                submitForm={submitEditPlaces}
                list={placesList.getCampus.listPlaces.list}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Template>
  );
}

export default EditCampus;

import React from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import PlaceForm from '../../components/administrationForms/placeForm';
import { useSnackBar } from '../../lib/ui-providers/snackbar';

const GET_PLACES = gql`
    query listPlaces($campusId: String!) {
        getCampus(id: $campusId) {
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
    mutation createPlaces($campusId: String!, $id: String!) {
        mutateCampus(id: $campusId) {
            deletePlace(id: $id) {
                id
            }
        }
    }
`;

const PlaceAdministration = ({ campusId }) => {
  const { addAlert } = useSnackBar();
  const { data } = useQuery(GET_PLACES, { variables: { campusId } });
  const [createPlaceReq] = useMutation(CREATE_PLACE);
  const [deletePlaceReq] = useMutation(DELETE_PLACE);

  const createPlace = async (placeName) => {
    try {
      const { data: createdPlace } = await createPlaceReq({
        variables: {
          campusId,
          place: { label: placeName },
        },
      });
      return createdPlace.mutateCampus.createPlace;
    } catch (e) {
      addAlert({ message: "Une erreur est survenue à l'ajout du lieu", severity: 'error' });
    }
    return null;
  };

  const deletePlace = async (id) => {
    try {
      const { data: deletedPlace } = await deletePlaceReq({
        variables: {
          campusId,
          id,
        },
      });
      return deletedPlace.mutateCampus.deletePlace;
    } catch (e) {
      addAlert({ message: 'Une erreur est survenue à la suppression du lieu', severity: 'error' });
    }
    return null;
  };

  return (
    <PlaceForm
      list={data ? data.getCampus.listPlaces.list : []}
      createPlace={createPlace}
      deletePlace={deletePlace}
    />
  );
};

export default PlaceAdministration;

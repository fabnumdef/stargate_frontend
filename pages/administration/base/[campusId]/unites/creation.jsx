import React from 'react';
import { gql, useMutation, useQuery, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../../../components/styled/common/pageTitle';
import UnitForm from '../../../../../components/administrationForms/unitForm';
import { useSnackBar } from '../../../../../lib/hooks/snackbar';
import { useLogin } from '../../../../../lib/loginContext';
import { ROLES } from '../../../../../utils/constants/enums';
import { FIND_USER_BY_MAIL, GET_CAMPUS } from '../../../../../lib/apollo/queries';
import { ADD_USER_ROLE } from '../../../../../lib/apollo/mutations';

const CREATE_UNIT = gql`
    mutation createUnit($campusId: String!, $unit: UnitInput!) {
        mutateCampus(id: $campusId) {
            createUnit(unit: $unit) {
                id
                label
                trigram
                workflow {
                    steps {
                        role
                        behavior
                    }
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

function CreateUnit() {
    const { addAlert } = useSnackBar();
    const router = useRouter();
    const client = useApolloClient();

    const { campusId } = router.query;
    const { data: campusData } = useQuery(GET_CAMPUS, { variables: { id: campusId } });
    const [createUnit] = useMutation(CREATE_UNIT, {
        variables: { campusId },
        onError: () =>
            addAlert({ message: "Erreur lors de la création de l'unité", severity: 'error' })
    });
    // const [editUserReq] = useMutation(EDIT_USER);
    const [editPlaceReq] = useMutation(EDIT_PLACE, { variables: { campusId } });
    const { activeRole } = useLogin();

    const [addUserRole] = useMutation(ADD_USER_ROLE, {
        onError: () =>
            addAlert({
                message: 'Erreur lors de la supression de role utilisateur',
                severity: 'error'
            })
    });

    const submitCreateUnit = async (formData, unitData) => {
        try {
            const { data: unitResponse } = await createUnit({ variables: { unit: unitData } });
            const unitId = unitResponse.mutateCampus.createUnit.id;

            const { data: findCuData } = await client.query({
                query: FIND_USER_BY_MAIL,
                variables: {
                    email: formData.corresemail
                },
                fetchPolicy: 'no-cache'
            });

            await Promise.all(
                formData.places.map(async (place) => {
                    await editPlaceReq({
                        variables: {
                            id: place.id,
                            place: { unitInCharge: { id: unitId, label: unitData.label } }
                        }
                    });
                })
            );

            addUserRole({
                variables: {
                    id: findCuData.findUser.id,
                    roleData: {
                        role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
                        campus: { id: campusId, label: campusData.label },
                        unit: { id: unitId, label: unitData.label }
                    }
                }
            });

            if (formData.offsecuemail) {
                const { data: findOsData } = await client.query({
                    query: FIND_USER_BY_MAIL,
                    variables: {
                        email: formData.offsecuemail
                    },
                    fetchPolicy: 'no-cache'
                });

                addUserRole({
                    variables: {
                        id: findOsData.findUser.id,
                        roleData: {
                            role: ROLES.ROLE_SECURITY_OFFICER.role,
                            campus: { id: campusId, label: campusData.label },
                            unit: { id: unitId, label: unitData.label }
                        }
                    }
                });
            }
            addAlert({ message: "L'unité a bien été créée", severity: 'success' });
            return router.back();
        } catch (e) {
            return addAlert({ message: 'Une erreur est survenue', severity: 'error' });
        }
    };

    const defaultValues = {
        placesList: [],
        unitOfficer: {},
        unitCorrespondent: {}
    };

    return (
        <>
            <PageTitle subtitles={['Unité', 'Nouvelle unité']}>Administration</PageTitle>
            <UnitForm
                submitForm={submitCreateUnit}
                defaultValues={defaultValues}
                userRole={activeRole}
                type="create"
            />
        </>
    );
}

export default CreateUnit;

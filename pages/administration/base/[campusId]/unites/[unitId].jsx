import React, { useMemo } from 'react';
import { gql, useMutation, useQuery, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../../../components/styled/common/pageTitle';
import UnitForm from '../../../../../components/administrationForms/unitForm';
import { useSnackBar } from '../../../../../lib/hooks/snackbar';
import { ROLES } from '../../../../../utils/constants/enums';
import { mapEditUnit } from '../../../../../utils/mappers/adminMappers';
import { activeRoleCacheVar } from '../../../../../lib/apollo/cache';
import LoadingCircle from '../../../../../components/styled/animations/loadingCircle';
import { FIND_USER_BY_MAIL, GET_CAMPUS } from '../../../../../lib/apollo/queries';
import { DELETE_ROLE, ADD_USER_ROLE } from '../../../../../lib/apollo/mutations';

const GET_UNIT_FORM_DATA = gql`
    query getUnitFormData(
        $cursor: OffsetCursor
        $campusId: String!
        $id: ObjectID!
        $roleUnitCorrespondent: HasRoleInput!
        $roleSecurityOfficer: HasRoleInput!
        $hasUnit: HasUnitFilter
    ) {
        getCampus(id: $campusId) {
            id
            getUnit(id: $id) {
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
            listPlaces(hasUnit: $hasUnit) {
                list {
                    id
                    label
                    unitInCharge {
                        id
                        label
                    }
                }
            }
        }
        unitCorrespondents: listUsers(cursor: $cursor, hasRole: $roleUnitCorrespondent) {
            list {
                id
                firstname
                lastname
                email {
                    original
                }
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
        }
        securityOfficer: listUsers(cursor: $cursor, hasRole: $roleSecurityOfficer) {
            list {
                id
                firstname
                lastname
                email {
                    original
                }
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
        }
    }
`;

const DELETE_UNIT = gql`
    mutation deleteUnit($campusId: String!, $id: ObjectID!) {
        mutateCampus(id: $campusId) {
            deleteUnit(id: $id) {
                id
            }
        }
    }
`;

const EDIT_UNIT = gql`
    mutation editUnit($campusId: String!, $id: ObjectID!, $unit: UnitInput!) {
        mutateCampus(id: $campusId) {
            editUnit(id: $id, unit: $unit) {
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
    const client = useApolloClient();
    const router = useRouter();
    const { unitId: id, campusId } = router.query;
    const { data, loading } = useQuery(GET_UNIT_FORM_DATA, {
        variables: {
            id,
            campusId,
            roleUnitCorrespondent: { role: ROLES.ROLE_UNIT_CORRESPONDENT.role, unit: id },
            roleSecurityOfficer: { role: ROLES.ROLE_SECURITY_OFFICER.role, unit: id },
            hasUnit: { id }
        }
    });

    const defaultValues = useMemo(() => {
        if (!data) return;
        return mapEditUnit(
            data.getCampus.getUnit,
            [...data.unitCorrespondents.list],
            [...data.securityOfficer.list],
            [...data.getCampus.listPlaces.list]
        );
    }, [data]);

    const { data: campusData } = useQuery(GET_CAMPUS, { variables: { id: campusId } });
    const [deleteUnit] = useMutation(DELETE_UNIT, {
        variables: { campusId },
        onError: () =>
            addAlert({ message: 'Erreur lors de la supression unité', severity: 'error' })
    });

    const [editUnit] = useMutation(EDIT_UNIT, {
        variables: { campusId },
        onError: () =>
            addAlert({ message: 'Erreur lors de la modification unité', severity: 'error' })
    });
    const [editPlaceReq] = useMutation(EDIT_PLACE, {
        variables: { campusId },
        onError: () =>
            addAlert({ message: 'Erreur lors de la modification des lieux', severity: 'error' })
    });

    const [deleteUserRoleReq] = useMutation(DELETE_ROLE, {
        onError: () =>
            addAlert({
                message: 'Erreur lors de la supression de role utilisateur',
                severity: 'error'
            })
    });
    const [addUserRole] = useMutation(ADD_USER_ROLE, {
        onError: () =>
            addAlert({
                message: 'Erreur lors de la supression de role utilisateur',
                severity: 'error'
            })
    });
    const deleteRole = (userId, role) => {
        const userRoleDeleted = deleteUserRoleReq({
            variables: {
                id: userId,
                roleData: {
                    role
                }
            }
        });
        return userRoleDeleted;
    };

    const submitEditUnit = async (formData, editUnitData) => {
        try {
            editUnit({ variables: { id, unit: editUnitData } });

            const { data: findCuData } = await client.query({
                query: FIND_USER_BY_MAIL,
                variables: {
                    email: formData.corresemail
                },
                fetchPolicy: 'no-cache'
            });

            // default value null => edit
            // default value of cu !== formData.cu = delete + edit
            // default value of unit name !== formData.name = edit
            if (
                !defaultValues.unitCorrespondent.id ||
                defaultValues.unitCorrespondent.email.original !== formData.corresemail ||
                defaultValues.name !== formData.name
            ) {
                //now if default value of unitCorres is not null => delete it
                if (defaultValues.unitCorrespondent.id) {
                    deleteRole(
                        defaultValues.unitCorrespondent.id,
                        ROLES.ROLE_UNIT_CORRESPONDENT.role,
                        editUnitData.label
                    );
                }
                addUserRole({
                    variables: {
                        id: findCuData.findUser.id,
                        roleData: {
                            role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
                            campus: { id: campusId, label: campusData.label },
                            unit: { id, label: editUnitData.label }
                        }
                    }
                });
            }

            // default value null => edit
            // default value of OS !== formData.OS = delete + edit
            // default value of unit name !== formData.name = edit
            if (
                (!defaultValues.unitOfficer.id && formData.offsecuemail !== '') ||
                defaultValues.unitOfficer.email.original !== formData.offsecuemail ||
                defaultValues.name !== formData.name
            ) {
                const { data: findOsData } = await client.query({
                    query: FIND_USER_BY_MAIL,
                    variables: {
                        email: formData.offsecuemail
                    },
                    fetchPolicy: 'no-cache'
                });

                if (defaultValues.unitOfficer.id) {
                    deleteRole(
                        defaultValues.unitCorrespondent.id,
                        ROLES.ROLE_SECURITY_OFFICER.role,
                        editUnitData.label
                    );
                }
                addUserRole({
                    variables: {
                        id: findOsData.findUser.id,
                        roleData: {
                            role: ROLES.ROLE_SECURITY_OFFICER.role,
                            campus: { id: campusId, label: campusData.label },
                            unit: { id, label: editUnitData.label }
                        }
                    }
                });
            }

            const placesToDelete = defaultValues.placesList.filter(
                (place) => !formData.places.find((p) => p.id === place.id)
            );
            const placesToAdd = formData.places.filter(
                (place) => !defaultValues.placesList.find((p) => p.id === place.id)
            );

            placesToDelete.map((place) => {
                editPlaceReq({
                    variables: {
                        id: place.id,
                        place: { unitInCharge: null }
                    }
                });
            });

            placesToAdd.map((place) => {
                editPlaceReq({
                    variables: {
                        id: place.id,
                        place: { unitInCharge: { id, label: editUnitData.label } }
                    }
                });
            });
            addAlert({ message: "L'unité a bien été modifiée", severity: 'success' });
            router.back();
        } catch (e) {
            return addAlert({
                message: 'Une erreur est survenue lors de la modification',
                severity: 'error'
            });
        }
    };

    const submitDeleteUnit = async () => {
        try {
            deleteUnit({ variables: { id } });

            deleteRole(
                defaultValues.unitCorrespondent.id,
                ROLES.ROLE_UNIT_CORRESPONDENT.role,
                defaultValues.name
            );

            if (defaultValues.unitOfficer.id) {
                deleteRole(
                    defaultValues.unitCorrespondent.id,
                    ROLES.ROLE_SECURITY_OFFICER.role,
                    defaultValues.label
                );
            }

            defaultValues.placesList.map((place) => {
                editPlaceReq({
                    variables: {
                        id: place.id,
                        place: { unitInCharge: null }
                    }
                });
            });

            addAlert({ message: "L'unité a bien été supprimée", severity: 'success' });
            router.back();
        } catch (e) {
            return addAlert({
                message: 'Une erreur est survenue lors de la suppression',
                severity: 'error'
            });
        }
    };

    if (loading || !defaultValues) return <LoadingCircle />;
    return (
        <>
            <PageTitle subtitles={['Unité', 'Editer unité']}>Administration</PageTitle>
            <UnitForm
                submitForm={submitEditUnit}
                deleteUnit={submitDeleteUnit}
                defaultValues={defaultValues}
                userRole={activeRoleCacheVar()}
                campusId={campusId}
                type="edit"
            />
        </>
    );
}

export default CreateUnit;

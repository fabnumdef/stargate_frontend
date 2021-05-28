import React, { useMemo } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../../../components/styled/common/pageTitle';
import UnitForm from '../../../../../components/administrationForms/unitForm';
import { useSnackBar } from '../../../../../lib/hooks/snackbar';
import { ROLES } from '../../../../../utils/constants/enums';
import { mapEditUnit } from '../../../../../utils/mappers/adminMappers';
import { activeRoleCacheVar } from '../../../../../lib/apollo/cache';
import LoadingCircle from '../../../../../components/styled/animations/loadingCircle';

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

const EDIT_USER = gql`
    mutation editUser($id: ObjectID!, $user: UserInput!) {
        editUser(id: $id, user: $user) {
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
    }
`;

const DELETE_ROLE = gql`
    mutation deleteUserRole($id: ObjectID!, $user: UserInput) {
        deleteUserRole(id: $id, user: $user) {
            id
        }
    }
`;

const EDIT_PLACE = gql`
    mutation editPlace($campusId: String!, $id: ObjectID!, $place: PlaceInput!) {
        campusId @client @export(as: "campusId")
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

    // @todo give real error message
    const [editUnit] = useMutation(EDIT_UNIT, {
        variables: { campusId },
        onError: () =>
            addAlert({ message: 'Erreur lors de la modification unité', severity: 'error' })
    });
    const [editUserReq] = useMutation(EDIT_USER, {
        onError: () =>
            addAlert({ message: 'Erreur lors de la modification utilisateur', severity: 'error' })
    });
    const [editPlaceReq] = useMutation(EDIT_PLACE, {
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

    const editUser = (userId, role, userInCharge) => {
        editUserReq({
            variables: {
                id: userId,
                user: {
                    roles: {
                        role,
                        userInCharge,
                        campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
                        units: { id, label: data.getCampus.getUnit.label }
                    }
                }
            }
        });
    };

    const deleteRole = (userId, role) => {
        const userRoleDeleted = deleteUserRoleReq({
            variables: {
                id: userId,
                user: {
                    roles: {
                        role
                    }
                }
            }
        });
        return userRoleDeleted;
    };

    const submitEditUnit = async (formData, editUnitData) => {
        try {
            editUnit({ variables: { id, unit: editUnitData } });
            const unitId = id;

            if (
                !defaultValues.unitCorrespondent.id ||
                defaultValues.unitCorrespondent.id !== formData.unitCorrespondent
            ) {
                if (defaultValues.unitCorrespondent.id) {
                    deleteRole(
                        defaultValues.unitCorrespondent.id,
                        ROLES.ROLE_UNIT_CORRESPONDENT.role
                    );
                }
                editUser(
                    formData.unitCorrespondent,
                    ROLES.ROLE_UNIT_CORRESPONDENT.role,
                    formData.unitCorrespondent
                );
            }

            if (
                (!defaultValues.unitOfficer.id && formData.unitOfficer.length) ||
                (defaultValues.unitOfficer.id &&
                    defaultValues.unitOfficer.id !== formData.unitOfficer)
            ) {
                if (defaultValues.unitOfficer.id) {
                    deleteRole(defaultValues.unitOfficer.id, ROLES.ROLE_SECURITY_OFFICER.role);
                }
                editUser(
                    formData.unitOfficer,
                    ROLES.ROLE_SECURITY_OFFICER.role,
                    formData.unitOfficer
                );
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
                        place: { unitInCharge: unitId }
                    }
                });
            });

            addAlert({ message: "L'unité a bien été modifiée", severity: 'success' });
            router.push('/administration/unites');
        } catch (e) {
            console.error(e);
        }
    };

    if (loading || !defaultValues) return <LoadingCircle />;
    return (
        <>
            <PageTitle subtitles={['Unité', 'Editer unité']}>Administration</PageTitle>
            <UnitForm
                submitForm={submitEditUnit}
                defaultValues={defaultValues}
                userRole={activeRoleCacheVar()}
                campusId={campusId}
                type="edit"
            />
        </>
    );
}

export default CreateUnit;

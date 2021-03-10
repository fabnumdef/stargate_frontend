import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../components/styled/pageTitle';
import Template from '../../../containers/template';
import UnitForm from '../../../components/administrationForms/unitForm';
import { useSnackBar } from '../../../lib/hooks/snackbar';
import { useLogin } from '../../../lib/loginContext';
import { FORMS_LIST, ROLES } from '../../../utils/constants/enums';
import { mapEditUnit } from '../../../utils/mappers/adminMappers';

const GET_UNIT = gql`
    query getUnit($campusId: String!, $id: ObjectID!) {
        campusId @client @export(as: "campusId")
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
        }
    }
`;

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
        }
    }
`;

const GET_PLACES = gql`
    query listPlaces($campusId: String!, $hasUnit: HasUnitFilter) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
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
    }
`;

const EDIT_UNIT = gql`
    mutation editUnit($campusId: String!, $id: ObjectID!, $unit: UnitInput!) {
        campusId @client @export(as: "campusId")
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
    const { id } = router.query;
    const [unitData, setUnitData] = useState(null);

    const { data: unit } = useQuery(GET_UNIT, {
        variables: { id },
        fetchPolicy: 'cache-and-network'
    });

    const { data: unitCorresDatas } = useQuery(GET_USERS, {
        variables: { hasRole: { role: ROLES.ROLE_UNIT_CORRESPONDENT.role, unit: id } }
    });
    const { data: unitOfficerDatas } = useQuery(GET_USERS, {
        variables: { hasRole: { role: ROLES.ROLE_SECURITY_OFFICER.role, unit: id } }
    });
    const { data: placesData } = useQuery(GET_PLACES, {
        variables: { hasUnit: { id } },
        fetchPolicy: 'cache-and-network'
    });

    const [editUnit] = useMutation(EDIT_UNIT);
    const [editUserReq] = useMutation(EDIT_USER);
    const [editPlaceReq] = useMutation(EDIT_PLACE);
    const [deleteUserRoleReq] = useMutation(DELETE_ROLE);
    const { activeRole } = useLogin();

    const [defaultValues, setDefaultValues] = useState(null);

    const editUser = async (userId, role, userInCharge) => {
        try {
            await editUserReq({
                variables: {
                    id: userId,
                    user: {
                        roles: {
                            role,
                            userInCharge,
                            campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
                            units: { id, label: unitData.label }
                        }
                    }
                }
            });
        } catch (e) {
            addAlert({ message: 'Une erreur est survenue', severity: 'error' });
        }
        return true;
    };

    const deleteRole = async (userId, role) => {
        try {
            const userRoleDeleted = await deleteUserRoleReq({
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
        } catch {
            return null;
        }
    };

    const editPlace = async (placeId, data) => {
        try {
            await editPlaceReq({
                variables: {
                    id: placeId,
                    place: { unitInCharge: data }
                }
            });
            return true;
        } catch (e) {
            return e;
        }
    };

    const submitEditUnit = async (formData, editUnitData, assistantsList) => {
        try {
            await editUnit({ variables: { id, unit: editUnitData } });
            const unitId = id;

            if (
                !defaultValues.unitCorrespondent.id ||
                defaultValues.unitCorrespondent.id !== formData.unitCorrespondent
            ) {
                if (defaultValues.unitCorrespondent.id) {
                    await deleteRole(
                        defaultValues.unitCorrespondent.id,
                        ROLES.ROLE_UNIT_CORRESPONDENT.role
                    );
                }
                await editUser(
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
                    await deleteRole(
                        defaultValues.unitOfficer.id,
                        ROLES.ROLE_SECURITY_OFFICER.role
                    );
                }
                await editUser(
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
            await Promise.all(
                placesToDelete.map(async (place) => {
                    await editPlace(place.id, null);
                })
            );
            await Promise.all(
                placesToAdd.map(async (place) => {
                    await editPlace(place.id, { id: unitId });
                })
            );

            if (assistantsList[FORMS_LIST.CORRES_ASSISTANTS].length) {
                await Promise.all(
                    assistantsList[FORMS_LIST.CORRES_ASSISTANTS].map(async (user) => {
                        if (user.toDelete && user.id !== formData.unitCorrespondent) {
                            return deleteRole(user.id, ROLES.ROLE_UNIT_CORRESPONDENT.role);
                        }
                        const haveRole = user.roles.find(
                            (role) => role.role === ROLES.ROLE_UNIT_CORRESPONDENT.role
                        );
                        if (!haveRole || haveRole.userInCharge !== formData.unitCorrespondent) {
                            await editUser(
                                user.id,
                                ROLES.ROLE_UNIT_CORRESPONDENT.role,
                                formData.unitCorrespondent
                            );
                        }
                        return user;
                    })
                );
            }

            if (assistantsList[FORMS_LIST.OFFICER_ASSISTANTS].length) {
                await Promise.all(
                    assistantsList[FORMS_LIST.OFFICER_ASSISTANTS].map(async (user) => {
                        if (user.toDelete && user.id !== formData.unitOfficer) {
                            return deleteRole(user.id, ROLES.ROLE_SECURITY_OFFICER.role);
                        }
                        const haveRole = user.roles.find(
                            (role) => role.role === ROLES.ROLE_SECURITY_OFFICER.role
                        );
                        if (!haveRole || haveRole.userInCharge !== formData.unitOfficer) {
                            await editUser(
                                user.id,
                                ROLES.ROLE_SECURITY_OFFICER.role,
                                formData.unitOfficer
                            );
                        }
                        return user;
                    })
                );
            }
            addAlert({ message: "L'unité a bien été modifiée", severity: 'success' });
            return router.push('/administration/unites');
        } catch (e) {
            return addAlert({ message: 'Une erreur est survenue', severity: 'error' });
        }
    };

    useEffect(() => {
        if (unit) {
            setUnitData(unit.getCampus.getUnit);
        }
    }, [unit]);

    useEffect(() => {
        if (unitData && unitCorresDatas && unitOfficerDatas && placesData) {
            setDefaultValues(
                mapEditUnit(
                    unitData,
                    [...unitCorresDatas.listUsers.list],
                    [...unitOfficerDatas.listUsers.list],
                    [...placesData.getCampus.listPlaces.list]
                )
            );
        }
    }, [unitData, unitCorresDatas, unitOfficerDatas, placesData]);

    return (
        <Template>
            <PageTitle title="Administration" subtitles={['Unité', 'Editer unité']} />
            {defaultValues && (
                <UnitForm
                    submitForm={submitEditUnit}
                    defaultValues={defaultValues}
                    userRole={activeRole}
                    type="edit"
                />
            )}
        </Template>
    );
}

export default CreateUnit;

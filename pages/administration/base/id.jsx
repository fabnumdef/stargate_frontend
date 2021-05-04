import React, { useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { CampusFormContainer } from '../../../containers';
import { useSnackBar } from '../../../lib/hooks/snackbar';
import { FORMS_LIST, ROLES } from '../../../utils/constants/enums';
import { mapEditCampus } from '../../../utils/mappers/adminMappers';

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
            trigram
        }
    }
`;

const EDIT_CAMPUS = gql`
    mutation editCampus($campus: EditCampusInput!, $id: String!) {
        editCampus(campus: $campus, id: $id) {
            id
            label
        }
    }
`;

function EditCampus() {
    const { addAlert } = useSnackBar();
    const router = useRouter();
    const { id } = router.query;
    const [loadingData, setLoadingData] = useState(true);
    const [editCampus] = useMutation(EDIT_CAMPUS);
    const [editUserReq] = useMutation(EDIT_USER);
    const [deleteUserRoleReq] = useMutation(DELETE_ROLE);

    const { data: adminsList } = useQuery(GET_USERS, {
        variables: {
            cursor: { offset: 0, first: 10 },
            hasRole: { role: ROLES.ROLE_ADMIN.role },
            fetchPolicy: 'no-cache'
        }
    });

    const { data: editCampusData } = useQuery(GET_CAMPUS, {
        variables: { id },
        fetchPolicy: 'no-cache'
    });
    const { data: placesList } = useQuery(GET_PLACES, {
        variables: { id },
        fetchPolicy: 'no-cache'
    });
    const [defaultValues, setDefaultValues] = useState(null);

    const editUser = async (user, userInChargeId) => {
        const variables = {
            id: user.id,
            user: {
                roles: {
                    role: ROLES.ROLE_ADMIN.role,
                    userInCharge: userInChargeId,
                    campuses: [
                        {
                            id,
                            label: editCampusData.getCampus.label
                        }
                    ]
                }
            }
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
                            role: ROLES.ROLE_ADMIN.role
                        }
                    }
                }
            });
            return resAssistant;
        } catch {
            return null;
        }
    };

    const submitEditCampus = async (data, assistantsList) => {
        try {
            if (data.name !== editCampusData.getCampus.label) {
                await editCampus({ variables: { id, campus: { label: data.label } } });
            }

            if (!defaultValues.admin || defaultValues.admin.id !== data.campusAdmin.id) {
                if (defaultValues.admin) {
                    await deleteAssistant(defaultValues.admin);
                }
                await editUser(data.campusAdmin, data.campusAdmin.id);
            }

            await Promise.all(
                assistantsList[FORMS_LIST.ADMIN_ASSISTANTS].map(async (assistant) => {
                    if (assistant.toDelete) {
                        await deleteAssistant(assistant);
                        return assistant;
                    }
                    const haveRole = assistant.roles.find(
                        (role) =>
                            role.role === ROLES.ROLE_ADMIN.role &&
                            role.campuses.find((campus) => campus.id === id)
                    );
                    if (!haveRole || haveRole.userInCharge !== data.campusAdmin.id) {
                        await editUser(assistant, data.campusAdmin.id);
                    }
                    return assistant;
                })
            );
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

    useEffect(() => {
        if (editCampusData && adminsList && placesList) {
            const defaultValues = mapEditCampus(
                editCampusData.getCampus,
                adminsList.listUsers.list
            );
            setDefaultValues({
                ...defaultValues,
                placesList: placesList.getCampus.listPlaces.list
            });
            setLoadingData(false);
        }
    }, [editCampusData, adminsList, placesList]);

    return (
        <>
            {!loadingData && (
                <CampusFormContainer
                    onSubmit={submitEditCampus}
                    defaultValues={defaultValues}
                    setDefaultValues={setDefaultValues}
                    campusId={id}
                    type="edit"
                />
            )}
        </>
    );
}

export default EditCampus;

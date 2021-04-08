import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { CampusFormContainer } from '../../../containers';
import { useSnackBar } from '../../../lib/hooks/snackbar';
import { FORMS_LIST, ROLES } from '../../../utils/constants/enums';

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

const CREATE_CAMPUS = gql`
    mutation createCampus($campus: CampusInput!, $id: String!) {
        createCampus(id: $id, campus: $campus) {
            id
            label
            trigram
        }
    }
`;

function CreateCampus() {
    const { addAlert } = useSnackBar();
    const router = useRouter();
    const [createCampus] = useMutation(CREATE_CAMPUS);
    const [editUserReq] = useMutation(EDIT_USER);
    const [deleteUserRoleReq] = useMutation(DELETE_ROLE);

    const [defaultValues, setDefaultValues] = useState({
        placesList: [],
        assistants: []
    });

    const editUser = async (campus, user, userInChargeId) => {
        const variables = {
            id: user.id,
            user: {
                roles: {
                    role: ROLES.ROLE_ADMIN.role,
                    userInCharge: userInChargeId,
                    campuses: [
                        {
                            id: campus.id,
                            label: campus.label
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

    const submitCreateCampus = async (data, assistantsList) => {
        try {
            const {
                data: { createCampus: campusData }
            } = await createCampus({
                variables: { id: data.id, campus: { label: data.label, trigram: data.trigram } }
            });
            await editUser(campusData, data.campusAdmin, data.campusAdmin.id);

            await Promise.all(
                assistantsList[FORMS_LIST.ADMIN_ASSISTANTS].map(async (assistant) => {
                    if (assistant.toDelete) {
                        await deleteAssistant(assistant);
                        return assistant;
                    }
                    const haveRole = assistant.roles.find(
                        (role) =>
                            role.role === ROLES.ROLE_ADMIN.role &&
                            role.campuses.find((campus) => campus.id === campusData.id)
                    );
                    if (!haveRole || haveRole.userInCharge !== data.campusAdmin.id) {
                        await editUser(assistant, campusData.id);
                    }
                    return assistant;
                })
            );
            router.push(`${campusData.id}`);
            return addAlert({
                message: 'La base a bien été créée',
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
            <CampusFormContainer
                onSubmit={submitCreateCampus}
                defaultValues={defaultValues}
                setDefaultValues={setDefaultValues}
                type="create"
            />
        </>
    );
}

export default CreateCampus;

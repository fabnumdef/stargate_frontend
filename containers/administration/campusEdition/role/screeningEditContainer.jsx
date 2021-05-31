import React from 'react';
import PropTypes from 'prop-types';
import { ScreeningEdit } from '../../../../components';
import { useMutation, useQuery } from '@apollo/client';
import { LIST_USERS } from '../../../../lib/apollo/queries';
import { ROLES } from '../../../../utils/constants/enums';
import { createUserData } from '../../../../utils/mappers/createUserFromMail';
import { CREATE_USER, DELETE_ROLE } from '../../../../lib/apollo/mutations';
import { useSnackBar } from '../../../../lib/hooks/snackbar';

function ScreeningEditContainer({ campus, role }) {
    const { addAlert } = useSnackBar();
    const { data, loading } = useQuery(LIST_USERS, {
        variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_SCREENING.role } }
    });

    const [deleteUserRoleReq] = useMutation(DELETE_ROLE, {
        update: (cache, { data: { deleteUserRole: deletedUser } }) => {
            const currentUsers = cache.readQuery({
                query: LIST_USERS,
                variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_SCREENING.role } }
            });
            const updatedTotal = currentUsers.listUsers.meta.total - 1;
            const updatedUsers = {
                ...currentUsers,
                listUsers: {
                    ...currentUsers.listUsers,
                    list: currentUsers.listUsers.list.filter((user) => user.id !== deletedUser.id),
                    meta: {
                        ...currentUsers.listUsers.meta,
                        total: updatedTotal
                    }
                }
            };
            cache.writeQuery({
                query: LIST_USERS,
                variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_SCREENING.role } },
                data: updatedUsers
            });
        }
    });
    const [createUser] = useMutation(CREATE_USER, {
        update: (cache, { data: { createUser: createdUser } }) => {
            const currentUsers = cache.readQuery({
                query: LIST_USERS,
                variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_SCREENING.role } }
            });
            const updatedTotal = currentUsers.listUsers.meta.total + 1;
            const updatedUsers = {
                ...currentUsers,
                listUsers: {
                    ...currentUsers.listUsers,
                    list: [...currentUsers.listUsers.list, createdUser],
                    meta: {
                        ...currentUsers.listUsers.meta,
                        total: updatedTotal
                    }
                }
            };
            cache.writeQuery({
                query: LIST_USERS,
                variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_SCREENING.role } },
                data: updatedUsers
            });
        }
    });

    const submitCreateUser = async (formData) => {
        const roles = {
            role: ROLES.ROLE_SCREENING.role,
            campuses: { id: campus.id, label: campus.label }
        };
        const user = createUserData(formData.screeningEmail, roles);
        try {
            const {
                data: {
                    createUser: { id }
                }
            } = await createUser({ variables: { user } });
            if (id) {
                addAlert({
                    message: "L'utilisateur pour le Criblage a bien été créé",
                    severity: 'success'
                });
            }
            return true;
        } catch (e) {
            switch (true) {
                case e.message === 'GraphQL error: User already exists':
                    addAlert({
                        message: 'Un utilisateur est déjà enregistré avec cet e-mail',
                        severity: 'error'
                    });
                    break;
                case e.message.includes(
                    'User validation failed: email.original: queryMx ENOTFOUND'
                ):
                    addAlert({
                        message: "Erreur, veuillez vérifier le domaine de l'adresse e-mail",
                        severity: 'warning'
                    });
                    break;
                default:
                    addAlert({
                        message: 'Erreur serveur, merci de réessayer',
                        severity: 'warning'
                    });
            }
            return false;
        }
    };

    const deleteScreeningRole = async (id) => {
        try {
            await deleteUserRoleReq({
                variables: {
                    id,
                    user: {
                        roles: {
                            role: ROLES.ROLE_SCREENING.role
                        }
                    }
                }
            });
            addAlert({
                message: "Le rôle Criblage à bien été supprimé de l'utilisateur",
                severity: 'success'
            });
        } catch {
            return null;
        }
    };

    return (
        !loading && (
            <ScreeningEdit
                campus={campus}
                role={role}
                screeningUsers={data?.listUsers ?? []}
                submitCreateUser={submitCreateUser}
                deleteScreeningRole={deleteScreeningRole}
            />
        )
    );
}

ScreeningEditContainer.propTypes = {
    campus: PropTypes.objectOf(PropTypes.string).isRequired,
    role: PropTypes.string.isRequired
};

export default ScreeningEditContainer;

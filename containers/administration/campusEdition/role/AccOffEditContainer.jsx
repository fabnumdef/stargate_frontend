import React from 'react';
import PropTypes from 'prop-types';
import { AccOffEdit } from '../../../../components';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { FIND_USER_BY_MAIL, LIST_USERS } from '../../../../lib/apollo/queries';
import { ROLES } from '../../../../utils/constants/enums';
import { createUserData } from '../../../../utils/mappers/createUserFromMail';
import { CREATE_USER, ADD_USER_ROLE, DELETE_ROLE } from '../../../../lib/apollo/mutations';
import { useSnackBar } from '../../../../lib/hooks/snackbar';

function AccOffEditContainer({ campus, role }) {
    const { addAlert } = useSnackBar();
    const client = useApolloClient();
    const { data, loading } = useQuery(LIST_USERS, {
        variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_ACCESS_OFFICE.role } }
    });

    const [deleteUserRoleReq] = useMutation(DELETE_ROLE, {
        update: (cache, { data: { deleteUserRole: deletedUser } }) => {
            const currentUsers = cache.readQuery({
                query: LIST_USERS,
                variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_ACCESS_OFFICE.role } }
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
                variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_ACCESS_OFFICE.role } },
                data: updatedUsers
            });
        }
    });

    const addRoleUpdate = (cache, user) => {
        const currentUsers = cache.readQuery({
            query: LIST_USERS,
            variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_ACCESS_OFFICE.role } }
        });
        const updatedTotal = currentUsers.listUsers.meta.total + 1;
        const updatedUsers = {
            ...currentUsers,
            listUsers: {
                ...currentUsers.listUsers,
                list: [...currentUsers.listUsers.list, user],
                meta: {
                    ...currentUsers.listUsers.meta,
                    total: updatedTotal
                }
            }
        };
        cache.writeQuery({
            query: LIST_USERS,
            variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_ACCESS_OFFICE.role } },
            data: updatedUsers
        });
    };

    const [addUserRole] = useMutation(ADD_USER_ROLE, {
        update: (cache, { data: { addUserRole: updatedUser } }) => addRoleUpdate(cache, updatedUser)
    });
    const [createUser] = useMutation(CREATE_USER, {
        update: (cache, { data: { createUser: createdUser } }) => addRoleUpdate(cache, createdUser)
    });

    const submitCreateAccOff = async (user) => {
        try {
            const {
                data: {
                    createUser: { id }
                }
            } = await createUser({ variables: { user } });
            if (id) {
                addAlert({
                    message: "L'utilisateur pour le Bureau des Accès a bien été créé",
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

    const submitAddUserRole = async (user, roleData) => {
        try {
            const {
                data: {
                    addUserRole: { email }
                }
            } = await addUserRole({ variables: { id: user.id, roleData } });
            addAlert({
                message: `Le rôle Bureau des Accès à bien été ajouté à ${email.original}`,
                severity: 'success'
            });
            return true;
        } catch {
            addAlert({
                message: "Erreur lors de l'ajout du rôle à l'utilisateur",
                severity: 'error'
            });
            return false;
        }
    };

    const deleteAccOff = async (id) => {
        try {
            await deleteUserRoleReq({
                variables: {
                    id,
                    roleData: {
                        role: ROLES.ROLE_ACCESS_OFFICE.role
                    }
                }
            });
            addAlert({
                message: "Le rôle Bureau des Accès à bien été supprimé de l'utilisateur",
                severity: 'success'
            });
        } catch {
            return null;
        }
    };

    const handleCreateAccOff = async (formData) => {
        const roleData = {
            role: ROLES.ROLE_ACCESS_OFFICE.role,
            campus: { id: campus.id, label: campus.label }
        };
        const { data } = await client.query({
            query: FIND_USER_BY_MAIL,
            variables: {
                email: formData.accOffEmail
            },
            fetchPolicy: 'no-cache'
        });
        if (!data.findUser) {
            const userAdmin = createUserData(formData.accOffEmail, roleData);
            return submitCreateAccOff(userAdmin);
        } else {
            return submitAddUserRole(data.findUser, roleData);
        }
    };

    return (
        !loading &&
        data && (
            <AccOffEdit
                campus={campus}
                role={role}
                accOffUsers={data?.listUsers ?? []}
                submitCreateUser={handleCreateAccOff}
                deleteAccOff={deleteAccOff}
            />
        )
    );
}

AccOffEditContainer.propTypes = {
    campus: PropTypes.objectOf(PropTypes.string).isRequired,
    role: PropTypes.string.isRequired
};

export default AccOffEditContainer;

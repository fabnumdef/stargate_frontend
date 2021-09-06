import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../components/styled/common/pageTitle';
import UserForm from '../../../components/administrationForms/userForm';
import { useSnackBar } from '../../../lib/hooks/snackbar';
import { useLogin } from '../../../lib/loginContext';
import { isAdmin, isSuperAdmin } from '../../../utils/permissions';
import { ADMIN_USER_ADMINISTRATION } from '../../../utils/constants/appUrls';
import { GET_USERS_LIST } from '../../../containers/administration/userAdministration';
import { campusIdVar } from '../../../lib/apollo/cache';

const GET_ME = gql`
    query getMe {
        me {
            roles {
                role
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

const CREATE_USER = gql`
    mutation createUser($user: UserInput!) {
        createUser(user: $user) {
            id
            firstname
            lastname
            email {
                original
            }
            roles {
                role
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

function CreateUser() {
    const { addAlert } = useSnackBar();
    const router = useRouter();
    const { data: userData } = useQuery(GET_ME);
    const { activeRole } = useLogin();
    const [createUser] = useMutation(CREATE_USER, {
        update: async (cache, { data: { createUser: createdUser } }) => {
            const campus = campusIdVar();
            const currentUsers = await cache.readQuery({
                query: GET_USERS_LIST,
                variables: {
                    campus,
                    search: '',
                    hasRole:
                        isAdmin(activeRole.role) || isSuperAdmin(activeRole.role)
                            ? {}
                            : { unit: activeRole.unit }
                }
            });
            const updatedTotal = currentUsers.listUsers.meta.total + 1;
            const updatedUsers = {
                ...currentUsers,
                listUsers: {
                    ...currentUsers.listUsers,
                    ...(updatedTotal < 10 && {
                        list: [
                            ...currentUsers.listUsers.list,
                            { ...createdUser, __typename: 'User' }
                        ]
                    }),
                    meta: {
                        ...currentUsers.listUsers.meta,
                        total: updatedTotal
                    }
                }
            };
            await cache.writeQuery({
                query: GET_USERS_LIST,
                variables: {
                    campus,
                    search: '',
                    hasRole:
                        isAdmin(activeRole.role) || isSuperAdmin(activeRole.role)
                            ? {}
                            : { unit: activeRole.unit }
                },
                data: updatedUsers
            });
        }
    });

    const submitCreateUser = async (user) => {
        try {
            await createUser({ variables: { user } });
            addAlert({ message: "L'utilisateur a bien été créé", severity: 'success' });
            return router.push(ADMIN_USER_ADMINISTRATION);
        } catch (e) {
            switch (true) {
                case e.message === 'GraphQL error: User already exists':
                    return addAlert({
                        message: 'Un utilisateur est déjà enregistré avec cet e-mail',
                        severity: 'error'
                    });
                case e.message.includes(
                    'User validation failed: email.original: queryMx ENOTFOUND'
                ):
                    return addAlert({
                        message: "Erreur, veuillez vérifier le domaine de l'adresse e-mail",
                        severity: 'warning'
                    });
                default:
                    return addAlert({
                        message: 'Erreur serveur, merci de réessayer',
                        severity: 'warning'
                    });
            }
        }
    };

    let defaultValues = {};
    if (userData) {
        const selectedRole = userData.me.roles.find((role) => role.role === activeRole.role);
        defaultValues = {
            campus: selectedRole.campuses[0] ? selectedRole.campuses[0] : null,
            unit: selectedRole.units[0] ? selectedRole.units[0] : null
        };
    }

    return (
        <>
            <PageTitle subtitles={['Utilisateur', 'Nouvel utilisateur']}>Administration</PageTitle>
            {userData && (
                <UserForm
                    submitForm={submitCreateUser}
                    defaultValues={defaultValues}
                    userRole={activeRole}
                    type="create"
                />
            )}
        </>
    );
}

export default CreateUser;

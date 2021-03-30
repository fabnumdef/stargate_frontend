import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../components/styled/common/pageTitle';
import Template from '../../../containers/template';
import UserForm from '../../../components/administrationForms/userForm';
import { useSnackBar } from '../../../lib/hooks/snackbar';
import { useLogin } from '../../../lib/loginContext';
import { isAdmin, isSuperAdmin } from '../../../utils/permissions';

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

const GET_USERS_LIST = gql`
    query listUsers(
        $cursor: OffsetCursor
        $filters: UserFilters
        $hasRole: HasRoleInput
        $search: String
    ) {
        listUsers(cursor: $cursor, filters: $filters, hasRole: $hasRole, search: $search) {
            meta {
                offset
                first
                total
            }
            list {
                id
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
        update: (cache, { data: { createUser: createdUser } }) => {
            const currentUsers = cache.readQuery({
                query: GET_USERS_LIST,
                variables: {
                    cursor: { first: 10, offset: 0 },
                    search: null,
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
                        list: [...currentUsers.listUsers.list, createdUser]
                    }),
                    meta: {
                        ...currentUsers.listUsers.meta,
                        total: updatedTotal
                    }
                }
            };
            cache.writeQuery({
                query: GET_USERS_LIST,
                variables: {
                    cursor: { first: 10, offset: 0 },
                    search: null,
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
            const {
                data: {
                    createUser: { id }
                }
            } = await createUser({ variables: { user } });
            if (id) {
                addAlert({ message: "L'utilisateur a bien été créé", severity: 'success' });
                router.push('/administration/utilisateurs');
            }
            return null;
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
            campus: selectedRole.campuses[0] ? selectedRole.campuses[0].id : null,
            unit: selectedRole.units[0] ? selectedRole.units[0].id : null
        };
    }

    return (
        <Template>
            <PageTitle title="Administration" subtitles={['Utilisateur', 'Nouvel utilisateur']} />
            {userData && (
                <UserForm
                    submitForm={submitCreateUser}
                    defaultValues={defaultValues}
                    userRole={activeRole}
                    type="create"
                />
            )}
        </Template>
    );
}

export default CreateUser;

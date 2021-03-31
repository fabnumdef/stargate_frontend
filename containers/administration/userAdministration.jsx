import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import IndexAdministration from '../../components/administration';
import { mapUsersList } from '../../utils/mappers/adminMappers';
import { isAdmin, isSuperAdmin } from '../../utils/permissions';
import { useLogin } from '../../lib/loginContext';

const columns = [
    { id: 'lastname', label: 'Nom' },
    { id: 'firstname', label: 'Prénom' },
    { id: 'campus', label: 'Base' },
    { id: 'unit', label: 'Unité' },
    { id: 'role', label: 'Rôle' }
];

const GET_USERS_LIST = gql`
    query listUsers(
        $cursor: OffsetCursor
        $filters: UserFilters
        $hasRole: HasRoleInput
        $campus: String
        $search: String
    ) {
        campusId @client @export(as: "campus")
        listUsers(
            cursor: $cursor
            filters: $filters
            hasRole: $hasRole
            campus: $campus
            search: $search
        ) {
            meta {
                offset
                first
                total
            }
            list {
                id
                lastname
                firstname
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
                email {
                    original
                }
            }
        }
    }
`;

const DELETE_USER = gql`
    mutation deleteUser($id: ObjectID!) {
        deleteUser(id: $id) {
            id
        }
    }
`;

const createUserData = (data) => ({
    createPath: '/administration/utilisateurs/creation',
    confirmDeleteText: `Êtes-vous sûr de vouloir supprimer cet utilisateur: ${data} ?`,
    deletedText: `L'utilisateur ${data} a bien été supprimé`
});

function UserAdministration() {
    const { activeRole } = useLogin();
    const [usersList, setUsersList] = useState({ list: [], total: 0 });
    const [searchInput, setSearchInput] = useState('');

    const onCompletedQuery = (data) =>
        setUsersList({
            list: mapUsersList(data.listUsers.list),
            total: data.listUsers.meta.total
        });

    const updateDeleteMutation = (cache, data, page, rowsPerPage) => {
        const deletedUser = data.deleteUser;
        const currentUsers = cache.readQuery({
            query: GET_USERS_LIST,
            variables: {
                cursor: { first: rowsPerPage, offset: page * rowsPerPage },
                search: searchInput,
                hasRole:
                    isAdmin(activeRole.role) || isSuperAdmin(activeRole.role)
                        ? {}
                        : { unit: activeRole.unit }
            }
        });
        const newList = currentUsers.listUsers.list.filter((user) => user.id !== deletedUser.id);
        const updatedTotal = currentUsers.listUsers.meta.total - 1;
        const updatedUsers = {
            ...currentUsers,
            listUsers: {
                ...currentUsers.listUsers,
                ...(updatedTotal < 10 && { list: newList }),
                meta: {
                    ...currentUsers.listUsers.meta,
                    total: updatedTotal
                }
            }
        };
        cache.writeQuery({
            query: GET_USERS_LIST,
            variables: {
                cursor: { first: rowsPerPage, offset: page * rowsPerPage },
                search: searchInput,
                hasRole:
                    isAdmin(activeRole.role) || isSuperAdmin(activeRole.role)
                        ? {}
                        : { unit: activeRole.unit }
            },
            data: updatedUsers
        });
    };

    const { data, refetch, fetchMore } = useQuery(GET_USERS_LIST, {
        variables: {
            cursor: { first: 10, offset: 0 },
            search: searchInput,
            hasRole:
                isAdmin(activeRole.role) || isSuperAdmin(activeRole.role)
                    ? {}
                    : { unit: activeRole.unit }
        }
    });

    useEffect(() => {
        if (data) {
            onCompletedQuery(data);
        }
    }, [data]);

    return (
        <IndexAdministration
            fetchMore={fetchMore}
            refetch={refetch}
            result={usersList}
            onCompletedQuery={onCompletedQuery}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            deleteMutation={DELETE_USER}
            updateFunction={updateDeleteMutation}
            tabData={createUserData}
            columns={columns}
            subtitles={['Utilisateurs']}
        />
    );
}

export default UserAdministration;

import React, { useState, useEffect } from 'react';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import IndexAdministration from '../../components/administration';
import { mapUnitsList } from '../../utils/mappers/adminMappers';
import { ROLES } from '../../utils/constants/enums';

const columns = [
    { id: 'trigram', label: 'Trigramme' },
    { id: 'name', label: 'Nom' },
    { id: ROLES.ROLE_SECURITY_OFFICER.role, label: ROLES.ROLE_SECURITY_OFFICER.label },
    { id: ROLES.ROLE_UNIT_CORRESPONDENT.role, label: ROLES.ROLE_UNIT_CORRESPONDENT.label }
];

const GET_UNITS_LIST = gql`
    query listUnits($cursor: OffsetCursor, $campusId: String!, $search: String) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            listUnits(cursor: $cursor, search: $search) {
                meta {
                    offset
                    first
                    total
                }
                list {
                    id
                    label
                    trigram
                }
            }
        }
        listUsers {
            list {
                id
                firstname
                lastname
                roles {
                    role
                    userInCharge
                    campuses {
                        id
                    }
                    units {
                        id
                    }
                }
            }
        }
    }
`;

const DELETE_UNIT = gql`
    mutation deleteUnit($campusId: String!, $id: ObjectID!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            deleteUnit(id: $id) {
                id
            }
        }
    }
`;

const createUnitData = (data) => ({
    createPath: '/administration/unites/creation',
    confirmDeleteText: `Êtes-vous sûr de vouloir supprimer cette unité: ${data} ?`,
    deletedText: `L'unité ${data} a bien été supprimée`
});

function UnitAdministration() {
    const [unitsList, setUnitsList] = useState({ list: [], total: 0 });
    const [searchInput, setSearchInput] = useState('');
    const client = useApolloClient();
    const { campusId } = client.readQuery({
        query: gql`
            query getCampusId {
                campusId
            }
        `
    });

    const onCompletedQuery = (data) => {
        const mappedList = mapUnitsList(data.getCampus.listUnits.list, data.listUsers.list);
        return setUnitsList({ list: mappedList, total: data.getCampus.listUnits.meta.total });
    };

    const updateDeleteMutation = (cache, data, page, rowsPerPage) => {
        const deletedUnit = data.mutateCampus.deleteUnit;
        const currentUnits = cache.readQuery({
            query: GET_UNITS_LIST,
            variables: {
                cursor: { first: rowsPerPage, offset: page * rowsPerPage },
                search: searchInput,
                campusId
            }
        });
        const newList = currentUnits.getCampus.listUnits.list.filter(
            (unit) => unit.id !== deletedUnit.id
        );
        const updatedTotal = currentUnits.getCampus.listUnits.meta.total - 1;
        const updatedUnits = {
            ...currentUnits,
            getCampus: {
                ...currentUnits.getCampus,
                listUnits: {
                    ...currentUnits.getCampus.listUnits,
                    ...(updatedTotal < 10 && { list: newList }),
                    meta: {
                        ...currentUnits.getCampus.listUnits.meta,
                        total: updatedTotal
                    }
                }
            }
        };
        cache.writeQuery({
            query: GET_UNITS_LIST,
            variables: {
                cursor: { first: rowsPerPage, offset: page * rowsPerPage },
                search: searchInput,
                campusId
            },
            data: updatedUnits
        });
    };

    const { data, refetch, fetchMore } = useQuery(GET_UNITS_LIST, {
        variables: {
            cursor: { first: 10, offset: 0 },
            search: searchInput
        }
    });

    useEffect(() => {
        if (data) {
            onCompletedQuery(data);
        }
    }, [data]);

    return (
        <IndexAdministration
            result={unitsList}
            fetchMore={fetchMore}
            refetch={refetch}
            onCompletedQuery={onCompletedQuery}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            deleteMutation={DELETE_UNIT}
            updateFunction={updateDeleteMutation}
            tabData={createUnitData}
            columns={columns}
            subtitles={['Unités']}
        />
    );
}

export default UnitAdministration;

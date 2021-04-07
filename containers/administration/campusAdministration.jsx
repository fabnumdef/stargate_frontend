import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import IndexAdministration from '../../components/administration';

const columns = [
    { id: 'label', label: 'Nom' },
    { id: 'trigram', label: 'Trigramme' }
];

const GET_CAMPUSES_LIST = gql`
    query listCampuses($cursor: OffsetCursor, $filters: CampusFilters) {
        listCampuses(filters: $filters, cursor: $cursor) {
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
`;

const DELETE_CAMPUS = gql`
    mutation deleteCampus($id: String!) {
        deleteCampus(id: $id) {
            id
        }
    }
`;

const createCampusData = (data) => ({
    createPath: '/administration/base/creation',
    confirmDeleteText: `Êtes-vous sûr de vouloir supprimer cette base: ${data} ?`,
    deletedText: `La base ${data} a bien été supprimée`
});

function BaseAdministration() {
    const [campusesList, setCampusesList] = useState({ list: [], total: 0 });
    const [searchInput, setSearchInput] = useState('');

    const onCompletedQuery = (data) => {
        return setCampusesList({
            list: data.listCampuses.list,
            total: data.listCampuses.meta.total
        });
    };

    const updateDeleteMutation = (cache, data, page, rowsPerPage) => {
        const deletedUnit = data.deleteCampus;
        const currentCampuses = cache.readQuery({
            query: GET_CAMPUSES_LIST,
            variables: {
                cursor: { first: rowsPerPage, offset: page * rowsPerPage },
                search: searchInput
            }
        });
        const newList = currentCampuses.listCampuses.list.filter(
            (campus) => campus.id !== deletedUnit.id
        );
        const updatedTotal = currentCampuses.listCampuses.meta.total - 1;
        const updatedCampuses = {
            ...currentCampuses,
            ...currentCampuses,
            listCampuses: {
                ...currentCampuses.listCampuses,
                ...(updatedTotal < 10 && { list: newList }),
                meta: {
                    ...currentCampuses.listCampuses.meta,
                    total: updatedTotal
                }
            }
        };
        cache.writeQuery({
            query: GET_CAMPUSES_LIST,
            variables: {
                cursor: { first: rowsPerPage, offset: page * rowsPerPage },
                search: searchInput
            },
            data: updatedCampuses
        });
    };

    const { data, refetch, fetchMore } = useQuery(GET_CAMPUSES_LIST, {
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
            result={campusesList}
            fetchMore={fetchMore}
            refetch={refetch}
            onCompletedQuery={onCompletedQuery}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            deleteMutation={DELETE_CAMPUS}
            updateFunction={updateDeleteMutation}
            tabData={createCampusData}
            columns={columns}
            subtitles={['Bases']}
        />
    );
}

export default BaseAdministration;

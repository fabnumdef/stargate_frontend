import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useApolloClient } from '@apollo/client';
import IndexAdministration from '../../components/administration';
import { mapUnitsList } from '../../utils/mappers/adminMappers';
import { ROLES } from '../../utils/constants/enums';

const columns = [
  { id: 'trigram', label: 'Trigramme' },
  { id: 'name', label: 'Nom' },
  { id: ROLES.ROLE_SECURITY_OFFICER.role, label: ROLES.ROLE_SECURITY_OFFICER.label },
  { id: ROLES.ROLE_UNIT_CORRESPONDENT.role, label: ROLES.ROLE_UNIT_CORRESPONDENT.label },
];

const GET_UNITS_LIST = gql`
    query listUnits($cursor: OffsetCursor, $filters: UnitFilters, $campusId: String!) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            listUnits(cursor: $cursor, filters: $filters) {
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
    }
`;

const GET_UNITS_USERS = gql`
    query listUsers($filters: UserFilters) {
          listUsers(filters: $filters) {
              list {
                  id
                  firstname
                  lastname
                  roles {
                      role
                      userInCharge
                      units {
                          id
                      }
                  }
              }
          }
      }
`;

const DELETE_UNIT = gql`
    mutation deleteUnit($campusId: String!, $id: String!) {
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
  deletedText: `L'unité ${data} a bien été supprimée`,
});

function UnitAdministration() {
  const client = useApolloClient();

  const [unitsList, setUnitsList] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const getList = async (rowsPerPage, page) => {
    const filtersUnits = searchInput.length ? { label: searchInput } : null;
    const { data: listUnits } = await client.query({
      query: GET_UNITS_LIST,
      variables: {
        cursor: { first: rowsPerPage, offset: page * rowsPerPage },
        filters: filtersUnits,
      },
      fetchPolicy: 'no-cache',
    });
    const { data: unitsUsers } = await client.query({
      query: GET_UNITS_USERS,
      variables: { filters: {} },
      fetchPolicy: 'no-cache',
    });
    const mappedList = mapUnitsList(listUnits.getCampus.listUnits.list, unitsUsers.listUsers.list);
    return setUnitsList({ list: mappedList, total: listUnits.getCampus.listUnits.meta.total });
  };

  return (
    <IndexAdministration
      getList={getList}
      list={unitsList ? unitsList.list : []}
      count={unitsList ? unitsList.total : 0}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      deleteMutation={DELETE_UNIT}
      tabData={createUnitData}
      columns={columns}
      subtitles={['Unités']}
    />
  );
}

export default UnitAdministration;

import React from 'react';
import gql from 'graphql-tag';
import IndexAdministration from '../../components/administration';

const columns = [
  { id: 'name', label: 'Nom' },
  { id: 'securityOfficer', label: 'Officer Sécurité' },
  { id: 'unitCorrespondent', label: 'Correspondant' },
];

const GET_UNITS_LIST = gql`
    query listUnits($cursor: OffsetCursor, $filters: UserFilters) {
        listUnits(cursor: $cursor, filters: $filters) {
            meta {
                offset
                first
                total
            }
            list {
                id
                label
            }
        }
    }
`;

const DELETE_UNIT = gql`
    mutation deleteUnit($id: String!) {
        deleteUnit(id: $id) {
            id
        }
    }
`;

const createUnitData = {
  createUserPath: '/administration/unites/creation',
  deleteText: 'Êtes-vous sûr de vouloir supprimer cette unité ?',
};

function UnitAdministration() {
  return (
    <IndexAdministration
      query={GET_UNITS_LIST}
      deleteMutation={DELETE_UNIT}
      tabData={createUnitData}
      columns={columns}
    />
  );
}

export default UnitAdministration;

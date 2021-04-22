import { InMemoryCache } from '@apollo/client/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import userEvent from '@testing-library/user-event';

import RowTreatments from '../../../../components/tables/rows/RowTreatmentsToTreat';
import { choicesArray } from '../../../../components/tables/TableTreatmentsToTreat';
import { activeRoleCacheVar, typePolicies } from '../../../../lib/apollo/cache';
import { GET_ACTIVE_ROLE } from '../../../../lib/apollo/queries';
import { ACCEPTED_STATUS } from '../../../../utils';
import { ROLES } from '../../../../utils/constants/enums';
import { render, screen } from '../../../../utils/tests/renderApollo';

const mockUpdate = jest.fn();
const mockColumns = [{ id: 'request' }, { id: 'visitor' }, { id: 'decision' }, { id: 'action' }];

jest.mock('../../../../lib/hooks/useDecisions', () => ({
    useDecisions: () => ({
        decisions: {
            '000_0001_000_00V1': {
                id: '000_00V1',
                request: { id: '000_0001' },
                choice: {
                    label: '',
                    validation: '',
                    tags: []
                }
            }
        },
        addDecision: mockUpdate
    })
}));

const mocks = [
    {
        request: {
            query: GET_ACTIVE_ROLE
        },
        result: {
            data: {}
        }
    }
];

const mockRow = {
    request: {
        id: '000_0001',
        period: 'Du 12 janvier au 16 janvier 2021',
        reason: 'Famille',
        owner: 'Patrick Chirac',
        places: 'MESSE, Bar PMU de la base'
    },
    visitor: {
        id: '000_00V1',
        firstname: 'Michel',
        lastname: 'Jospin',
        isInternal: 'MINARM',
        screened: ACCEPTED_STATUS,
        unit: 'Pastiche',
        employeeType: 'Present'
    }
};

describe('Component: rowTreatment', () => {
    let cache;

    beforeEach(() => {
        cache = new InMemoryCache({
            typePolicies
        });
    });
    it('feed & display correctly', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
            unit: ''
        });
        render(
            <Table>
                <TableBody>
                    <RowTreatments
                        columns={mockColumns}
                        row={mockRow}
                        treated={false}
                        choices={choicesArray(ROLES.ROLE_UNIT_CORRESPONDENT.role)}
                    />
                </TableBody>
            </Table>,
            { mocks, cache }
        );
        expect(screen.queryByText(/Michel Jospin/)).toBeInTheDocument();
        expect(screen.queryByText(/000_0001/)).toBeInTheDocument();
        expect(screen.queryByText(/ACCEPTER/)).toBeInTheDocument();

        expect(screen.queryByText(/VIP/)).not.toBeInTheDocument();
    });

    it('update correctly', () => {
        render(
            <Table>
                <TableBody>
                    <RowTreatments
                        treated={false}
                        columns={mockColumns}
                        row={mockRow}
                        choices={choicesArray(ROLES.ROLE_UNIT_CORRESPONDENT.role)}
                    />
                </TableBody>
            </Table>,
            { mocks, cache }
        );
        userEvent.click(screen.getByLabelText('ACCEPTER'));
        expect(mockUpdate).toHaveBeenCalled();
    });
});

import { InMemoryCache } from '@apollo/client/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import userEvent from '@testing-library/user-event';

import RowScreening from '../../../../components/tables/rows/RowScreening';
import { columns, choices } from '../../../../components/tables/TableScreening';
import { typePolicies } from '../../../../lib/apollo/cache';
import { render, screen } from '../../../../utils/tests/renderApollo';

const mockUpdate = jest.fn();

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

const mockRow = {
    id: '000_0001',
    lastname: 'Jospin',
    firstname: 'Michel',
    birthday: '24/06/1995',
    birthplace: 'Paris',
    nationality: 'Française',
    isScreened: 'RAS'
};

describe('Component: rowScreening', () => {
    let cache;

    beforeEach(() => {
        cache = new InMemoryCache({
            typePolicies
        });
    });
    it('feed & display correctly', () => {
        render(
            <Table>
                <TableBody>
                    <RowScreening columns={columns} row={mockRow} choices={choices} />
                </TableBody>
            </Table>,
            { cache }
        );
        expect(screen.queryByText(/Française/)).not.toBeInTheDocument();
        expect(screen.getByText(/RAS/)).toBeInTheDocument();
        expect(screen.getByText(/RES/)).toBeInTheDocument();
    });

    it('update correctly', () => {
        render(
            <Table>
                <TableBody>
                    <RowScreening columns={columns} row={mockRow} choices={choices} />
                </TableBody>
            </Table>,
            { cache }
        );
        userEvent.click(screen.getByLabelText('RAS'));
        expect(mockUpdate).toHaveBeenCalled();
    });
});

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import userEvent from '@testing-library/user-event';

import RowRequest from '../../../../components/tables/rows/RowRequests';
import { render, screen } from '../../../../utils/tests/renderApollo';

const mockedDelete = jest.fn();
const mockColumns = [
    {
        id: 'id',
        label: '#N°'
    },
    {
        id: 'period',
        label: 'Période'
    },
    { id: 'reason', label: 'Motif' },
    {
        id: 'action',
        label: ''
    }
];

const mockRowCreated = {
    id: '000_0001',
    period: 'Du 12 janvier au 16 janvier 2021',
    reason: 'Famille',
    status: 'CREATED'
};

const mockRowDrafted = {
    id: '000_0001',
    period: 'Du 12 janvier au 16 janvier 2021',
    reason: 'Famille',
    status: 'DRAFTED'
};

describe('Component: rowRequest', () => {
    it('feed & display correctly', () => {
        render(
            <Table>
                <TableBody>
                    <RowRequest
                        onDelete={mockedDelete}
                        columns={mockColumns}
                        row={mockRowCreated}
                    />
                </TableBody>
            </Table>
        );
        expect(screen.queryByText(/000_0001/)).toBeInTheDocument();
    });

    it('delete correctly', () => {
        render(
            <Table>
                <TableBody>
                    <RowRequest
                        onDelete={mockedDelete}
                        columns={mockColumns}
                        row={mockRowCreated}
                    />
                </TableBody>
            </Table>
        );
        userEvent.click(screen.getByLabelText(/delete/i));
        expect(mockedDelete).toHaveBeenCalled();
    });

    it('cant delete if drafted', () => {
        render(
            <Table>
                <TableBody>
                    <RowRequest
                        onDelete={mockedDelete}
                        columns={mockColumns}
                        row={mockRowDrafted}
                    />
                </TableBody>
            </Table>
        );
        expect(screen.queryByLabelText(/delete/i)).not.toBeInTheDocument();
    });
});

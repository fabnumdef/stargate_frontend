import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import userEvent from '@testing-library/user-event';

import RowRequestsVisitors from '../../../../components/tables/rows/RowRequestsVisitors';
import { render, screen } from '../../../../utils/tests/renderApollo';

const mockedDelete = jest.fn();
const mockColumnsCreated = [
    {
        id: 'visitor',
        label: 'Visiteur(s)'
    },
    {
        id: 'company',
        label: 'Unité / Société',
        style: {
            width: 115
        }
    },
    { id: 'type', label: 'Type de visiteurs' },
    {
        id: 'status',
        label: 'Statut'
    },
    {
        id: 'action',
        label: ''
    }
];

const mockRow = {
    visitor: 'Stalone Silvester',
    company: 'Expandable',
    status: 'CREATED'
};

describe('Component: rowRequestVisitors', () => {
    it('feed & display correctly', () => {
        render(
            <Table>
                <TableBody>
                    <RowRequestsVisitors
                        onDelete={mockedDelete}
                        columns={mockColumnsCreated}
                        row={mockRow}
                    />
                </TableBody>
            </Table>
        );
        expect(screen.queryByText(/Stalone Silvester/)).toBeInTheDocument();
        expect(screen.getByTitle(/createdicon/i)).toBeInTheDocument();
    });

    it('delete correctly', () => {
        render(
            <Table>
                <TableBody>
                    <RowRequestsVisitors
                        onDelete={mockedDelete}
                        columns={mockColumnsCreated}
                        row={mockRow}
                    />
                </TableBody>
            </Table>
        );
        userEvent.click(screen.getByLabelText(/delete/i));
        expect(mockedDelete).toHaveBeenCalled();
    });
});

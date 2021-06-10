import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

import RowProcess from '../../../../components/tables/rows/RowProcess';
import { render, screen } from '../../../../utils/tests/renderApollo';
import { ROLES } from '../../../../utils/constants/enums';

const mockColumns = [
    {
        id: 'unit',
        label: 'Unité'
    },
    {
        id: 'steps',
        label: 'Workflow de validation'
    }
];

const mockRow = {
    unit: 'Expandables',
    steps: [
        {
            role: 'ROLE_UNIT_CORRESPONDENT',
            behavior: 'VALIDATION',
            state: { value: 'ACCEPTED', isOK: true }
        },
        {
            role: 'ROLE_SCREENING',
            behavior: 'ADVISEMENT',
            state: { value: null, isOK: null }
        },
        {
            role: 'ROLE_SECURITY_OFFICER',
            behavior: 'VALIDATION',
            state: { value: null, isOK: null }
        },
        {
            role: 'ROLE_ACCESS_OFFICE',
            behavior: 'VALIDATION',
            state: { value: null, isOK: null }
        }
    ]
};

describe('Component: rowProcess', () => {
    /** @todo test if .toHaveClass completed or error or anything else */
    it('feed & display correctly', () => {
        render(
            <Table>
                <TableBody>
                    <RowProcess columns={mockColumns} row={mockRow} />
                </TableBody>
            </Table>
        );
        expect(screen.queryByText(/expandables/i)).toBeInTheDocument();
        expect(screen.queryByText(ROLES.ROLE_UNIT_CORRESPONDENT.shortLabel)).toBeInTheDocument();
        expect(screen.queryByText(ROLES.ROLE_ACCESS_OFFICE.shortLabel)).toBeInTheDocument();
    });
});

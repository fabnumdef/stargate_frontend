import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import VisitorCell from '../../../../components/tables/cells/VisitorCell';

import { render, screen } from '../../../../utils/tests/renderApollo';

const mockVisitor = {
    firstname: 'Jacques',
    lastname: 'Chirac',
    isInternal: 'MINARM',
    compagny: 'Elysee',
    employeeType: 'Stagiaire'
};

describe('Component: VisitorCell', () => {
    it('display correctly if is CU', () => {
        render(
            <Table>
                <TableBody>
                    <TableRow>
                        <VisitorCell visitor={mockVisitor} />
                    </TableRow>
                </TableBody>
            </Table>
        );

        expect(screen.getByText(/Jacques/i)).toBeInTheDocument();
    });
});

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import RequestCell from '../../../../components/tables/cells/RequestCell';

import { activeRoleCacheVar } from '../../../../lib/apollo/cache';
import { ROLES } from '../../../../utils/constants/enums';
import { render, screen } from '../../../../utils/tests/renderApollo';

const mockRequest = {
    id: 'NAVAL-BASE20210409-1',
    period: 'du 24/12/2025 au 25/12/2025',
    owner: 'Jacques Chirac',
    places: 'Elysee',
    reason: 'oui'
};

describe('Component: RequestCell', () => {
    it('display correcly the cell for CU', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
            unit: '60111c31878c3e1190920895',
            unitLabel: 'CIRI'
        });

        render(
            <Table>
                <TableBody>
                    <TableRow>
                        <RequestCell request={mockRequest} />
                    </TableRow>
                </TableBody>
            </Table>
        );

        expect(screen.getByText(/Jacques Chirac/i)).toBeVisible();
    });

    it('display correcly the cell for OS', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_SECURITY_OFFICER.role,
            unit: '60111c31878c3e1190920895',
            unitLabel: 'CIRI'
        });

        render(
            <Table>
                <TableBody>
                    <TableRow>
                        <RequestCell request={mockRequest} />
                    </TableRow>
                </TableBody>
            </Table>
        );

        expect(screen.getByText(/Motif/i)).toBeVisible();
    });
});

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import DecisionsCell from '../../../../components/tables/cells/DecisionsCell';

import { activeRoleCacheVar } from '../../../../lib/apollo/cache';
import { ROLES } from '../../../../utils/constants/enums';
import { render, screen } from '../../../../utils/tests/renderApollo';

const mockVisitor = {
    units: [
        {
            label: 'centerParks',
            steps: [
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_UNIT_CORRESPONDENT',
                    state: {
                        isOK: true,
                        value: 'ACCEPTED'
                    }
                },
                {
                    behavior: 'ADVISEMENT',
                    role: 'ROLE_SCREENING',
                    state: {
                        isOK: true,
                        value: 'POSITIVE'
                    }
                },
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_SECURITY_OFFICER',
                    state: {
                        isOK: true,
                        value: 'REJECTED'
                    }
                },
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_ACCESS_OFFICE',
                    state: {
                        isOK: null,
                        value: null
                    }
                }
            ]
        }
    ]
};

describe('Component: DecisionsCell', () => {
    it('display correctly for Access office', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_ACCESS_OFFICE.role,
            unit: '60111c31878c3e1190920895',
            unitLabel: 'CIRI'
        });
        render(
            <Table>
                <TableBody>
                    <TableRow>
                        <DecisionsCell visitor={mockVisitor} />
                    </TableRow>
                </TableBody>
            </Table>
        );
        expect(screen.getByTitle(/icone refusée/i)).toBeInTheDocument();
    });

    it('display correctly for Security officer', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_SECURITY_OFFICER.role,
            unit: '60111c31878c3e1190920895',
            unitLabel: 'CIRI'
        });
        render(
            <Table>
                <TableBody>
                    <TableRow>
                        <DecisionsCell visitor={mockVisitor} />
                    </TableRow>
                </TableBody>
            </Table>
        );
        expect(screen.getByTitle(/icone RAS/i)).toBeInTheDocument();
    });
});

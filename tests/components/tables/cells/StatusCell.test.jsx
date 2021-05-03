import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import StatusCell from '../../../../components/tables/cells/StatusCell';

import { activeRoleCacheVar } from '../../../../lib/apollo/cache';
import { ROLES } from '../../../../utils/constants/enums';
import { render, screen } from '../../../../utils/tests/renderApollo';

const mockVisitor = {
    units: [
        {
            label: 'centerPark',
            steps: [
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_UNIT_CORRESPONDENT',
                    state: {
                        isOK: true,
                        tags: [],
                        value: 'ACCEPTED'
                    }
                },
                {
                    behavior: 'ADVISEMENT',
                    role: 'ROLE_SCREENING',
                    state: {
                        tags: [],
                        isOK: true,
                        value: 'POSITIVE'
                    }
                },
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_SECURITY_OFFICER',
                    state: {
                        isOK: true,
                        tags: ['VA'],
                        value: 'ACCEPTED'
                    }
                },
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_ACCESS_OFFICE',
                    state: {
                        isOK: true,
                        tags: ['VA'],
                        value: 'ACCEPTED'
                    }
                }
            ]
        },
        {
            label: 'JurassicPark',
            steps: [
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_UNIT_CORRESPONDENT',
                    state: {
                        isOK: true,
                        tags: [],
                        value: 'ACCEPTED'
                    }
                },
                {
                    behavior: 'ADVISEMENT',
                    role: 'ROLE_SCREENING',
                    state: {
                        isOK: true,
                        tags: [],
                        value: 'ACCEPTED'
                    }
                },
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_SECURITY_OFFICER',
                    state: {
                        isOK: true,
                        tags: ['VA'],
                        value: 'ACCEPTED'
                    }
                },
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_ACCESS_OFFICE',
                    state: {
                        isOK: true,
                        tags: ['VA'],
                        value: 'ACCEPTED'
                    }
                }
            ]
        },
        {
            label: 'Ogasawara National Park',
            steps: [
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_UNIT_CORRESPONDENT',
                    state: {
                        isOK: true,
                        tags: [],
                        value: 'ACCEPTED'
                    }
                },
                {
                    behavior: 'ADVISEMENT',
                    role: 'ROLE_SCREENING',
                    state: {
                        isOK: true,
                        tags: [],
                        value: 'ACCEPTED'
                    }
                },
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_SECURITY_OFFICER',
                    state: {
                        isOK: false,
                        tags: [],
                        value: 'REJECTED'
                    }
                },
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_ACCESS_OFFICE',
                    state: {
                        isOK: true,
                        tags: ['VA'],
                        value: 'ACCEPTED'
                    }
                }
            ]
        }
    ]
};

describe('Component: StatusCell', () => {
    it('display correctly for Access office', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_ACCESS_OFFICE.role,
            unit: '60111c31878c3e1190920895'
        });
        render(
            <Table>
                <TableBody>
                    <TableRow>
                        <StatusCell visitor={mockVisitor} />
                    </TableRow>
                </TableBody>
            </Table>
        );
        //check the display of accepted icone
        expect(screen.getByTitle(/icone validée/i)).toBeInTheDocument();
        expect(screen.getByText(/VA/i)).toBeInTheDocument();
    });

    it('display correctly for Security officer', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_SECURITY_OFFICER.role,
            unit: '60111c31878c3e1190920895',
            unitLabel: 'Ogasawara National Park'
        });
        render(
            <Table>
                <TableBody>
                    <TableRow>
                        <StatusCell visitor={mockVisitor} />
                    </TableRow>
                </TableBody>
            </Table>
        );
        expect(screen.getByTitle(/icone refusée/i)).toBeInTheDocument();
    });
    it('display correctly for UNIT CORRESPONDENT', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
            unit: '60111c31878c3e1190920895',
            unitLabel: 'Ogasawara National Park'
        });
        render(
            <Table>
                <TableBody>
                    <TableRow>
                        <StatusCell visitor={mockVisitor} />
                    </TableRow>
                </TableBody>
            </Table>
        );
        expect(screen.getByTitle(/icone validée/i)).toBeInTheDocument();
        expect(screen.getByText(/Accepté/i)).toBeInTheDocument();
    });
});

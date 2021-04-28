import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import DecisionsCell from '../../../../components/tables/cells/DecisionsCell';

import { activeRoleCacheVar } from '../../../../lib/apollo/cache';
import { ROLES } from '../../../../utils/constants/enums';
import { render, screen } from '../../../../utils/tests/renderApollo';

const modalOpen = jest.fn();

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
                        value: 'ACCEPTED'
                    }
                },
                {
                    behavior: 'ADVISEMENT',
                    role: 'ROLE_SCREENING',
                    state: {
                        isOK: false,
                        value: 'NEGATIVE'
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
        },
        {
            label: 'JurassicPark',
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
                        isOK: false,
                        value: 'NEGATIVE'
                    }
                },
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_SECURITY_OFFICER',
                    state: {
                        isOK: true,
                        value: 'ACCEPTED'
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
        },
        {
            label: 'Ogasawara National Park',
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
                        isOK: false,
                        value: 'NEGATIVE'
                    }
                },
                {
                    behavior: 'VALIDATION',
                    role: 'ROLE_SECURITY_OFFICER',
                    state: {
                        isOK: null,
                        value: null
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
                        <DecisionsCell visitor={mockVisitor} modalOpen={modalOpen} />
                    </TableRow>
                </TableBody>
            </Table>
        );
        //check the display of 2 icons (1 accepted / 1 rejected)
        expect(screen.getByTitle(/icone refusée/i)).toBeInTheDocument();
        expect(screen.getByTitle(/icone validée/i)).toBeInTheDocument();
        expect(screen.getByTitle(/icone en attente/i)).toBeInTheDocument();
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
                        <DecisionsCell visitor={mockVisitor} modalOpen={modalOpen} />
                    </TableRow>
                </TableBody>
            </Table>
        );
        expect(screen.getByTitle(/icone RES/i)).toBeInTheDocument();
    });
});

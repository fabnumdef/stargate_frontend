import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import ActionCell from '../../../../components/tables/cells/ActionCell';
import { activeRoleCacheVar } from '../../../../lib/apollo/cache';
import { ROLES } from '../../../../utils/constants/enums';
import { render, screen } from '../../../../utils/tests/renderApollo';
import { choicesArray } from '../../../../components/tables/TableTreatmentsToTreat';
import { DecisionsProvider } from '../../../../lib/hooks/useDecisions';
import userEvent from '@testing-library/user-event';

const decision = {
    request: { id: '000_0001' },
    id: '000_00V1'
};

describe('Component: DecisionsCell', () => {
    it('display correctly for SECURITY OFFICER', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_SECURITY_OFFICER.role,
            unit: '60111c31878c3e1190920895',
            unitLabel: 'CIRI'
        });
        render(
            <DecisionsProvider>
                <Table>
                    <TableBody>
                        <TableRow>
                            <ActionCell
                                choices={choicesArray(activeRoleCacheVar().role)}
                                decision={decision}
                            />
                        </TableRow>
                    </TableBody>
                </Table>
            </DecisionsProvider>
        );
        //check if all the choice for an OS are displayed
        expect(screen.getByText(/VL/i)).toBeVisible();
        expect(screen.getByText(/VA/i)).toBeVisible();
        expect(screen.getByText(/VIP/i)).toBeVisible();
        expect(screen.getByText(/REFUSER/i)).toBeVisible();
    });

    it('display correctly for ACCESS OFFICE', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_ACCESS_OFFICE.role,
            unit: '60111c31878c3e1190920895',
            unitLabel: 'CIRI'
        });
        render(
            <DecisionsProvider>
                <Table>
                    <TableBody>
                        <TableRow>
                            <ActionCell
                                choices={choicesArray(activeRoleCacheVar().role)}
                                decision={decision}
                            />
                        </TableRow>
                    </TableBody>
                </Table>
            </DecisionsProvider>
        );
        //check if all the choice for ACCESS OFFICE are displayed
        expect(screen.getByText(/VL/i)).toBeVisible();
        expect(screen.getByText(/VA/i)).toBeVisible();
        expect(screen.getByText(/Autre choix/i)).toBeVisible();
        expect(screen.getByText(/REFUSER/i)).toBeVisible();

        //click on VA and verify that it's checked
        userEvent.click(screen.getByText(/VA/i));
        expect(screen.getByRole('radio', { name: /VA/i }).checked).toEqual(true);
        //click on VA again and verify that it's not checked anymore
        userEvent.click(screen.getByText(/VA/i));
        expect(screen.getByRole('radio', { name: /VA/i }).checked).toEqual(false);
    });

    it('display correctly for UNIT CORRESPONDENT', () => {
        activeRoleCacheVar({
            role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
            unit: '60111c31878c3e1190920895',
            unitLabel: 'CIRI'
        });
        render(
            <DecisionsProvider>
                <Table>
                    <TableBody>
                        <TableRow>
                            <ActionCell
                                choices={choicesArray(activeRoleCacheVar().role)}
                                decision={decision}
                            />
                        </TableRow>
                    </TableBody>
                </Table>
            </DecisionsProvider>
        );
        //check if all the choice for a CU are displayed
        expect(screen.getByText(/ACCEPTER/i)).toBeVisible();
        expect(screen.getByText(/REFUSER/i)).toBeVisible();
    });
});

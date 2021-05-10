import userEvent from '@testing-library/user-event';

import Drawer, { GET_MENU_DRAWER } from '../../../components/layout/Drawer';
import { render, screen, waitFor } from '../../../utils/tests/renderApollo';

import { InMemoryCache } from '@apollo/client/core';
import { activeRoleCacheVar, campusIdVar, typePolicies } from '../../../lib/apollo/cache';

let mockPathname;
let mockPush = jest.fn();

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: mockPush,
        pathname: mockPathname
    })
}));

const mocks = [
    {
        request: {
            query: GET_MENU_DRAWER,
            variables: {
                campusId: 'NAVAL-BASE'
            }
        },
        result: {
            data: {
                getCampus: {
                    label: 'Base navale',
                    __typename: 'Campus'
                }
            }
        }
    }
];

describe('Container: Drawer', () => {
    let cache;

    beforeEach(() => {
        cache = new InMemoryCache({ typePolicies });
        campusIdVar('NAVAL-BASE');
    });

    it('display the drawer for the admin', async () => {
        activeRoleCacheVar({
            role: 'ROLE_ADMIN',
            unit: '60111c31878c3e1190920895',
            unitLabel: 'CIRI'
        });
        render(<Drawer drawerWidth={260} />, { mocks, cache });

        await waitFor(() => {
            expect(screen.getByText(/base navale/i)).toBeInTheDocument();
            userEvent.click(
                screen.getByRole('button', {
                    name: /administration/i
                })
            );
        });
    });
});

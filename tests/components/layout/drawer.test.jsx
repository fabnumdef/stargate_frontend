import userEvent from '@testing-library/user-event';

import Drawer from '../../../components/layout/Drawer';
import { render, screen, waitFor } from '../../../utils/tests/renderApollo';

import { InMemoryCache } from '@apollo/client/core';
import { activeRoleCacheVar, typePolicies } from '../../../lib/apollo/cache';

let mockPathname;
let mockPush = jest.fn();

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: mockPush,
        pathname: mockPathname
    })
}));

describe('Container: Drawer', () => {
    let cache;

    beforeEach(() => {
        cache = new InMemoryCache({ typePolicies });
    });

    it('display the drawer for the admin', async () => {
        activeRoleCacheVar({
            role: 'ROLE_ADMIN',
            unit: '60111c31878c3e1190920895',
            unitLabel: 'CIRI'
        });
        render(<Drawer drawerWidth={260} />, { cache });
        expect(screen.getByRole('img', { name: /stargate/i })).toBeInTheDocument();

        await waitFor(() =>
            userEvent.click(
                screen.getByRole('button', {
                    name: /administration/i
                })
            )
        );

        await waitFor(() =>
            userEvent.click(
                screen.getByRole('button', {
                    name: /unité/i
                })
            )
        );
        expect(mockPush).toHaveBeenCalledWith('/administration/unites');
    });
});

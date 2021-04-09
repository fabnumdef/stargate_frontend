import SeeMoreOrLess from '../../../components/styled/common/SeeMoreOrLess';

import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '../../../utils/tests/renderApollo';

describe('Component: SeeMoreOrLess', () => {
    it('display correctly the reason cell for CU', () => {
        render(
            <SeeMoreOrLess>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</SeeMoreOrLess>
        );
        expect(screen.getByText(/Lorem ipsum/i)).toBeInTheDocument();
    });

    it("Trigger the 'voir plus' / 'voir moins' button", async () => {
        render(
            <SeeMoreOrLess>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consectetur enim enim,
                eu dapibus libero cursus id. In eros quam, convallis quis nulla in, laoreet ornare
                nibh. Cras dignissim sit amet arcu nec mattis. Vivamus rutrum, metus in dignissim
                tempor, mi tellus efficitur risus, a volutpat augue enim eu est.
            </SeeMoreOrLess>
        );
        expect(screen.getByText(/voir plus/i)).toBeVisible();

        await waitFor(() => {
            userEvent.click(screen.getByText(/voir plus/i));
        });
        expect(screen.getByText(/volutpat augue/i)).toBeVisible();

        await waitFor(() => {
            userEvent.click(screen.getByText(/voir moins/i));
        });
        expect(screen.getByText(/voir plus/i)).toBeVisible();
    });
});

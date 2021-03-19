import userEvent from '@testing-library/user-event';

import ForgotPassForm, { RESET_PASSWORD } from '../../../components/loginForms/ForgotPassForm';
import { render, screen, waitFor } from '../../../utils/tests/renderApollo';

const mocks = [
    {
        request: {
            query: RESET_PASSWORD,
            variables: {
                email: 'IAmAnEmail@mail.fr'
            }
        },
        result: jest.fn(() => ({
            data: {}
        }))
    }
];

describe('Container: ForgotPassForm', () => {
    beforeEach(() => {
        render(<ForgotPassForm />, { mocks });
    });

    it('display the forgottenPasswordForm', () => {
        expect(screen.getByText(/Merci d'entrer votre identifiant./)).toBeVisible();
    });
    it('calls reset_password from forgetpassword', async () => {
        const mockResult = mocks[0].result;

        userEvent.type(screen.getByRole('textbox'), 'IAmAnEmail@mail.fr');

        //Submit the form
        await waitFor(() => {
            userEvent.click(
                screen.getByRole('button', {
                    name: /envoyer/i
                })
            );
        });

        await waitFor(() => {
            expect(mockResult).toHaveBeenCalled();
        });
    });
});

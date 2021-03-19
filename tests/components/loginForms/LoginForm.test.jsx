import userEvent from '@testing-library/user-event';

import LoginForm from '../../../components/loginForms/LoginForm';
import { render, screen, waitFor } from '../../../utils/tests/renderApollo';

const mockSignIn = jest.fn();

jest.mock('../../../lib/loginContext', () => ({
    useLogin: () => ({ signIn: mockSignIn })
}));

describe('Container: LoginForm', () => {
    beforeEach(() => {
        render(<LoginForm />);
    });

    it('display correctly', () => {
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    });
    it('display an unreadable password', () => {
        userEvent.type(screen.getByLabelText('Mot de passe'), 'IAmAPassword');
        expect(screen.getByDisplayValue('IAmAPassword')).toHaveAttribute('type', 'password');
    });

    it('display an email and a readable password', () => {
        userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'IAmAnEmail');
        userEvent.type(screen.getByLabelText('Mot de passe'), 'IAmAPassword');
        userEvent.click(screen.getByLabelText('toggle password visibility'));
        expect(screen.getByDisplayValue('IAmAnEmail')).toBeVisible();
        expect(screen.getByDisplayValue('IAmAPassword')).toHaveAttribute('type', 'text');
    });

    it('validate empty user inputs, and provides error messages', async () => {
        userEvent.type(screen.getByRole('textbox', { name: /Email/i }), '');
        userEvent.type(screen.getByLabelText('Mot de passe'), '');
        await waitFor(() =>
            userEvent.click(
                screen.getByRole('button', {
                    name: /Se connecter/i
                })
            )
        );
        expect(screen.getByText(/l'adresse mail est obligatoire\./i)).toBeInTheDocument();
        expect(screen.getByText(/le mot de passe est obligatoire\./i)).toBeInTheDocument();
    });

    it('submit button calls signin method', async () => {
        userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'IAmAnEmail');
        userEvent.type(screen.getByLabelText('Mot de passe'), 'IAmAPassword');
        userEvent.click(screen.getByRole('button', { name: /Se connecter/i }));
        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('IAmAnEmail', 'IAmAPassword');
        });
    });
});

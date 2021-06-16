import { InMemoryCache } from '@apollo/client/core';
import userEvent from '@testing-library/user-event';
import preloadAll from 'jest-next-dynamic';

import { RESET_PASSWORD } from '../../../components/login/ForgotPassForm';
import { activeRoleCacheVar, isLoggedInVar, typePolicies } from '../../../lib/apollo/cache';
import { INIT_CACHE } from '../../../lib/apollo/queries';
import { LOGIN, LoginContextProvider } from '../../../lib/loginContext';
import { GET_ME } from '../../../lib/apollo/queries';
import { STATE_REQUEST } from '../../../utils/constants/enums';
import { render, screen, waitFor } from '../../../utils/tests/renderApollo';

jest.mock('../../../utils', () => ({
    tokenDuration: () => ({ expiredToken: false })
}));

jest.mock('next/router', () => ({
    useRouter() {
        return {
            push: () => {}
        };
    }
}));

const mocks = [
    {
        request: {
            query: LOGIN,
            variables: {
                email: 'IAmAnEmail',
                password: 'IAmAPassword',
                token: null
            }
        },
        result: jest.fn(() => ({
            data: {
                login: {
                    jwt: 'token'
                }
            }
        }))
    },
    {
        request: {
            query: GET_ME
        },
        result: {
            data: {
                me: {
                    id: '60111c31878c3e11909208bd',
                    firstname: 'CU',
                    lastname: 'CIRI',
                    roles: [
                        {
                            role: 'ROLE_UNIT_CORRESPONDENT',
                            campuses: [
                                {
                                    id: 'NAVAL-BASE',
                                    label: 'Base Navale',
                                    __typename: 'Campus'
                                }
                            ],
                            units: [
                                {
                                    id: '60111c31878c3e1190920895',
                                    label: 'CIRI',
                                    __typename: 'Unit'
                                }
                            ],
                            __typename: 'UserRole'
                        }
                    ],
                    email: {
                        original: 'cu.ciri@localhost',
                        __typename: 'UserEmail'
                    },
                    __typename: 'User'
                }
            }
        }
    },
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
    },
    {
        request: {
            query: INIT_CACHE,
            variables: {
                campusId: 'NAVAL-BASE',
                as: { role: 'ROLE_UNIT_CORRESPONDENT', unit: '60111c31878c3e1190920895' },
                cursor: { offset: 0, first: 50 },
                filterCreated: { status: STATE_REQUEST.STATE_CREATED.state },
                filterTreated: {
                    status: [
                        STATE_REQUEST.STATE_CANCELED.state,
                        STATE_REQUEST.STATE_ACCEPTED.state,
                        STATE_REQUEST.STATE_MIXED.state,
                        STATE_REQUEST.STATE_REJECTED.state
                    ]
                }
            }
        },
        result: jest.fn(() => ({ data: {} }))
    }
];

describe('Container: LoginContext', () => {
    let cache;

    beforeEach(async () => {
        await preloadAll();

        cache = new InMemoryCache({ typePolicies });

        isLoggedInVar(false);

        render(
            <LoginContextProvider clearCache={jest.fn()}>{'LOGGED'}</LoginContextProvider>,
            { mocks, cache, addTypename: false } // addTypename usefull for fragments
        );
    });
    it('display correctly Login if not logged', async () => {
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
        expect(screen.getByLabelText('Mot de passe')).toBeVisible();
    });

    it('display correctly children if logged', async () => {
        isLoggedInVar(true);
        await waitFor(() => {
            expect(screen.getByText('LOGGED')).toBeInTheDocument();
        });
    });

    it('display the forgottenPasswordForm', () => {
        expect(screen.getByRole('textbox', { name: /Email/i })).toBeVisible();
        userEvent.click(screen.getByText(/Mot de passe perdu ?/));
        expect(screen.getByText(/Merci d'entrer votre identifiant./)).toBeVisible();
    });

    it('allows the user to login successfully', async () => {
        const mockResult = mocks[0].result;
        expect(isLoggedInVar()).toBeFalsy();
        userEvent.type(screen.getByRole('textbox', { name: /Email/i }), 'IAmAnEmail');
        userEvent.type(screen.getByLabelText('Mot de passe'), 'IAmAPassword');
        //Submit the form
        await waitFor(() => {
            userEvent.click(
                screen.getByRole('button', {
                    name: /Se connecter/i
                })
            );
        });

        await waitFor(() => {
            expect(mockResult).toHaveBeenCalled();
            expect(activeRoleCacheVar()).toEqual({
                role: 'ROLE_UNIT_CORRESPONDENT',
                unit: '60111c31878c3e1190920895',
                unitLabel: 'CIRI'
            });

            expect(isLoggedInVar()).toBeTruthy();
        });
    });

    it('calls reset_password from forgetpassword', async () => {
        const mockResult = mocks[2].result;

        userEvent.click(screen.getByText(/Mot de passe perdu ?/));
        expect(screen.getByText(/Merci d'entrer votre identifiant./)).toBeVisible();
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

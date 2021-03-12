import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { createContext, useCallback, useContext } from 'react';

import { tokenDuration } from '../utils';
import { activeRoleCacheVar, campusIdVar, isLoggedInVar } from './apollo/cache';
import { IS_LOGGED_IN } from './apollo/queries';
import { useSnackBar } from './hooks/snackbar';

export const LOGIN = gql`
    mutation login($email: EmailAddress!, $password: String, $token: String) {
        login(email: $email, password: $password, token: $token) {
            jwt
        }
    }
`;

const AUTH_RENEW = gql`
    mutation jwtRefresh {
        jwtRefresh {
            jwt
        }
    }
`;

export const GET_ME = gql`
    query getMe {
        me {
            id
            firstname
            lastname
            roles {
                role
                campuses {
                    id
                    label
                }
                units {
                    id
                    label
                }
            }
            email {
                original
            }
        }
    }
`;

export const LoginContext = createContext();
export const useLogin = () => useContext(LoginContext);

const Login = dynamic(() => import('../containers/login'));

/**
 * Context provider for the login logic
 * @param {*} param0
 * @returns {error, loading, signIn, signOut} some methods to connect and disconnect and their states logics
 */
export function LoginContextProvider({ children, clearCache }) {
    const {
        client,
        data: { isLoggedIn }
    } = useQuery(IS_LOGGED_IN);

    const { addAlert } = useSnackBar();

    /**
     * Disconnect and clear the cache
     * @param alert message to display
     */
    const signOut = useCallback(async (alert = false) => {
        isLoggedInVar(false);
        clearCache();
        localStorage.clear();
        if (alert) addAlert(alert);
    }, []);

    const [getUserData] = useLazyQuery(GET_ME, {
        onCompleted: (d) => {
            if (!d.me.roles.length) {
                return signOut({
                    message:
                        "Vous ne disposez d'aucun rôle sur Stargate. Merci de contacter un administrateur",
                    severity: 'error'
                });
            }

            const activeRoleNumber =
                !localStorage.getItem('activeRoleNumber') ||
                localStorage.getItem('activeRoleNumber') > d.me.roles.length - 1
                    ? 0
                    : localStorage.getItem('activeRoleNumber');

            const newRole = d.me.roles[activeRoleNumber].units[0]
                ? {
                      role: d.me.roles[activeRoleNumber].role,
                      unit: d.me.roles[activeRoleNumber].units[0].id
                  }
                : { role: d.me.roles[activeRoleNumber].role, unit: null };

            isLoggedInVar(!tokenDuration().expiredToken);
            activeRoleCacheVar({ ...newRole });
            campusIdVar(d.me.roles[activeRoleNumber].campuses[0].id);
        },
        onError: () => {
            signOut({
                message: 'Erreur lors de la récupération de vos données, merci de vous reconnecter',
                severity: 'error'
            });
        }
    });

    const setToken = (token) => {
        if (!token) {
            localStorage.removeItem('token');
            return;
        }
        localStorage.setItem('token', token);
    };

    /** Mutation to refresh the jwt token*/
    const [authRenewMutation] = useMutation(AUTH_RENEW, {
        onCompleted: (d) => {
            setToken(d.jwtRefresh.jwt);
            authRenew();
        },
        onError: () => {
            signOut({ message: 'Session expirée', severity: 'warning' });
            clearTimeout((duration) => setTimeout(authRenew, duration));
        }
    });

    const authRenew = useCallback(() => {
        const reloadAuth = (duration) => setTimeout(authRenew, duration);
        if (!localStorage.getItem('token')) {
            clearTimeout(reloadAuth);
            signOut({ message: 'Session expirée', severity: 'warning' });
            return false;
        }

        const { renewTrigger, expIn, expiredToken } = tokenDuration();

        if (expiredToken) {
            signOut({ message: 'Session expirée', severity: 'warning' });
            clearTimeout(reloadAuth);
            return false;
        }
        if (expIn <= renewTrigger) {
            authRenewMutation();
            return true;
        }
        reloadAuth((expIn - renewTrigger) * 1000);
        return true;
    }, []);

    const [login, { error, loading }] = useMutation(LOGIN, {
        onCompleted: (d) => {
            /**
             *  If success: We store token
             *  Execute authRenew to refresh token management
             *  Get user data
             */
            setToken(d.login.jwt);
            localStorage.setItem('activeRoleNumber', 0);
            authRenew();
            getUserData();
        },
        onError: () => {
            addAlert({
                message: 'Identifiants incorrects',
                severity: 'error'
            });        },
        fetchPolicy: 'no-cache'
    });

    /**
     * Login method to signIn
     * @param email
     * @param password
     * @param resetToken
     */
    const signIn = useCallback((email, password, resetToken = null) => {
        return new Promise((resolve, reject) => {
            try {
                client
                    .resetStore()
                    .then(() => login({ variables: { email, password, token: resetToken } }));
            } catch {
                reject();
            }
        });
    });

    return (
        <LoginContext.Provider
            value={{
                error,
                loading,
                signIn,
                signOut,
                activeRole: activeRoleCacheVar()
            }}>
            {isLoggedIn ? children : <Login />}
        </LoginContext.Provider>
    );
}

LoginContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
    clearCache: PropTypes.func.isRequired
};

import { gql, useApolloClient, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { tokenDuration } from '../utils';
import { ROLES, STATE_REQUEST } from '../utils/constants/enums';
import { activeRoleCacheVar, campusIdVar, isLoggedInVar } from './apollo/cache';
import { GET_ME, INIT_CACHE, IS_LOGGED_IN } from './apollo/queries';
import { useSnackBar } from './hooks/snackbar';
import MdConnect from '../pages/md-connect';

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

export const LoginContext = createContext();
export const useLogin = () => useContext(LoginContext);

const Login = dynamic(() => import('../containers/login'));

/**
 * @component
 * Context provider for the login logic
 * @param {*} children components to display if logged
 * @param {*} clearCache handler to purge cache
 */
export function LoginContextProvider({ children }) {
    const client = useApolloClient();
    const router = useRouter();

    const {
        data: { isLoggedIn }
    } = useQuery(IS_LOGGED_IN);

    const { addAlert } = useSnackBar();

    /**
     * Disconnect and clear the cache
     * @param alert message to display
     */
    const signOut = (alert = false) => {
        client.resetStore().then(() => {
            client.cache.evict({ fieldName: 'me' });
            client.cache.evict({ fieldName: 'getCampus' });
            client.cache.gc();

            localStorage.removeItem('token');
            localStorage.removeItem('campusId');
            localStorage.removeItem('activeRole');
        });

        isLoggedInVar(false);
        router.push('/');

        if (alert) addAlert(alert);
    };

    const [getUserData] = useLazyQuery(GET_ME, {
        fetchPolicy: 'network-only',
        onCompleted: (d) => {
            if (!d.me.roles.length) {
                return signOut({
                    message:
                        "Vous ne disposez d'aucun rôle sur Stargate. Merci de contacter un administrateur",
                    severity: 'error'
                });
            }

            const activeRole =
                localStorage.getItem('activeRole') || d.me.roles[0]
                    ? {
                          role: d.me.roles[0].role,
                          unit: d.me.roles[0]?.units[0]?.id ?? null,
                          unitLabel: d.me.roles[0]?.units[0]?.label ?? null
                      }
                    : { role: d.me.roles[0].role, unit: null, unitLabel: null };

            const campusId =
                d.me.roles.find((r) => r.role === activeRole.role).campuses[0]?.id ?? '';

            // PrefetchData for the cache
            if (
                [
                    ROLES.ROLE_SCREENING.role,
                    ROLES.ROLE_UNIT_CORRESPONDENT.role,
                    ROLES.ROLE_SECURITY_OFFICER.role,
                    ROLES.ROLE_ACCESS_OFFICE.role
                ].includes(activeRole.role)
            ) {
                client.query({
                    query: INIT_CACHE,
                    variables: {
                        campusId,
                        as: { role: activeRole.role, unit: activeRole.unit },
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
                });
            }
            activeRoleCacheVar({ ...activeRole });
            campusIdVar(campusId);
            isLoggedInVar(true);
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

    const setUserConnection = async (token) => {
        setToken(token);
        await getUserData();
    };

    const [login, { error, loading }] = useMutation(LOGIN, {
        onCompleted: (d) => {
            /**
             *  If success: We store token
             *  Execute authRenew to refresh token management
             *  Get user data
             */
            setUserConnection(d.login.jwt);
        },
        onError: () => {
            addAlert({
                message: 'Identifiants incorrects',
                severity: 'error'
            });
        },
        fetchPolicy: 'no-cache'
    });

    /**
     * Login method to signIn
     * @param email
     * @param password
     * @param resetToken
     */
    const signIn = (email, password, resetToken = null) => {
        return new Promise((resolve, reject) => {
            try {
                login({ variables: { email, password, token: resetToken } });
            } catch {
                reject();
            }
        });
    };

    useEffect(() => {
        if (isLoggedIn) {
            authRenew();
        }
    }, [isLoggedIn]);

    const selectLandingComponent = () => {
        if (isLoggedIn) {
            return children;
        }
        if (router.pathname === '/md-connect') {
            return <MdConnect />;
        }
        return <Login />;
    };

    return (
        <LoginContext.Provider
            value={{
                error,
                loading,
                signIn,
                signOut,
                activeRole: activeRoleCacheVar(),
                setUserConnection
            }}>
            {selectLandingComponent()}
        </LoginContext.Provider>
    );
}

LoginContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
    clearCache: PropTypes.func
};

LoginContextProvider.defaultProps = {
    clearCache: () => {}
};

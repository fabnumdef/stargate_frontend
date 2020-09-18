import React, {
  createContext, useEffect, useState, useContext, useCallback, useMemo,
} from 'react';
import { useRouter } from 'next/router';
import {
  gql, useApolloClient, useLazyQuery, useMutation,
} from '@apollo/client';
import PropTypes from 'prop-types';
import { useSnackBar } from './hooks/snackbar';
import { urlAuthorization } from '../utils/permissions';
import { ROLES } from '../utils/constants/enums';

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

const GET_ME = gql`
    query getMe {
        me {
            id,
            firstname,
            lastname,
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

const INIT_CACHE = gql`
    query initCache {
        initializedCache
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
        }
        activeRoleCache {
            role
            unit
            unitLabel
        }
        campusId
    }
`;

const GET_INITIALIZEDCACHE = gql`
    query getInitCache {
        initializedCache @client
    }
`;

const GET_ROLE = gql`
    query getRole {
        activeRoleCache {
            role
            unit
            unitLabel
        }
    }
`;

export const LoginContext = createContext();
export const useLogin = () => useContext(LoginContext);

export function LoginContextProvider({ children }) {
  const client = useApolloClient();
  const router = useRouter();
  const { addAlert } = useSnackBar();

  const init = useMemo(() => {
    try {
      return client.readQuery({ query: GET_INITIALIZEDCACHE });
    } catch {
      return null;
    }
  }, [client]);

  const tokenDuration = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : undefined;
    if (!token) {
      return {
        expiredToken: true,
      };
    }
    const payload = token.split('.')[1];
    const { exp, iat } = JSON.parse(window.atob(payload));
    const cur = Math.floor(Date.now() / 1000);
    const duration = exp - iat;
    const renewTrigger = duration / 2;
    const expIn = exp - cur;
    const expiredToken = expIn <= 0;

    return {
      renewTrigger,
      expIn,
      expiredToken,
    };
  };

  const [isCacheInit, setIsCacheInit] = useState(init ? init.initializedCache : null);
  const [isLoggedUser, setIsLoggedUser] = useState(
    !tokenDuration().expiredToken,
  );

  const [activeRole, setActiveRole] = useState(() => {
    if (isCacheInit) {
      const data = client.readQuery({ query: GET_ROLE });
      return { ...data.activeRoleCache };
    }
    return { role: '', unit: '', unitLabel: '' };
  });


  const signOut = useCallback((alert = false) => {
    localStorage.clear();
    client.clearStore();
    router.push('/login');
    setIsLoggedUser(false);
    setIsCacheInit(false);
    if (alert) addAlert(alert);
  }, [addAlert, client, router]);

  const [getUserData, { data: meData, loading: meLoading, error: meError }] = useLazyQuery(GET_ME);

  const [authRenewMutation,
    { data: jwtData, loading: jwtLoading, error: jwtError },
  ] = useMutation(AUTH_RENEW);

  const [login, { data: loginData, loading: loginLoading, error: loginError }] = useMutation(LOGIN);

  const setToken = (token) => {
    localStorage.setItem('token', token);
  };

  const authRenew = useCallback(async () => {
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
  }, [authRenewMutation, signOut]);

  useEffect(() => {
    const onCompleted = (d) => {
      setToken(d.jwtRefresh.jwt);
      authRenew();
    };
    const onError = () => {
      signOut({ message: 'Session expirée', severity: 'warning' });
      clearTimeout((duration) => setTimeout(authRenew, duration));
    };

    if (onCompleted || onError) {
      if (onCompleted && !jwtLoading && !jwtError && jwtData) {
        onCompleted(jwtData);
      } else if (onError && !jwtLoading && jwtError) {
        onError();
      }
    }
  }, [authRenew, jwtData, jwtError, jwtLoading, signOut]);

  const signIn = (email, password, resetToken = null) => {
    try {
      login({ variables: { email, password, token: resetToken } });
    } catch (e) {
      console.error('Erreur serveur, merci de réessayer', e);
    }
  };

  useEffect(() => {
    const onCompleted = (d) => {
      setToken(d.login.jwt);
      localStorage.setItem('activeRoleNumber', 0);
      authRenew(setToken, signOut, client);
      getUserData();
    };

    const onError = (e) => {
      switch (e) {
        case `GraphQL error: Email "${router.query.email}" and password do not match.`:
          return addAlert({
            message: 'Mauvais identifiant et/ou mot de passe',
            severity: 'warning',
          });
        case 'GraphQL error: Password expired':
          return addAlert({ message: 'Mot de passe expiré', severity: 'warning' });
        case 'GraphQL error: Expired link':
          return signOut({
            message: 'Lien expiré, merci de refaire une demande de mot de passe',
            severity: 'warning',
          });
        default:
          return signOut({ message: 'Erreur serveur, merci de réessayer', severity: 'warning' });
      }
    };

    if (onCompleted || onError) {
      if (onCompleted && !loginLoading && !loginError && loginData) {
        onCompleted(loginData);
      } else if (onError && !loginLoading && loginError) {
        onError(loginError);
      }
    }
  }, [loginLoading, loginData, loginError]);

  useEffect(() => {
    const onCompleted = (d) => {
      if (!d.me.roles.length) {
        signOut({ message: 'Vous ne disposez d\'aucun rôle sur Stargate. Merci de contacter un administrateur', severity: 'error' });
      }

      const activeRoleNumber = localStorage.getItem('activeRoleNumber') || 0;

      const newRole = d.me.roles[activeRoleNumber].units[0]
        ? {
          role: d.me.roles[activeRoleNumber].role,
          unit: d.me.roles[activeRoleNumber].units[0].id,
          unitLabel: d.me.roles[activeRoleNumber].units[0].label,
        }
        : { role: d.me.roles[activeRoleNumber].role, unit: null, unitLabel: null };

      setActiveRole(newRole);

      const campusId = d.me.roles[activeRoleNumber].campuses[0]
        ? d.me.roles[activeRoleNumber].campuses[0].id
        : null;

      client.writeQuery({
        query: INIT_CACHE,
        data: {
          initializedCache: true,
          me: d.me,
          activeRoleCache: { ...newRole },
          campusId,
        },
      });
      setIsCacheInit(true);
      setIsLoggedUser(true);
    };

    const onError = () => {
      setIsCacheInit(false);
      signOut({ message: 'Erreur lors de la récupération de vos données, merci de vous reconnecter', severity: 'error' });
    };

    if (onCompleted || onError) {
      if (onCompleted && !meLoading && !meError && meData) {
        onCompleted(meData);
      } else if (onError && !meLoading && meError) {
        onError();
      }
    }
  }, [meData, meLoading, meError, client]);

  useEffect(() => {
    if (router.query.token && !isLoggedUser) {
      signIn(decodeURIComponent(router.query.email), null, router.query.token);
    }

    if (!router.query.token) {
      if (isLoggedUser && !isCacheInit) {
        authRenew();
        getUserData();
      }
      if (!isLoggedUser && router.pathname !== '/login') {
        router.push('/login');
      }
    }

    if ((isLoggedUser
      && router.pathname === '/login') || (isCacheInit && !urlAuthorization(router.pathname, activeRole.role))
    ) {
      router.push(
        (activeRole.role === ROLES.ROLE_SUPERADMIN.role
          || activeRole.role === ROLES.ROLE_ADMIN.role)
          ? '/administration/utilisateurs'
          : '/',
      );
    }
  }, [isLoggedUser, activeRole, isCacheInit]);


  return (
    <LoginContext.Provider value={{
      signIn,
      signOut,
      setActiveRole,
      activeRole,
    }}
    >
      {((isLoggedUser && !isCacheInit)
      || (!isLoggedUser && router.pathname !== '/login')
      || (activeRole && !urlAuthorization(router.pathname, activeRole.role))) ? '' : children}
    </LoginContext.Provider>
  );
}

LoginContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

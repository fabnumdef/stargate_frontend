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

    if (expiredToken) {
      localStorage.clear();
    }

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


  const signOut = useCallback(async (alert = false) => {
    localStorage.clear();
    await client.cache.reset();
    await client.clearStore();
    await router.push('/login');
    setIsLoggedUser(false);
    setIsCacheInit(false);
    if (alert) addAlert(alert);
  }, [addAlert, client, router]);

  const [getUserData, { data: meData, loading: meLoading, error: meError }] = useLazyQuery(GET_ME);

  const setToken = (token) => {
    localStorage.setItem('token', token);
  };

  /* eslint-disable no-use-before-define */
  const [authRenewMutation] = useMutation(AUTH_RENEW, {
    onCompleted: (d) => {
      setToken(d.jwtRefresh.jwt);
      authRenew();
    },

    onError: () => {
      signOut({ message: 'Session expirée', severity: 'warning' });
      clearTimeout((duration) => setTimeout(authRenew, duration));
    },
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
  }, [authRenewMutation, signOut]);


  const [login] = useMutation(LOGIN, {
    onCompleted: (d) => {
      setToken(d.login.jwt);
      localStorage.setItem('activeRoleNumber', 0);
      authRenew(setToken, signOut, client);
      getUserData();
    },
    onError: (e) => {
      switch (e.message) {
        case `GraphQL error: Email "${router.query.email}" and password do not match.`:
          addAlert({
            message: 'Mauvais identifiant et/ou mot de passe',
            severity: 'warning',
          });
          break;
        case 'GraphQL error: Password expired':
          addAlert({ message: 'Mot de passe expiré', severity: 'warning' });
          break;
        case 'GraphQL error: Expired link':
          signOut({
            message: 'Lien expiré, merci de refaire une demande de mot de passe',
            severity: 'warning',
          });
          break;
        default:
          signOut({ message: 'Erreur serveur, merci de réessayer', severity: 'warning' });
          break;
      }
    },
  });


  const signIn = useCallback((email, password, resetToken = null) => {
    login({ variables: { email, password, token: resetToken } });
  });

  useEffect(() => {
    const onCompleted = (d) => {
      if (!d.me.roles.length) {
        return signOut({ message: 'Vous ne disposez d\'aucun rôle sur Stargate. Merci de contacter un administrateur', severity: 'error' });
      }

      const activeRoleNumber = !localStorage.getItem('activeRoleNumber') || localStorage.getItem('activeRoleNumber') > d.me.roles.length - 1
        ? 0
        : localStorage.getItem('activeRoleNumber');

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
      return setIsLoggedUser(true);
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
  }, [meData, meLoading, meError]);


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

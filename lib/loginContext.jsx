import React, {
  createContext, useEffect, useState, useContext,
} from 'react';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useSnackBar } from './ui-providers/snackbar';
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

export function LoginContextProvider(props) {
  const { children, client } = props;

  const router = useRouter();
  const { addAlert } = useSnackBar();

  const init = client.readQuery({ query: GET_INITIALIZEDCACHE });

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

  const signOut = (alert = false) => {
    router.push('/login');
    setIsLoggedUser(false);
    localStorage.clear();
    client.resetStore();
    if (alert) addAlert(alert);
  };

  const getUserData = async () => {
    try {
      const { data: { me } } = await client.query({ query: GET_ME });
      const activeRoleNumber = localStorage.getItem('activeRoleNumber') || 0;

      const newRole = me.roles[activeRoleNumber].units[0]
        ? {
          role: me.roles[activeRoleNumber].role,
          unit: me.roles[activeRoleNumber].units[0].id,
          unitLabel: me.roles[activeRoleNumber].units[0].label,
        }
        : { role: me.roles[activeRoleNumber].role, unit: null, unitLabel: null };

      setActiveRole(newRole);

      const campusId = me.roles[activeRoleNumber].campuses[0]
        ? me.roles[activeRoleNumber].campuses[0].id
        : null;

      await client.cache.writeQuery({
        query: INIT_CACHE,
        data: {
          initializedCache: true,
          me,
          activeRoleCache: { ...newRole, __typename: 'activeRoleCache' },
          campusId,
        },
      });
      setIsCacheInit(true);
      return me;
    } catch (e) {
      setIsCacheInit(true);
      return signOut({ message: 'Erreur lors de la récupération de vos données, merci de vous reconnecter', severity: 'error' });
    }
  };

  const setToken = (token) => {
    localStorage.setItem('token', token);
  };

  const authRenew = async () => {
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
      try {
        const {
          data: {
            jwtRefresh: { jwt },
          },
        } = await client.mutate({ mutation: AUTH_RENEW });
        setToken(jwt);
        authRenew();
        return true;
      } catch (error) {
        signOut({ message: 'Session expirée', severity: 'warning' });
        clearTimeout(reloadAuth);
        return false;
      }
    } else {
      reloadAuth((expIn - renewTrigger) * 1000);
      return true;
    }
  };

  const signIn = async (email, password, resetToken = null) => {
    try {
      const {
        data: {
          login: { jwt },
        },
      } = await client.mutate({
        mutation: LOGIN,
        variables: { email, password, token: resetToken },
      });
      setToken(jwt);
      setIsLoggedUser(true);
      localStorage.setItem('activeRoleNumber', 0);
      await authRenew(setToken, signOut, client);
      return getUserData();
    } catch (e) {
      switch (e.message) {
        case `GraphQL error: Email "${email}" and password do not match.`:
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
    }
  };

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

  if ((isLoggedUser && !isCacheInit) || (!isLoggedUser && router.pathname !== '/login') || (activeRole && !urlAuthorization(router.pathname, activeRole.role))) {
    return <div />;
  }

  return (
    <LoginContext.Provider value={{
      signIn,
      signOut,
      setActiveRole,
      activeRole,
    }}
    >
      {children}
    </LoginContext.Provider>
  );
}

LoginContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  client: PropTypes.shape({
    readQuery: PropTypes.func.isRequired,
    resetStore: PropTypes.func.isRequired,
    mutate: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired,
    cache: PropTypes.shape({
      writeData: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

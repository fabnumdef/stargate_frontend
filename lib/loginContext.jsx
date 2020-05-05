import React, {
  createContext, useEffect, useState, useContext,
} from 'react';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useSnackBar } from './ui-providers/snackbar';

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
      firstname
      lastname
    }
  }
`;

export const LoginContext = createContext();
export const useLogin = () => useContext(LoginContext);

export function LoginContextProvider(props) {
  const { children, client } = props;
  const router = useRouter();
  const { addAlert } = useSnackBar();

  const [isLoggedUser, setIsLoggedUser] = useState(
    typeof window !== 'undefined' ? !!localStorage.getItem('token') : undefined,
  );
  const [resetPass, setResetPass] = useState(() => {
    if (router.query.token && router.query.email) {
      return {
        email: router.query.email,
        token: router.query.token,
      };
    }
    return false;
  });
  const [authRenewOn, setAuthRenew] = useState(false);

  const setToken = (token) => {
    localStorage.setItem('token', token);
  };

  const signOut = (alert = false) => {
    router.push('/login');
    setIsLoggedUser(false);
    localStorage.clear();
    client.resetStore();
    if (alert) addAlert(alert);
  };

  const authRenew = async () => {
    const reloadAuth = (duration) => setTimeout(authRenew, duration);
    if (!localStorage.getItem('token')) {
      clearTimeout(reloadAuth);
      return signOut({ message: 'Session expirée', severity: 'warning' });
    }

    const payload = localStorage.getItem('token').split('.')[1];
    const { exp, iat } = JSON.parse(window.atob(payload));
    const cur = Math.floor(Date.now() / 1000);
    const duration = exp - iat;
    const renewTrigger = duration / 2;
    const expIn = exp - cur;
    if (expIn <= 0) {
      signOut({ message: 'Session expirée', severity: 'warning' });
      clearTimeout(reloadAuth);
    } else if (expIn <= renewTrigger) {
      try {
        const {
          data: {
            jwtRefresh: { jwt },
          },
        } = await client.mutate({ mutation: AUTH_RENEW });
        setToken(jwt);
        return authRenew();
      } catch (error) {
        signOut({ message: 'Session expirée', severity: 'warning' });
        clearTimeout(reloadAuth);
      }
    } else {
      return reloadAuth((expIn - renewTrigger) * 1000);
    }
    return null;
  };

  const getUserData = async () => {
    try {
      const { data } = await client.query({ query: GET_ME });
      client.cache.writeData({ data });
    } catch (e) {
      console.error(e);
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
      await authRenew(setToken, signOut, client);
      setAuthRenew(true);
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
    async function resetPassSignIn(email, token) {
      await signIn(decodeURIComponent(email), null, token);
      setResetPass(false);
    }

    if (resetPass) {
      const { email, token } = resetPass;
      resetPassSignIn(email, token);
    }

    const token = localStorage.getItem('token');
    if (!token && !resetPass) {
      signOut();
    }

    if (token && !authRenewOn) {
      authRenew();
      setAuthRenew(true);
    }

    if (isLoggedUser && router.pathname === '/login') {
      router.push('/');
    }
  }, [isLoggedUser]);

  if (!isLoggedUser && children.type.name !== 'LoginPage') {
    return <div />;
  }

  return <LoginContext.Provider value={{ signIn, signOut }}>{children}</LoginContext.Provider>;
}

LoginContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
    mutate: PropTypes.func.isRequired,
    query: PropTypes.func.isRequired,
    cache: PropTypes.shape({
      writeData: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

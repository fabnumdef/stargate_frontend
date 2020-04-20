import React, {
  createContext, useEffect, useState, useContext,
} from 'react';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const AUTH_RENEW = gql`
    mutation jwtRefresh {
        jwtRefresh {
            jwt
        }
    }
`;

export const LoginContext = createContext();
export const useLogin = () => useContext(LoginContext);

export function LoginContextProvider(props) {
  const { children, client } = props;
  const router = useRouter();

  const [isLoggedUser, setIsLoggedUser] = useState(
    typeof window !== 'undefined' ? !!localStorage.getItem('token') : undefined,
  );
  const [authRenewOn, setAuthRenew] = useState(false);

  const setToken = (token) => {
    localStorage.setItem('token', token);
  };

  const signOut = () => {
    setIsLoggedUser(false);
    localStorage.clear();
    client.resetStore();
  };

  const authRenew = async () => {
    const payload = localStorage.getItem('token')
      .split('.')[1];
    const { exp, iat } = JSON.parse(window.atob(payload));
    const cur = Math.floor(Date.now() / 1000);
    const duration = exp - iat;
    const renewTrigger = duration / 2;
    const expIn = exp - cur;
    if (expIn <= 0) {
      signOut();
      // TODO toast session expiré
    } else if (expIn <= renewTrigger) {
      try {
        const { data: { jwtRefresh: { jwt } } } = await client.mutate({ mutation: AUTH_RENEW });
        setToken(jwt);
        authRenew();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // TODO error message toast
          signOut();
        }
        setTimeout(authRenew, 60 * 1000);
      }
    } else {
      setTimeout(authRenew, (expIn - renewTrigger) * 1000);
    }
  };

  const signIn = (token) => {
    setToken(token);
    setIsLoggedUser(true);
    authRenew(setToken, signOut, client);
    setAuthRenew(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      signOut();
    }

    if (token && !authRenewOn) {
      authRenew();
      setAuthRenew(true);
    }

    if (isLoggedUser && router.pathname === '/login') {
      router.push('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedUser]);


  return (
    <LoginContext.Provider value={{ signIn, signOut }}>
      {children}
    </LoginContext.Provider>
  );
}

LoginContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  client: PropTypes.objectOf({
    resetStore: PropTypes.func.isRequired,
    mutate: PropTypes.func.isRequired,
  }).isRequired,
};

import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { useLogin } from '../../lib/loginContext';

const useStyles = makeStyles(() => ({
  formLogin: {
    marginTop: '30%',
  },
}));

export const LOGIN = gql`
    mutation login($email: EmailAddress!, $password: String!) {
        login(email: $email, password: $password) {
            jwt
        }
    }
`;

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useMutation(LOGIN);
  const ctx = useLogin();

  const classes = useStyles();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const { data: { login: { jwt } } } = await login({ variables: { email, password } });
      ctx.signIn(jwt);
    } catch (error) {
      // TODO put toast messages for errors
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} data-testid="login-form" className={classes.formLogin}>
        <label htmlFor="email">
          <input
            type="email"
            name="email"
            data-testid="login-form-email"
            placeholder="Identifiant"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
          />
        </label>
        <label htmlFor="password">
          <input
            type="password"
            name="password"
            data-testid="login-form-password"
            placeholder="Mot de passe"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </label>
        <button type="submit" aria-label="submit-login-form" />
      </form>
    </div>
  );
}

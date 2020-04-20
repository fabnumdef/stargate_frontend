import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useLogin } from '../../lib/loginContext';

export const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiFormLabel-root': {
      color: 'white',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: 'grey',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& label.Mui-root': {
      color: 'white',
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
  },
})(TextField);

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

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const { data: { login: { jwt } } } = await login({ variables: { email, password } });
      ctx.signIn(jwt);
    } catch (error) {
      // TODO put toast messages for errors
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} data-testid="login-form">
        <CssTextField
          type="email"
          name="email"
          inputProps={{ 'data-testid': 'login-form-email' }}
          label="Email"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
        />
        <CssTextField
          type="password"
          inputProps={{ 'data-testid': 'login-form-password' }}
          label="Mot de passe"
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
        />
        <button type="submit" aria-label="submit-login-form" />
      </form>
    </div>
  );
}

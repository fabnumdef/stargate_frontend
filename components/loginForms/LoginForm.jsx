import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useLogin } from '../../lib/loginContext';
import { useSnackBar } from '../../lib/ui-providers/snackbar';

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

export default function LoginForm({ Button }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useMutation(LOGIN);
  const ctx = useLogin();
  const { addAlert } = useSnackBar();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const { data: { login: { jwt } } } = await login({ variables: { email, password } });
      ctx.signIn(jwt);
    } catch (error) {
      switch (error.message) {
        case `GraphQL error: Email "${email}" and password do not match.`:
          addAlert({ message: 'Mauvais identifiant et/ou mot de passe', severity: 'warning' });
          break;
        case 'GraphQL error: Password expired':
          addAlert({ message: 'Mot de passe expiré', severity: 'warning' });
          break;
        default:
          addAlert({ message: 'Une erreur est survenue', severity: 'warning' });
      }
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
        <Button text="Login" label="submit-login-form" />
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  Button: PropTypes.element.isRequired,
};

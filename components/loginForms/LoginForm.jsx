import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { useLogin } from '../../lib/loginContext';
import { useSnackBar } from '../../lib/snackbar';

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

export default function LoginForm({ Button }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useMutation(LOGIN);
  const ctx = useLogin();
  const { addAlert } = useSnackBar();

  const classes = useStyles();

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
          addAlert({ message: 'Mot de passe expirée', severity: 'warning' });
          break;
        default:
          addAlert({ message: 'Une erreur est survenue', severity: 'warning' });
      }
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
            required
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
            required
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </label>
        <Button text="Login" label="submit-login-form" />
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  Button: PropTypes.element.isRequired,
};

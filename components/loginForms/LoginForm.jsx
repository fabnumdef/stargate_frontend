import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useLogin } from '../../lib/loginContext';

const useStyles = makeStyles(() => ({
  formLogin: {
    marginTop: '30%',
  },
}));

export default function LoginForm({ Button }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const ctx = useLogin();
  const classes = useStyles();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    ctx.signIn(email, password);
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
  Button: PropTypes.func.isRequired,
};

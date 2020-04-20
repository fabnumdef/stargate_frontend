import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { CssTextField } from './LoginForm';

const useStyles = makeStyles(() => ({
  formPasswordContainer: {
    marginTop: '22%',
    maxWidth: '80%',
    margin: 'auto',
    '& p': {
      textAlign: 'justify',
    },
  },
}));

export default function ForgotPassForm() {
  const [email, setEmail] = useState('');

  const classes = useStyles();

  const handleSubmit = (evt) => {
    evt.preventDefault();
  };

  return (
    <div className={classes.formPasswordContainer}>
      <form onSubmit={handleSubmit}>
        <CssTextField type="email" label="Identifiant" value={email} onChange={(evt) => setEmail(evt.target.value)} />
        <p>
          Si votre identifiant est enregistré dans notre base de données,
          vous recevrez un e-mail pour réinitialiser votre mot de passe.
        </p>
        <button type="submit" aria-label="submit-form-password" />
      </form>
    </div>
  );
}

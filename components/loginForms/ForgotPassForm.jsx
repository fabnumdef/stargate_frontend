import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  formPasswordContainer: {
    marginTop: '25%',
    maxWidth: '80%',
    margin: 'auto',
    '& p': {
      textAlign: 'justify',
    },
  },
}));

export default function ForgotPassForm({ Button }) {
  const [email, setEmail] = useState('');

  const classes = useStyles();

  const handleSubmit = (evt) => {
    evt.preventDefault();
  };

  return (
    <div className={classes.formPasswordContainer}>
      <form onSubmit={handleSubmit} className={classes.formPassword}>
        <label htmlFor="email">
          <input type="email" name="email" placeholder="Identifiant" value={email} onChange={(evt) => setEmail(evt.target.value)} />
        </label>
        <p>
          Si votre identifiant est enregistré dans notre base de données,
          vous recevrez un e-mail pour réinitialiser votre mot de passe.
        </p>
        <Button text="Envoyer" label="submit-form-password" />
      </form>
    </div>
  );
}

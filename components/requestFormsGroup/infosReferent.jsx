import React, { useState, useEffect, useRef } from 'react';
// React hook form validators
import { useForm, Controller } from 'react-hook-form';

// Apollo

// Material UI components
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';

import validator from 'validator';
import CheckAnimation from '../styled/animations/checked';

const useStyles = makeStyles(() => ({
  instruction: {
    marginBottom: '1%',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
}));


export default function FormInfoVisitor({
  formData,
  setForm,
  handleNext,
  handleBack,
  selectVisitor,
}) {
  const classes = useStyles();
  const {
    register,
    control,
    handleSubmit,
    watch,
    errors,
  } = useForm({
  });

  return (
    <div>
      <Grid container>
        <Grid item sm={12} xs={12} md={12}>
          <Grid container>
            <Grid item md={5} sm={5}>
              <Typography variant="subtitle2">Référent groupe :</Typography>
              <Typography className={classes.instruction} variant="body1">
                responsable d'un groupe lors de la visite
              </Typography>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item md={5} sm={5}>
              <form data-testid="form-visiteur">
                <Controller
                  as={(
                    <TextField
                      label="Email"
                      error={Object.prototype.hasOwnProperty.call(errors, 'email')}
                      InputProps={
                        watch('email') && validator.isEmail(watch('email'))
                          ? {
                            endAdornment: (
                              <InputAdornment position="end" className={classes.checkPos}>
                                <CheckAnimation />
                              </InputAdornment>
                            ),
                            inputProps: { 'data-testid': 'visiteur-email' },
                          }
                          : { inputProps: { 'data-testid': 'visiteur-email' } }
                      }
                      helperText={errors.email && errors.email.message}
                      fullWidth
                    />
                  )}
                  control={control}
                  name="email"
                  defaultValue=""
                  rules={{
                    required: "L'email du référent est obligatoire",
                    validate: (value) => validator.isEmail(value) || 'Format invalide',
                  }}
                />

                <TextField
                  label="Nom"
                  fullWidth
                  name="lastName"
                  error={Object.prototype.hasOwnProperty.call(errors, 'lastName')}
                  helperText={errors.lastName && errors.lastName.message}
                  inputRef={register({
                    validate: (value) => value.trim() !== '' || 'Le nom est obligatoire',
                  })}
                  inputProps={{ 'data-testid': 'referent-lastName' }}
                />
                <TextField
                  label="Prénom"
                  fullWidth
                  name="firstName"
                  error={Object.prototype.hasOwnProperty.call(errors, 'firstName')}
                  helperText={errors.firstName && errors.firstName.message}
                  inputRef={register({
                    validate: (value) => value.trim() !== '' || 'Le prénom est obligatoire',
                  })}
                  inputProps={{ 'data-testid': 'referent-firstName' }}
                />
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

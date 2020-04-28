import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Select } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { withApollo } from '../../../lib/apollo';
import PageTitle from '../../../components/styled/pageTitle';
import Template from '../../../containers/template';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  createUserForm: {
    padding: '60px',
  },
  formSelect: {
    margin: theme.spacing(2),
    width: '40%',
  },
  formRadio: {
    margin: theme.spacing(2),
    width: '100%',
  },
  radioGroup: {
    flexDirection: 'row',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '30px',
    '& button': {
      margin: '3px',
    },
  },
}));

const campuses = ['Cherbourg', 'Toulon', 'Marseille'];
const units = ['Premiere', 'Seconde', 'Troisieme'];

// eslint-disable-next-line no-unused-vars
const creatorRole = {
  role: 'CU',
  campuses: [{
    label: 'Cherbourg',
  }],
  units: [{
    label: 'Premiere',
  }],
};

const creatorRoleAdmin = {
  role: 'Admin',
  campuses: [{
    label: 'Cherbourg',
  }],
  units: [{
    label: 'Seconde',
  }],
};

function CreateUser() {
  const classes = useStyles();
  const {
    handleSubmit, errors, control,
  } = useForm();
  const onSubmit = (data) => console.log(data);

  const creator = creatorRoleAdmin;

  return (
    <Template>
      <PageTitle title="Administration" subtitles={['Utilisateur', 'Nouvel utilisateur']} />
      <form onSubmit={handleSubmit(onSubmit)} className={classes.createUserForm}>
        <Grid container style={{ justifyContent: 'space-between' }} sm={12} xs={12} lg={12}>
          <Grid item sm={4} xs={4}>
            <Grid xs={12} sm={12}>
              <Typography variant="subtitle2" gutterBottom>
                Informations personnelles
              </Typography>
            </Grid>
            <Grid>
              <Controller
                as={(
                  <TextField
                    label="Nom"
                    inputProps={{ 'data-testid': 'create-user-lastname' }}
                    error={Object.prototype.hasOwnProperty.call(errors, 'lastname')}
                    helperText={errors.lastname && errors.lastname.message}
                    fullWidth
                  />
                )}
                rules={{ required: 'Le nom est obligatoire' }}
                control={control}
                name="lastname"
                defaultValue=""
              />
            </Grid>
            <Grid>
              <Controller
                as={(
                  <TextField
                    label="Prénom"
                    inputProps={{ 'data-testid': 'create-user-firstname' }}
                    error={Object.prototype.hasOwnProperty.call(errors, 'firstname')}
                    helperText={errors.firstname && errors.firstname.message}
                    fullWidth
                  />
                )}
                rules={{ required: 'Le prénom est obligatoire' }}
                control={control}
                name="firstname"
                defaultValue=""
              />
            </Grid>
            <Grid>
              <Controller
                as={(
                  <TextField
                    label="Adresse e-mail"
                    inputProps={{ 'data-testid': 'create-user-email' }}
                    error={Object.prototype.hasOwnProperty.call(errors, 'email')}
                    helperText={errors.email && errors.email.message}
                    fullWidth
                  />
                )}
                rules={{ required: 'L\'adresse e-mail est obligatoire' }}
                control={control}
                name="email"
                defaultValue=""
              />
            </Grid>
          </Grid>
          <Grid item sm={7} xs={7}>
            <Grid container style={{ justifyContent: 'space-between' }} xs={12} sm={12}>
              <Typography variant="subtitle2" gutterBottom>
                Règles
              </Typography>
            </Grid>
            <Grid>
              <Grid container style={{ justifyContent: 'space-between' }}>
                <FormControl
                  variant="outlined"
                  error={Object.prototype.hasOwnProperty.call(errors, 'campus')}
                  className={classes.formSelect}
                >
                  <InputLabel id="select-outlined-label">
                    Base
                  </InputLabel>
                  <Controller
                    as={(
                      <Select
                        fullWidth
                        labelId="create-user-campus"
                        id="campus"
                        disabled={creator.role !== 'Admin'}
                      >
                        {campuses.map((campus) => (
                          <MenuItem key={campus} value={campus}>
                            {campus}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    control={control}
                    name="campus"
                    defaultValue={creator.role !== 'Admin' ? creator.campuses[0].label : ''}
                    rules={{ required: true }}
                  />
                  {errors.campus && (
                    <FormHelperText>Champ obligatoire</FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  variant="outlined"
                  error={Object.prototype.hasOwnProperty.call(errors, 'unit')}
                  className={classes.formSelect}
                >
                  <InputLabel id="select-outlined-label">
                    Unité
                  </InputLabel>
                  <Controller
                    as={(
                      <Select
                        labelId="create-user-unit"
                        id="unit"
                        disabled={creator.role !== 'Admin'}
                      >
                        {units.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    control={control}
                    name="unit"
                    defaultValue={creator.role !== 'Admin' ? creator.units[0].label : ''}
                    rules={{ required: true }}
                  />
                  {errors.unit && (
                    <FormHelperText>Champ obligatoire</FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  variant="outlined"
                  error={Object.prototype.hasOwnProperty.call(errors, 'roles')}
                  className={classes.formRadio}
                >
                  <InputLabel id="select-outlined-label">
                    Rôle
                  </InputLabel>
                  <Controller
                    as={(
                      <RadioGroup className={classes.radioGroup} aria-label="vip">
                        <FormControlLabel
                          value="Watcher"
                          control={<Radio color="primary" />}
                          label="Observateur"
                          labelPlacement="start"
                        />
                        <FormControlLabel
                          value="Host"
                          control={<Radio color="primary" />}
                          label="Hôte"
                          labelPlacement="start"
                        />
                      </RadioGroup>
                    )}
                    control={control}
                    name="role"
                    defaultValue=""
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid sm={12} xs={12} className={classes.buttonsContainer}>
          <Link href="/administration/utilisateurs">
            <Button variant="outlined" color="primary" className={classes.buttonCancel}>
              Annuler
            </Button>
          </Link>
          <Button type="submit" variant="contained" color="primary">
            Créer
          </Button>
        </Grid>
      </form>
    </Template>
  );
}

export default withApollo()(CreateUser);

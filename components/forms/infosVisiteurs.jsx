import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useForm, Controller } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import validator from 'validator';
import { isValid } from 'date-fns';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CardAutocomplete from '../styled/cardAutocomplete';


import DatePicker from '../styled/date';
import Nationalite from '../../lib/insee/pays2019.json';
import { useSnackBar } from '../../lib/snackbar';
import CheckAnimation from '../styled/animations/checked';

import InputFile from '../styled/inputFile';

const useStyles = makeStyles((theme) => ({
  radioGroup: {
    flexDirection: 'row',
  },
  formControl: {
    margin: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(1),
  },
  icon: {
    color: '#fdd835',
  },
  comps: {
    marginLeft: '3vw',
  },
  fixedButton: {
    position: 'fixed',
    bottom: '10vh',
    right: '10vw',
  },
  instruction: {
    fontStyle: 'italic',
    fontSize: '0.65rem',
  },
  formVip: {
    width: '100%',
  },
  subTitle: {
    marginTop: '20px',
  },
}));

function getTypeDocument() {
  return ["Carte d'itentité", 'Passeport', 'Carte SIMS'];
}

function getNationalite() {
  const arr = [...Nationalite];
  return arr.map((item) => item.nationalite);
}

function getTypeEmploie(type) {
  if (type === 'HORS MINARM') {
    return ['Consultant', 'Interimaire', 'Stagiaire', 'Livreur', 'Famille'];
  }
  return ['Militaire actif', 'Réserviste', 'Civil de la Defense', 'Autorité'];
}

function getSomeone() {
  return [
    {
      prenomVisiteur: 'Robin',
      nomVisiteur: 'Labouille',
      nomNaissanceVisiteur: 'Labouille',
      gradeVisiteur: 'MP',
      nidVisiteur: '1111111111',
      emailVisiteur: 'robin.labrouille@intra.go.fr',
      uniteVisiteur: 'CDBD Toulon',
      typeVisiteur: 'Militaire actif',
      dateNaissanceVisiteur: '16/09/1986',
      nationaliteVisiteur: 'Française',
      typeDocumentVisiteur: 'Passeport',
      lieuNaissanceVisiteur: 'Lyon',
      numeroDocumentVisiteur: '91897zqo39q1q70911',
    },
    {
      prenomVisiteur: 'Robert',
      nomVisiteur: 'Latour',
      gradeVisiteur: 'ASC1',
      nidVisiteur: '9999999999',
      emailVisiteur: 'robert.latour@gmail.com',
      typeVisiteur: 'Civil de la Defense',
      uniteVisiteur: 'CDBD Toulon',
      dateNaissanceVisiteur: '07/26/1967',
      nationaliteVisiteur: 'Française',
      typeDocumentVisiteur: 'Passeport',
      lieuNaissanceVisiteur: 'Toulouse',
      numeroDocumentVisiteur: '9e8393eei93170911',
    },
  ];
}

export default function FormInfoVisiteur({ dataToProps }) {
  const { formData, setForm, handleNext } = dataToProps;
  const classes = useStyles();

  const {
    register, control, handleSubmit, watch, errors, setValue, clearError,
  } = useForm({
    defaultValues: {
      nomDemandeur: '',
    },
  });

  const [nature, setNature] = useState(formData.natureVisite || '');

  useEffect(() => {
    setNature(formData.natureVisite);

    if (formData.visiteur) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(formData.visiteur)) {
        setValue(key, value);
      }
    }
  }, [formData, setValue]);

  const { addAlert } = useSnackBar();

  const handleNomVisiteurChange = (event) => {
    clearError('nomVisiteur');
    setValue('nomVisiteur', event.target.value);
  };

  const handleNomDemandeurChange = (event) => {
    clearError('nomDemandeur');
    setValue('nomDemandeur', event.target.value);
  };

  const handleNationaliteChange = (event, value) => {
    clearError('nationaliteVisiteur');
    setValue('nationaliteVisiteur', value);
  };

  const handleAutoComplete = (event, value) => {
    clearError();

    if (!value) return;

    setValue('nidVisiteur', value.nidVisiteur);
    setValue('gradeVisiteur', value.gradeVisiteur);
    setValue('nomNaissanceVisiteur', value.nomNaissanceVisiteur);

    setValue('nomVisiteur', value.nomVisiteur);
    setValue('prenomVisiteur', value.prenomVisiteur);
    setValue('nomuniteVisiteurVisiteur', value.uniteVisiteur);
    setValue('emailVisiteur', value.emailVisiteur);
    setValue('uniteVisiteur', value.uniteVisiteur);
    setValue('typeDocumentVisiteur', value.typeDocumentVisiteur);
    setValue('numeroDocumentVisiteur', value.numeroDocumentVisiteur);
    setValue('nationaliteVisiteur', value.nationaliteVisiteur);
    setValue('dateNaissanceVisiteur', value.dateNaissanceVisiteur);
    setValue('lieuNaissanceVisiteur', value.lieuNaissanceVisiteur);
    setValue('typeVisiteur', value.typeVisiteur);
    setValue('origineVisiteur', value.gradeVisiteur ? 'MINARM' : 'HORS MINARM');
    setValue('vipVisiteur', value.vipVisiteur ? 'OUI' : 'NON');
    setValue('justificationVipVisiteur', value.justificationVipVisiteur);
  };

  useEffect(() => {
    register({ name: 'nomDemandeur' }, { required: nature === 'Privee' });
    register({ name: 'nomVisiteur' }, { required: 'le nom du visiteur est obligatoire' });
    register({ name: 'nationaliteVisiteur' }, { required: watch('origineVisiteur') !== 'MINARM' });
  }, [nature, register, watch]);

  const handleClickAnnuler = () => {
    // if (formData.listVisiteurs.length > 0) handleNext();
    // else handleBack();
  };

  const minArmOrNot = () => {
    if (watch('origineVisiteur') === 'MINARM') addAlert({ message: "Les informations sur l'identité sont à rentrer par le visiteur", severity: 'info' });
  };

  const onSubmit = (data) => {
    // snackbar if minarm
    minArmOrNot();

    let visiteurs = [...formData.listVisiteurs];
    // remove the old element if exits
    visiteurs = visiteurs.filter(
      (value) => data.emailVisiteur && data.emailVisiteur !== value.emailVisiteur,
    );

    visiteurs.push(data);

    // update the form
    setForm({ ...formData, listVisiteurs: visiteurs, visiteur: undefined });
    handleNext();
  };

  const inputLabelCiv = useRef(null);
  const inputLabel = useRef(null);

  // TODO delete eslint-disable when labelWidthCiv will be used
  // eslint-disable-next-line no-unused-vars
  const [labelWidthCiv, setLabelWidthCiv] = useState(0);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    if (inputLabelCiv.current) setLabelWidthCiv(inputLabelCiv.current.offsetWidth);
    if (inputLabel.current) setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <div>
      <Typography className={classes.instruction} variant="body1">
        Tous les champs sont obligatoires
      </Typography>
      <form data-testid="form-visiteur" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item sm={12} xs={12} md={6}>
            <Grid container justify="space-between" spacing={2}>
              {nature === 'Professionnelle' && (
                <>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Origine visiteurs
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} className={classes.comps}>
                    <FormControl error={Object.prototype.hasOwnProperty.call(errors, 'origineVisiteur')} component="div">
                      <Controller
                        as={(
                          <RadioGroup className={classes.radioGroup} aria-label="origine">
                            <FormControlLabel
                              value="MINARM"
                              control={<Radio color="primary" data-testid="minarm-button" />}
                              label="MINARM"
                            />
                            <FormControlLabel
                              color="primary"
                              value="HORS MINARM"
                              control={<Radio color="primary" />}
                              label="HORS MINARM"
                            />
                          </RadioGroup>
                        )}
                        control={control}
                        name="origineVisiteur"
                        rules={{ required: "L'origine est obligatoire." }}
                        defaultValue=""
                      />
                      {errors.origineVisiteur && (
                        <FormHelperText>{errors.origineVisiteur.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} className={classes.comps}>
                    <FormControl
                      data-testid="test-employe"
                      variant="outlined"
                      error={Object.prototype.hasOwnProperty.call(errors, 'typeVisiteur')}
                      fullWidth
                    >
                      <InputLabel ref={inputLabel} id="select-outlined-label">
                        Type d&apos;employé
                      </InputLabel>
                      <Controller
                        as={(
                          <Select
                            SelectDisplayProps={{
                              'data-testid': 'list-employe',
                            }}
                            fullWidth
                            labelId="typeEmployeDemande"
                            id="simple-select-outlined"
                            labelWidth={labelWidth}
                          >
                            {getTypeEmploie(watch('origineVisiteur')).map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        control={control}
                        name="typeVisiteur"
                        rules={{
                          required: 'Le type du visiteur est obligatoire.',
                        }}
                        defaultValue=""
                      />
                      {errors.typeVisiteurs && (
                        <FormHelperText>{errors.typeVisiteurs.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </>
              )}

              {nature === 'Privee' && (
                <>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Lien du demandeur
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} className={classes.comps}>
                    <Autocomplete
                      freeSolo
                      options={getSomeone()}
                      inputValue={watch('nomDemandeur') || ''}
                      getOptionLabel={(option) => `${option.gradeVisiteur} ${option.nomVisiteur} ${option.prenomVisiteur}`
|| ''}
                      renderInput={(params) => (
                        <TextField
                          // TODO to delete with AutoComplete
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...params}
                          label="Demandeur"
                          fullWidth
                          error={Object.prototype.hasOwnProperty.call(errors, 'nomDemandeur')}
                          onChange={handleNomDemandeurChange}
                          helperText={errors.nomDemandeur && errors.nomDemandeur.message}
                        />
                      )}
                      renderOption={
                        (option, index) => <CardAutocomplete option={option} index={index} />
                      }
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Grid container spacing={1} alignItems="flex-end" className={classes.subTitle}>
              <Grid item xs={12} sm={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Civilité du visiteur
                </Typography>
              </Grid>

              <Grid container className={classes.comps} spacing={2}>
                {watch('origineVisiteur') !== 'HORS MINARM' && nature === 'Professionnelle' && (
                  <>
                    <Grid item md={6} sm={6} xs={12}>
                      <Controller
                        as={(
                          <TextField
                            label="NID"
                            inputProps={{ 'data-testid': 'visiteur-nid' }}
                            error={Object.prototype.hasOwnProperty.call(errors, 'nidVisiteur')}
                            helperText={errors.nidVisiteur && errors.nidVisiteur.message}
                            fullWidth
                          />
                        )}
                        rules={{ required: 'Le NID est obligatoire' }}
                        control={control}
                        name="nidVisiteur"
                        defaultValue=""
                      />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <Controller
                        as={(
                          <TextField
                            label="Grade"
                            inputProps={{ 'data-testid': 'visiteur-grade' }}
                            error={Object.prototype.hasOwnProperty.call(errors, 'gradeVisiteur')}
                            helperText={errors.gradeVisiteur && errors.gradeVisiteur.message}
                            fullWidth
                          />
                        )}
                        rules={{ required: 'Le grade est obligatoire' }}
                        control={control}
                        name="gradeVisiteur"
                        defaultValue=""
                      />
                    </Grid>
                  </>
                )}

                <Grid item md={12} sm={12} xs={12}>
                  <Autocomplete
                    freeSolo
                    options={getSomeone()}
                    inputValue={watch('nomVisiteur') || ''}
                    onChange={handleAutoComplete}
                    getOptionLabel={(option) => option.nomVisiteur || ''}
                    renderInput={(params) => (
                      <TextField
                        // TODO to delete with AutoComplete
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        label="Nom d'usage"
                        fullWidth
                        name="nomVisiteur"
                        error={Object.prototype.hasOwnProperty.call(errors, 'nomVisiteur')}
                        onChange={handleNomVisiteurChange}
                        helperText={errors.nomVisiteur && errors.nomVisiteur.message}
                      />
                    )}
                    renderOption={
                      (option, index) => <CardAutocomplete option={option} index={index} />
                    }
                  />
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <Controller
                    as={(
                      <TextField
                        inputProps={{ 'data-testid': 'visiteur-nomNaissance' }}
                        label="Nom Naissance"
                        error={Object.prototype.hasOwnProperty.call(errors, 'nomNaisanceVisiteur')}
                        fullWidth
                      />
                    )}
                    control={control}
                    name="nomNaisanceVisiteur"
                    defaultValue=""
                  />
                  <FormHelperText className={classes.instruction}>optionnel</FormHelperText>
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                  <Controller
                    as={(
                      <TextField
                        inputProps={{ 'data-testid': 'visiteur-prenom' }}
                        label="Prénom"
                        error={Object.prototype.hasOwnProperty.call(errors, 'prenomVisiteur')}
                        helperText={errors.prenomVisiteur && errors.prenomVisiteur.message}
                        fullWidth
                      />
                    )}
                    control={control}
                    rules={{ required: 'Le prénom est oblitoire' }}
                    name="prenomVisiteur"
                    defaultValue=""
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    as={(
                      <TextField
                        inputProps={{ 'data-testid': 'visiteur-unite' }}
                        label="Unité/Société"
                        error={Object.prototype.hasOwnProperty.call(errors, 'uniteVisiteur')}
                        helperText={errors.uniteVisiteur && errors.uniteVisiteur.message}
                        fullWidth
                      />
                    )}
                    control={control}
                    name="uniteVisiteur"
                    defaultValue=""
                    rules={{
                      required: "L'unité ou la société est obligatoire",
                    }}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    as={(
                      <TextField
                        label="Email"
                        error={Object.prototype.hasOwnProperty.call(errors, 'emailVisiteur')}
                        InputProps={
                          watch('emailVisiteur')
                          && validator.isEmail(watch('emailVisiteur'))
                            ? {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <CheckAnimation />
                                </InputAdornment>
                              ),
                              inputProps: { 'data-testid': 'visiteur-email' },
                            }
                            : { inputProps: { 'data-testid': 'visiteur-email' } }
                        }

                        helperText={errors.emailVisiteur && errors.emailVisiteur.message}
                        fullWidth
                      />
                    )}
                    control={control}
                    name="emailVisiteur"
                    defaultValue=""
                    rules={{
                      required: "L'email du visiteur est obligatoire",
                      validate: (value) => validator.isEmail(value) || 'Format invalide',
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} className={classes.subTitle}>
              <Typography variant="subtitle2" gutterBottom>
                VIP:
              </Typography>
            </Grid>
            <Grid className={classes.comps} item xs={12} sm={12}>
              <FormControl
                error={Object.prototype.hasOwnProperty.call(errors, 'vipVisiteur')}
                component="div"
                className={classes.formVip}
              >
                <Controller
                  as={(
                    <RadioGroup className={classes.radioGroup} aria-label="vip">
                      <FormControlLabel
                        value="OUI"
                        control={<Radio color="primary" />}
                        label="OUI"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="NON"
                        control={<Radio color="primary" />}
                        label="NON"
                        labelPlacement="start"
                      />
                    </RadioGroup>
                  )}
                  control={control}
                  name="vipVisiteur"
                  rules={{
                    required: 'La nature de la visite est obligatoire.',
                  }}
                  defaultValue="NON"
                />
                {watch('vipVisiteur') === 'OUI' && (
                  <Grid item xs={12} sm={12}>
                    <Controller
                      as={(
                        <TextField
                          label="Veuillez justifier"
                          multiline
                          rowsMax="4"
                          error={Object.prototype.hasOwnProperty.call(errors, 'justificationVipVisiteur')}
                          helperText={
                            errors.justificationVipVisiteur
                            && errors.justificationVipVisiteur.type === 'required'
                            && 'La justification est obligatoire.'
                          }
                          fullWidth
                        />
                      )}
                      control={control}
                      name="justificationVipVisiteur"
                      rules={{
                        required: watch('vipVisiteur') || '' === 'OUI',
                      }}
                      defaultValue=""
                    />
                  </Grid>
                )}
              </FormControl>
            </Grid>
          </Grid>

          {(watch('origineVisiteur') === 'HORS MINARM' || nature === 'Privee') && (
            <Grid item sm={12} xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Identité
                  </Typography>
                </Grid>
                <Grid container spacing={2} className={classes.comps}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Autocomplete
                      freeSolo
                      id="combo-box-naissance"
                      options={getNationalite()}
                      getOptionLabel={(option) => option}
                      onChange={handleNationaliteChange}
                      inputValue={watch('nationaliteVisiteur') || ''}
                      defaultValue=""
                      renderInput={(params) => (
                        <TextField
                          variant="outlined"
                          // TODO to delete with AutoComplete
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...params}
                          label="Nationalité"
                          error={Object.prototype.hasOwnProperty.call(errors, 'nationaliteVisiteur')}
                          helperText={
                            errors.nationaliteVisiteur
                            && errors.nationaliteVisiteur.type === 'required'
                            && 'La nationalité est obligatoire'
                          }
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <FormControl
                      variant="outlined"
                      error={Object.prototype.hasOwnProperty.call(errors, 'typeDocumentVisiteur')}
                      fullWidth
                    >
                      <InputLabel ref={inputLabel} id="select-outlined-label">
                        Type Document
                      </InputLabel>
                      <Controller
                        as={(
                          <Select
                            fullWidth
                            labelId="typeDocumentVisiteur"
                            id="typeDocuement"
                            labelWidth={labelWidth}
                          >
                            {getTypeDocument().map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        control={control}
                        name="typeDocumentVisiteur"
                        defaultValue=""
                        rules={{
                          required:
                            watch('origineVisiteur') || '' === 'HORS MINARM' || nature === 'Privee',
                        }}
                      />
                      {errors.typeDocumentVisiteur
                      && errors.typeDocumentVisiteur.type === 'required' && (
                        <FormHelperText>Le type de document est obligatoire</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Controller
                      as={(
                        <TextField
                          label="Numéro"
                          error={Object.prototype.hasOwnProperty.call(errors, 'numeroDocumentVisiteur')}
                          helperText={
                            errors.numeroDocumentVisiteur
                            && errors.numeroDocumentVisiteur.type === 'required'
                            && 'Le numéro de document est obligatoire'
                          }
                          fullWidth
                        />
                      )}
                      control={control}
                      name="numeroDocumentVisiteur"
                      defaultValue=""
                      rules={{
                        required:
                          watch('origineVisiteur') || '' === 'HORS MINARM' || nature === 'Privee',
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Controller
                      as={(
                        <DatePicker
                          label="Date de naissance"
                          error={Object.prototype.hasOwnProperty.call(errors, 'dateNaissanceVisiteur')}
                          helperText={
                            errors.dateNaissanceVisiteur
                            && errors.dateNaissanceVisiteur.type === 'required'
                            && 'La date de naissance est obligatoire'
                          }
                          disableFuture
                          fullWidth
                        />
                      )}
                      control={control}
                      name="dateNaissanceVisiteur"
                      rules={{
                        required:
                          watch('origineVisiteur') || '' === 'HORS MINARM' || nature === 'Privee',
                      }}
                      defaultValue={null}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12}>
                    <Controller
                      as={(
                        <TextField
                          label="Lieu de naissance"
                          error={Object.prototype.hasOwnProperty.call(errors, 'lieuNaissanceVisiteur')}
                          helperText={
                            errors.lieuNaissanceVisiteur
                            && errors.lieuNaissanceVisiteur.type === 'required'
                            && 'Le lieu de naissance est obligatoire'
                          }
                          fullWidth
                        />
                      )}
                      control={control}
                      name="lieuNaissanceVisiteur"
                      defaultValue=""
                      rules={{
                        required:
                          watch('origineVisiteur') || '' === 'HORS MINARM' || nature === 'Privee',
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {watch('nationaliteVisiteur') !== 'Française' && (
                <Grid container spacing={2} className={classes.subTitle} justify="space-between">
                  <Grid item xs={12} sm={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Scan papier identité: (obligatoire pour étranger)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={classes.comps}>
                    <Controller
                      as={InputFile}
                      rules={{
                        required: watch('nationaliteVisiteur') !== 'Française',
                      }}
                      control={control}
                      defaultValue=""
                      name="file"
                      onChange={(file) => file}
                      label="Fichier"
                      error={Object.prototype.hasOwnProperty.call(errors, 'file')}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
          {formData.zone2 && formData.zone2.length > 0 && (
            <>
              <Grid item sm={12} xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Zone DGA
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={classes.comps}>
                    <Controller
                      as={(
                        <TextField
                          label="Réf Habilitation"
                          inputProps={{
                            'data-testid': 'visiteur-refHabilitation',
                          }}
                          error={Object.prototype.hasOwnProperty.call(errors, 'refHabilitation')}
                          helperText={errors.refHabilitation && errors.refHabilitation.message}
                          fullWidth
                        />
                      )}
                      control={control}
                      rules={{
                        required: "La référence de l'habilitation est obligatoire",
                      }}
                      name="refHabilitation"
                      defaultValue=""
                    />
                    <FormHelperText className={classes.instruction}>le cas échéant</FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={classes.comps}>
                    <Controller
                      as={(
                        <DatePicker
                          label="Date de fin habilitation"
                          inputProps={{
                            'data-testid': 'visiteur-dateFinHabilitation',
                          }}
                          error={Object.prototype.hasOwnProperty.call(errors, 'dateFinHabilitation')}
                          disablePast
                          helperText={
                            errors.dateFinHabilitation && errors.dateFinHabilitation.message
                          }
                          fullWidth
                        />
                      )}
                      control={control}
                      name="dateFinHabilitation"
                      rules={{
                        required: "La date de fin d'habilitation est obligatoire.",
                        validate: {
                          valide: (value) => isValid(value) || 'Format invalide',
                        },
                      }}
                      defaultValue={null}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={classes.comps}>
                    <Controller
                      as={(
                        <TextField
                          label="Réf Contrôle Élémentaire"
                          inputProps={{
                            'data-testid': 'visiteur-refControleElementaire',
                          }}
                          error={Object.prototype.hasOwnProperty.call(errors, 'refControleElementaire')}
                          helperText={
                            errors.refControleElementaire && errors.refControleElementaire.message
                          }
                          fullWidth
                        />
                      )}
                      control={control}
                      rules={{
                        required: 'La référence du contrôle élémentaire est obligatoire',
                      }}
                      name="refControleElementaire"
                      defaultValue=""
                    />
                    <FormHelperText className={classes.instruction}>le cas échéant</FormHelperText>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} className={classes.comps}>
                    <Controller
                      as={(
                        <DatePicker
                          label="Date demande contrôle"
                          inputProps={{
                            'data-testid': 'visiteur-dateDemandeControle',
                          }}
                          error={Object.prototype.hasOwnProperty.call(errors, 'dateDemandeControle')}
                          helperText={
                            errors.dateDemandeControle && errors.dateDemandeControle.message
                          }
                          fullWidth
                        />
                      )}
                      control={control}
                      name="dateDemandeControle"
                      rules={{
                        required: 'La date de demande de contrôle est obligatoire.',
                        validate: {
                          valide: (value) => isValid(value) || 'Format invalide',
                        },
                      }}
                      defaultValue={null}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}

          <Grid item sm={12}>
            <Grid container justify="flex-end">
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: '5px' }}
                  onClick={handleClickAnnuler}
                >
                  Annuler
                </Button>
              </div>
              <div>
                <Button type="submit" variant="contained" color="primary">
                  Envoyer
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

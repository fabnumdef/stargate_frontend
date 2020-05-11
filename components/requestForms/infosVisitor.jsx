import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// React hook form validators
import { useForm, Controller } from 'react-hook-form';
// Material UI components
import { makeStyles } from '@material-ui/core/styles';
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
import Autocomplete from '@material-ui/lab/Autocomplete';

import validator from 'validator';
import { isValid } from 'date-fns';
import { useSnackBar } from '../../lib/ui-providers/snackbar';

import { REQUEST_OBJECT } from '../../utils/constants/enums';
import { mapVisitorData } from '../../utils/mappers/requestAcces';

import DatePicker from '../styled/date';
import Nationalite from '../../utils/constants/insee/pays2019.json';
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

export default function FormInfoVisitor({
  formData, setForm, handleNext, handleBack, selectVisitor,
}) {
  const classes = useStyles();

  const {
    register,
    control,
    handleSubmit,
    watch,
    errors,
    setValue,
    clearError,
  } = useForm({
  });

  const [object, setObject] = useState(formData.object || '');

  useEffect(() => {
    setObject(formData.object);

    if (selectVisitor) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(
        selectVisitor,
      )) {
        setValue(key, value);
      }
    }
  }, [formData, selectVisitor, setValue]);

  const { addAlert } = useSnackBar();

  const handleNationalityChange = (event, value) => {
    clearError('nationality');
    setValue('nationality', value);
  };

  useEffect(() => {
    register(
      { name: 'nationality' },
      { required: watch('isInternal') !== 'MINARM' },
    );
  }, [object, register, watch]);

  const handleClickCancel = () => {
    if (formData.visitors.length > 0) handleNext();
    else handleBack();
  };

  const minArmOrNot = () => {
    if (watch('isInternal') === 'MINARM') addAlert({ message: "Les informations sur l'identité sont à rentrer par le visiteur", severity: 'info' });
  };

  const onSubmit = (data) => {
    // snackbar if minarm
    minArmOrNot();

    const visitor = mapVisitorData(data);

    let visitors = [...formData.visitors];
    // remove the old element if exits
    visitors = visitors.filter((value) => visitor.email && visitor.email !== value.email);

    visitors.push(visitor);

    // update the form
    setForm({ ...formData, visitors, visiteur: undefined });
    handleNext();
  };

  const inputLabel = useRef(null);

  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
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
              <Grid item xs={12} sm={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Origine visiteurs
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} className={classes.comps}>
                <FormControl
                  error={Object.prototype.hasOwnProperty.call(errors, 'isInternal')}
                  component="div"
                >
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
                    name="isInternal"
                    rules={{ required: "L'origine est obligatoire." }}
                    defaultValue=""
                  />
                  {errors.isInternal && (
                    <FormHelperText>{errors.isInternal.message}</FormHelperText>
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
                        {getTypeEmploie(watch('isInternal')).map((type) => (
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
                  {errors.typevisitors && (
                    <FormHelperText>{errors.typevisitors.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={1} alignItems="flex-end" className={classes.subTitle}>
              <Grid item xs={12} sm={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Civilité du visiteur
                </Typography>
              </Grid>

              <Grid container className={classes.comps} spacing={2}>
                {watch('isInternal') !== 'HORS MINARM'
                  && object === REQUEST_OBJECT.PROFESSIONAL && (
                    <>
                      <Grid item md={6} sm={6} xs={12}>
                        <Controller
                          as={(
                            <TextField
                              label="NID"
                              inputProps={{ 'data-testid': 'visiteur-nid' }}
                              error={Object.prototype.hasOwnProperty.call(errors, 'nid')}
                              helperText={errors.nid && errors.nid.message}
                              fullWidth
                            />
                          )}
                          rules={{ required: 'Le NID est obligatoire' }}
                          control={control}
                          name="nid"
                          defaultValue=""
                        />
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <Controller
                          as={(
                            <TextField
                              label="Grade"
                              inputProps={{ 'data-testid': 'visiteur-grade' }}
                              error={Object.prototype.hasOwnProperty.call(errors, 'rank')}
                              helperText={errors.rank && errors.rank.message}
                              fullWidth
                            />
                          )}
                          rules={{ required: 'Le grade est obligatoire' }}
                          control={control}
                          name="rank"
                          defaultValue=""
                        />
                      </Grid>
                    </>
                )}

                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    label="Nom de naissance"
                    fullWidth
                    name="birthdayLastname"
                    error={Object.prototype.hasOwnProperty.call(errors, 'birthdayLastname')}
                    helperText={errors.birthdayLastname && errors.birthdayLastname.message}
                    inputRef={register({ required: 'Le nom est obligatoire' })}
                    inputProps={{ 'data-testid': 'visiteur-nomNaissance' }}
                  />
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <Controller
                    as={(
                      <TextField
                        inputProps={{ 'data-testid': 'visiteur-nomUsage' }}
                        label="Nom de Naissance"
                        error={Object.prototype.hasOwnProperty.call(errors, 'usageLastname')}
                        fullWidth
                      />
                    )}
                    control={control}
                    name="usageLastname"
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
                        error={Object.prototype.hasOwnProperty.call(errors, 'firstname')}
                        helperText={errors.firstname && errors.firstname.message}
                        fullWidth
                      />
                    )}
                    control={control}
                    rules={{ required: 'Le prénom est oblitoire' }}
                    name="firstname"
                    defaultValue=""
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    as={(
                      <TextField
                        inputProps={{ 'data-testid': 'visiteur-unite' }}
                        label="Unité/Société"
                        error={Object.prototype.hasOwnProperty.call(errors, 'company')}
                        helperText={errors.company && errors.company.message}
                        fullWidth
                      />
                    )}
                    control={control}
                    name="company"
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
                        error={Object.prototype.hasOwnProperty.call(errors, 'email')}
                        InputProps={
                          watch('email') && validator.isEmail(watch('email'))
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
                        helperText={errors.email && errors.email.message}
                        fullWidth
                      />
                    )}
                    control={control}
                    name="email"
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
                error={Object.prototype.hasOwnProperty.call(errors, 'vip')}
                component="div"
                className={classes.formVip}
              >
                <Controller
                  as={(
                    <RadioGroup className={classes.radioGroup} aria-label="vip">
                      <FormControlLabel
                        value="TRUE"
                        control={<Radio color="primary" />}
                        label="OUI"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="FALSE"
                        control={<Radio color="primary" />}
                        label="NON"
                        labelPlacement="start"
                      />
                    </RadioGroup>
                  )}
                  control={control}
                  name="vip"
                  defaultValue="FALSE"
                />
                {watch('vip') === 'TRUE' && (
                  <Grid item xs={12} sm={12}>
                    <Controller
                      as={(
                        <TextField
                          label="Veuillez justifier"
                          multiline
                          rowsMax="4"
                          error={Object.prototype.hasOwnProperty.call(errors, 'vipReason')}
                          helperText={
                            errors.vipReason
                            && errors.vipReason.type === 'required'
                            && 'La justification est obligatoire.'
                          }
                          fullWidth
                        />
                      )}
                      control={control}
                      name="vipReason"
                      rules={{
                        required: watch('vip') || '' === 'OUI',
                      }}
                      defaultValue=""
                    />
                  </Grid>
                )}
              </FormControl>
            </Grid>
          </Grid>

          {(watch('isInternal') === 'HORS MINARM' || object === REQUEST_OBJECT.PRIVATE) && (
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
                      onChange={handleNationalityChange}
                      inputValue={watch('nationality') || ''}
                      defaultValue=""
                      renderInput={(params) => (
                        <TextField
                          variant="outlined"
                          // TODO to delete with AutoComplete
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...params}
                          label="Nationalité"
                          error={Object.prototype.hasOwnProperty.call(errors, 'nationality')}
                          helperText={
                            errors.nationality
                            && errors.nationality.type === 'required'
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
                      error={Object.prototype.hasOwnProperty.call(errors, 'kind')}
                      fullWidth
                    >
                      <InputLabel ref={inputLabel} id="select-outlined-label">
                        Type Document
                      </InputLabel>
                      <Controller
                        as={(
                          <Select
                            fullWidth
                            labelId="kind"
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
                        name="kind"
                        defaultValue=""
                        rules={{
                          required:
                            watch('isInternal')
                            || '' === 'HORS MINARM'
                            || object === REQUEST_OBJECT.PRIVATE,
                        }}
                      />
                      {errors.kind
                        && errors.kind.type === 'required' && (
                          <FormHelperText>Le type de document est obligatoire</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Controller
                      as={(
                        <TextField
                          label="Numéro"
                          error={Object.prototype.hasOwnProperty.call(errors, 'reference')}
                          helperText={
                            errors.reference
                            && errors.reference.type === 'required'
                            && 'Le numéro de document est obligatoire'
                          }
                          fullWidth
                        />
                      )}
                      control={control}
                      name="reference"
                      defaultValue=""
                      rules={{
                        required:
                          watch('isInternal')
                          || '' === 'HORS MINARM'
                          || object === REQUEST_OBJECT.PRIVATE,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <Controller
                      as={(
                        <DatePicker
                          label="Date de naissance"
                          error={Object.prototype.hasOwnProperty.call(errors, 'birthday')}
                          helperText={
                            errors.birthday
                            && errors.birthday.type === 'required'
                            && 'La date de naissance est obligatoire'
                          }
                          disableFuture
                          fullWidth
                        />
                      )}
                      control={control}
                      name="birthday"
                      rules={{
                        required:
                          watch('isInternal')
                          || '' === 'HORS MINARM'
                          || object === REQUEST_OBJECT.PRIVATE,
                        validate: { valide: (value) => isValid(value) || 'Format invalide' },
                      }}
                      defaultValue={null}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12}>
                    <Controller
                      as={(
                        <TextField
                          label="Lieu de naissance"
                          error={Object.prototype.hasOwnProperty.call(errors, 'birthdayPlace')}
                          helperText={
                            errors.birthdayPlace
                            && errors.birthdayPlace.type === 'required'
                            && 'Le lieu de naissance est obligatoire'
                          }
                          fullWidth
                        />
                      )}
                      control={control}
                      name="birthdayPlace"
                      defaultValue=""
                      rules={{
                        required:
                          watch('isInternal') || '' === 'HORS MINARM' || object === 'PRIVATE',
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {watch('nationality') !== 'Française' && (
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
                        required: watch('nationality') !== 'Française',
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
          {/* {formData.placeP && formData.placeP.length > 0 && (
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
                          error={Object.prototype.hasOwnProperty.call(
                            errors,
                            'dateFinHabilitation',
                          )}
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
                          error={Object.prototype.hasOwnProperty.call(
                            errors,
                            'refControleElementaire',
                          )}
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
                          error={Object.prototype.hasOwnProperty.call(
                            errors,
                            'dateDemandeControle',
                          )}
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
          )} */}

          <Grid item sm={12}>
            <Grid container justify="flex-end">
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: '5px' }}
                  onClick={handleClickCancel}
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

FormInfoVisitor.propTypes = {
  formData: PropTypes.shape({
    object: PropTypes.string,
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
    reason: PropTypes.string,
    place: PropTypes.array,
    visitors: PropTypes.array,
  }),
  setForm: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  selectVisitor: PropTypes.shape({
    nid: PropTypes.string,
    firstname: PropTypes.string,
    birthdayLastname: PropTypes.string,
    usageLastname: PropTypes.string,
    rank: PropTypes.string,
    company: PropTypes.string,
    email: PropTypes.string,
    vip: PropTypes.string,
    vipReason: PropTypes.string,
    nationality: PropTypes.string,
    reference: PropTypes.string,
  }),
};

FormInfoVisitor.defaultProps = {
  formData: undefined,
  selectVisitor: undefined,
};

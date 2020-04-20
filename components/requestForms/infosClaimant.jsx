import React, { useState } from 'react';
import PropTypes from 'prop-types';

// React Hook Form Validations
import { useForm, Controller } from 'react-hook-form';

// Material UI Imports
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

// Date Validators
import { isValid } from 'date-fns';

import ListLieux from '../lists/checkLieux';
import DatePicker from '../styled/date';

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
    marginRight: '10px',
    marginBottom: '-4px',
  },
  spacingComps: {
    marginBottom: '5vh',
  },
  comps: {
    marginLeft: '3vw',
  },
  compsLow: {
    marginLeft: '1.5vw',
  },
  buttonNext: {
    marginTop: '4vh',
  },
  fixedButton: {
    position: 'fixed',
    bottom: '10vh',
    right: '10vw',
  },
  instruction: {
    marginBottom: '1%',
    fontStyle: 'italic',
    fontSize: '0.65rem',
  },
  error: {
    color: theme.palette.error.main,
  },
  radioNature: {
    flexDirection: 'row',
  },
  buttonCancel: {
    marginRight: '5px',
  },
}));

// eslint-disable-next-line no-unused-vars
function getUser() {
  return {
    nom: 'Durand',
    prenom: 'Henry',
    grade: 'MP',
    unite: 'Etat Major',
    email: 'henry.durand@intradef.gouv.fr',
  };
}

const lieux1 = [
  { value: 'HOMET' },
  { value: 'INBS HOMET' },
  { value: 'CACHIN' },
  { value: 'COMNORD' },
  { value: 'NARDOUET' },
];

const lieux2 = [
  { value: 'BASE NAVALE' },
  { value: 'ILOT SUD' },
  { value: 'ETAT MAJOR' },
  { value: 'FUSCO' },
  { value: 'MESS' },
];

// eslint-disable-next-line no-unused-vars
function getTypeEmploie() {
  return [
    'Consultant',
    'Interimaire',
    'Stagiare',
    'Livreur',
    'Militaire actif',
    'Réserviste',
    'Civil de la Defense',
    'Famille',
    'Autorité',
  ];
}

export default function FormInfosClaimant({
  setForm, handleNext,
}) {
  const classes = useStyles();
  // Date Values

  const {
    register, control, handleSubmit, watch, errors,
  } = useForm();

  // states of expanded composant for area to choose
  const [expanded, setExpanded] = useState({
    'Port Militaire': false,
    'Zone Protégée': false,
  });

  const onSubmit = (data) => {
    setForm((formData) => ({ ...formData, ...data }));
    handleNext();
  };

  return (
    <div>
      <Typography className={classes.instruction} variant="body1">
        Tous les champs sont obligatoires
      </Typography>
      <form data-testid="form-demandeur" onSubmit={handleSubmit(onSubmit)}>
        {/* Debut Main principal Layout */}
        <Grid container spacing={6}>
          {/* Column 1 */}
          <Grid item sm={12} xs={12} md={6}>
            <Grid container direction="row" spacing={2}>
              {/* Item 1 */}

              <Grid item xs={12} sm={12}>
                <Typography variant="subtitle2">Nature visite:</Typography>
              </Grid>
              <Grid className={classes.comps} item xs={12} sm={12}>
                <FormControl
                  error={Object.prototype.hasOwnProperty.call(
                    errors,
                    'natureVisite',
                  )}
                  component="div"
                >
                  <Controller
                    as={(
                      <RadioGroup
                        className={classes.radioNature}
                        aria-label="nature"
                      >
                        <FormControlLabel
                          value="Professionnelle"
                          control={<Radio color="primary" />}
                          label="Professionnelle"
                          labelPlacement="start"
                        />
                        <FormControlLabel
                          value="Privee"
                          control={<Radio color="primary" />}
                          label="Privée"
                          labelPlacement="start"
                        />
                      </RadioGroup>
                                   )}
                    control={control}
                    rules={{
                      required: 'La nature de la visite est obligatoire.',
                    }}
                    name="natureVisite"
                    defaultValue=""
                  />
                  {errors.natureVisite && (
                  <FormHelperText>{errors.natureVisite.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Période d&apos;accès:
                </Typography>
              </Grid>

              {/* Item 4: Selections des dates */}
              <Grid className={classes.comps} item xs={12} sm={12}>
                <Grid container justify="space-evenly">
                  <Grid item sm={5} xs={5}>
                    <Controller
                      as={(
                        <DatePicker
                          label="du"
                          error={Object.prototype.hasOwnProperty.call(
                            errors,
                            'dateStartVisite',
                          )}
                          disablePast
                          helperText={
                                           errors.dateStartVisite && errors.dateStartVisite.message
                                         }
                          fullWidth
                          inputProps={{
                            'data-testid': 'datedebut-visite',
                          }}
                        />
                                     )}
                      control={control}
                      name="dateStartVisite"
                      rules={{
                        required: 'La date de début est obligatoire.',
                        validate: {
                          valide: (value) => isValid(value) || 'Format invalide',
                        },
                      }}
                      defaultValue={null}
                    />
                  </Grid>
                  <Grid item sm={5} xs={5}>
                    <Controller
                      as={(
                        <DatePicker
                          minDate={watch('dateStartVisite')}
                          label="au (inclus)"
                          error={Object.prototype.hasOwnProperty.call(
                            errors,
                            'dateEndVisite',
                          )}
                          helperText={
                                           errors.dateEndVisite && errors.dateEndVisite.message
                                         }
                          disablePast
                          fullWidth
                          inputProps={{
                            'data-testid': 'datefin-visite',
                          }}
                        />
                                     )}
                      control={control}
                      name="dateEndVisite"
                      rules={{
                        required: 'La date de fin est obligatoire',
                        validate: {
                          valide: (value) => isValid(value) || 'Format invalide',
                        },
                      }}
                      defaultValue={null}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Item 5: Période d'acces */}
              <Grid className={classes.comps} item xs={12} sm={12}>
                <Grid container spacing={1} style={{ color: '#ffa000' }}>
                  <Grid item sm={12}>
                    <Typography variant="body2" gutterBottom>
                      Délais de traitement avant la date de visite:
                    </Typography>
                  </Grid>
                  <Grid item sm={12}>
                    <Typography variant="body2" gutterBottom>
                      - Français: 2 jours ouvrés
                    </Typography>
                  </Grid>
                  <Grid item sm={12}>
                    <Typography variant="body2" gutterBottom>
                      - UE: 15 jours ouvrés
                    </Typography>
                  </Grid>
                  <Grid item sm={12}>
                    <Typography variant="body2" gutterBottom>
                      - Hors UE: 30 jours ouvrés
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Item 6: Motif */}
              <Grid item xs={12} sm={12}>
                <Typography variant="subtitle2">Motif de la visite:</Typography>
              </Grid>
              <Grid className={classes.comps} item sm={12} xs={12}>
                <TextField
                  className={classes.testBlue}
                  name="motifVisite"
                  error={Object.prototype.hasOwnProperty.call(errors, 'motifVisite')}
                  helperText={errors.motifVisite && errors.motifVisite.message}
                  variant="outlined"
                  fullWidth
                  multiline
                  inputRef={register({ required: 'Le motif est obligatoire' })}
                  inputProps={{
                    'data-testid': 'motif-visite',
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Column 2 */}
          <Grid item md={6} sm={12} xs={12}>
            <Grid container spacing={2}>
              {/* Item 1: Liste des lieux */}

              <Grid item xs={12} sm={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Accès lieu
                </Typography>
              </Grid>

              <Grid className={classes.compsLow} item md={12} xs={12} sm={12}>
                <Controller
                  as={<ListLieux expanded={expanded} setExpanded={setExpanded} />}
                  rules={{
                    validate: {
                      valide: (value) => (value && value.length > 0) || 'La zone est obligatoire',
                    },
                  }}
                  control={control}
                  name="zone1"
                  options={lieux1}
                  onChange={(checked) => checked}
                  label="Port Militaire"
                  defaultValue={[]}
                />
                {errors.zone1 && (
                <FormHelperText className={classes.error}>
                  {errors.zone1.message}
                </FormHelperText>
                )}
              </Grid>
              <Grid className={classes.compsLow} item md={12} xs={12} sm={12}>
                <Controller
                  as={<ListLieux expanded={expanded} setExpanded={setExpanded} />}
                  control={control}
                  name="zone2"
                  options={lieux2}
                  onChange={(checked) => checked}
                  label="Zone Protégée"
                  defaultValue={[]}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item sm={12} xs={12}>
            <Grid container justify="flex-end">
              {watch('zone2') && watch('zone2').length > 0 && (
              <Typography variant="body2" gutterBottom>
                <WarningRoundedIcon className={classes.icon} />
                Un accompagnateur sera exigé lors de la visite
              </Typography>
              )}
            </Grid>
            <Grid container justify="flex-end">
              <Button
                variant="outlined"
                color="primary"
                className={classes.buttonCancel}
              >
                Annuler
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Continuer
              </Button>
            </Grid>
          </Grid>
          {/* Column 3 */}
        </Grid>
      </form>
    </div>
  );
}

FormInfosClaimant.propTypes = {
  setForm: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

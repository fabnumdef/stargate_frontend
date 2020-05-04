import React, { useState } from 'react';
import PropTypes from 'prop-types';

// apollo graphQL
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

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
import {
  isValid, differenceInDays, isBefore, isThursday, isFriday,
} from 'date-fns';


import { REQUEST_OBJECT } from '../../utils/constants/enums';
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

// is not a business day
function isDeadlineRespected(value) {
  const today = new Date();
  const days = differenceInDays(value, today);
  if (isThursday(today) || isFriday(today)) {
    return days >= 4;
  }
  return days >= 2;
}

const GET_USER_BASE = gql`
  query me() {
    me @client
  }
`;

const GET_BASE_PLACE = gql`
  query editRequest($id: String!, $request: RequestInput!) {
    editRequest(id: $id, request: $request) {
      id
    }
  }
`;


export default function FormInfosClaimant({
  setForm, handleNext,
}) {
  const classes = useStyles();
  // Date Values
  const { data: idBase } = useQuery(GET_USER_BASE);

  const { data: places } = useQuery(GET_BASE_PLACE, {
    skip: !idBase,
    variables: {
      id: idBase,
    },
  });

  const {
    register, control, handleSubmit, watch, errors,
  } = useForm();

  // states of expanded composant for area to choose
  const [expanded, setExpanded] = useState({
    'Port Militaire': false,
    'Zone Protégée': false,
  });

  const onSubmit = (data) => {
    const { placeP, placeS, ...others } = data;
    setForm((formData) => ({ ...formData, place: [...placeP, ...placeS], ...others }));
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
                  error={Object.prototype.hasOwnProperty.call(errors, 'object')}
                  component="div"
                >
                  <Controller
                    as={(
                      <RadioGroup className={classes.radioNature} aria-label="object">
                        <FormControlLabel
                          value={REQUEST_OBJECT.PROFESSIONAL}
                          control={<Radio color="primary" />}
                          label="Professionnelle"
                          labelPlacement="start"
                        />
                        <FormControlLabel
                          value={REQUEST_OBJECT.PRIVATE}
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
                    name="object"
                    defaultValue=""
                  />
                  {errors.object && <FormHelperText>{errors.object.message}</FormHelperText>}
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
                          error={Object.prototype.hasOwnProperty.call(errors, 'from')}
                          disablePast
                          helperText={errors.from && errors.from.message}
                          fullWidth
                          inputProps={{
                            'data-testid': 'datedebut-visite',
                          }}
                        />
                      )}
                      control={control}
                      name="from"
                      rules={{
                        required: 'La date de début est obligatoire.',
                        validate: {
                          format: (value) => isValid(value) || 'Format invalide',
                          valide: (value) => isDeadlineRespected(value) || 'Attention aux durées minimum.',
                        },
                      }}
                      defaultValue={null}
                    />
                  </Grid>
                  <Grid item sm={5} xs={5}>
                    <Controller
                      as={(
                        <DatePicker
                          minDate={watch('from')}
                          label="au (inclus)"
                          error={Object.prototype.hasOwnProperty.call(errors, 'to')}
                          helperText={errors.to && errors.to.message}
                          disablePast
                          fullWidth
                          inputProps={{
                            'data-testid': 'datefin-visite',
                          }}
                        />
                      )}
                      control={control}
                      name="to"
                      rules={{
                        required: 'La date de fin est obligatoire',
                        validate: {
                          format: (value) => isValid(value) || 'Format invalide',
                          valide: (value) => !isBefore(value, watch('from')) || 'Date éronee',
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
                  name="reason"
                  error={Object.prototype.hasOwnProperty.call(errors, 'reason')}
                  helperText={errors.reason && errors.reason.message}
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
                  name="placeS"
                  options={lieux1}
                  onChange={(checked) => checked}
                  label="Port Militaire"
                  defaultValue={[]}
                />
                {errors.placeS && (
                  <FormHelperText className={classes.error}>{errors.placeS.message}</FormHelperText>
                )}
              </Grid>
              <Grid className={classes.compsLow} item md={12} xs={12} sm={12}>
                <Controller
                  as={<ListLieux expanded={expanded} setExpanded={setExpanded} />}
                  control={control}
                  name="placeP"
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
              {watch('placeS') && watch('placeP').length > 0 && (
                <Typography variant="body2" gutterBottom>
                  <WarningRoundedIcon className={classes.icon} />
                  Un accompagnateur sera exigé lors de la visite
                </Typography>
              )}
            </Grid>
            <Grid container justify="flex-end">
              <Button variant="outlined" color="primary" className={classes.buttonCancel}>
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

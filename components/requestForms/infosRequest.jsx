import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';

// React Hook Form Validations
import { useForm, Controller } from 'react-hook-form';

// Apollo
import gql from 'graphql-tag';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
// Material UI Imports
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import {
  isValid, differenceInDays, isBefore, isThursday, isFriday,
} from 'date-fns';
import { useSnackBar } from '../../lib/ui-providers/snackbar';
// Date Validators


import { REQUEST_OBJECT } from '../../utils/constants/enums';
import ListLieux from '../lists/checkLieux';
import DatePicker from '../styled/date';
import { useLogin } from '../../lib/loginContext';


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

const fromMinDate = () => {
  const date = new Date();
  if (isThursday(date)) {
    return date.setDate(date.getDate() + 5);
  }
  if (isFriday(date)) {
    return date.setDate(date.getDate() + 4);
  }
  return date.setDate(date.getDate() + 3);
};

const REQUEST_ATTRIBUTES = gql`
    fragment RequestResult on Request {
      id
      object
      reason
      from
      to
      places {
        label
      }
    }
  `;

export const GET_PLACES_LIST = gql`
    query getPlacesList($campusId: String!) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            listPlaces {
                list {
                    id
                    label
                    unitInCharge {
                      label
                    }
                }
            }
        }
    }
`;


export const CREATE_REQUEST = gql`
         mutation createRequest($request: RequestInput!, $campusId: String!, $unit: RequestOwnerUnitInput!) {
            campusId @client @export(as: "campusId")
            activeRoleCache @client @export (as: "unit") {label: unitLabel}
            mutateCampus(id: $campusId){
              createRequest(request: $request, unit: $unit) {
              ...RequestResult
            }
          }
         }
         ${REQUEST_ATTRIBUTES}
       `;

export const EDIT_REQUEST = gql`
         mutation editRequest($id: String!, $request: RequestInput!, $campusId: String!) {
            campusId @client @export(as: "campusId")
            mutateCampus(id: $campusId){
              editRequest(id: $id, request: $request, unit: $unit) {
                ...RequestResult
              }
          }
         }
         ${REQUEST_ATTRIBUTES}
       `;


export default function FormInfosClaimant({
  formData, setForm, handleNext,
}) {
  const classes = useStyles();

  const { addAlert } = useSnackBar();
  const client = useApolloClient();

  const { data: placesList } = useQuery(GET_PLACES_LIST);
  const { activeRole } = useLogin();

  const checkSelection = async (value) => {
    const { data } = await client.query({ query: GET_PLACES_LIST });
    const filter = data.getCampus.listPlaces.list.filter(
      (place) => value.includes(place.id) && place.unitInCharge.label === activeRole.unitLabel,
    );
    return filter.length > 0 || 'Vous devez choisir au moins un lieu correspondant à votre unité';
  };

  const [createRequest] = useMutation(CREATE_REQUEST, {
    onCompleted: (data) => {
      setForm({ ...data.mutateCampus.createRequest, visitors: formData.visitors });
      handleNext();
    },
    onError: (error) => {
      // Display good message
      addAlert({
        message: error.message,
        severity: 'info',
      });
    },
  });

  const [updateRequest] = useMutation(EDIT_REQUEST, {
    onCompleted: (data) => {
      setForm({ ...data.mutateCampus.createRequest, visitors: formData.visitors });
      handleNext();
    },
    onError: (error) => {
      // Display good message
      addAlert({
        message: error.message,
        severity: 'error',
      });
    },
  });

  const {
    register, control, handleSubmit, watch, errors,
  } = useForm();

  // states of expanded composant for area to choose
  const [expanded, setExpanded] = useState(false);

  const onSubmit = (data) => {
    if (!formData.id) {
      createRequest({ variables: { request: data } });
    } else {
      updateRequest({
        variables: {
          id: formData.id,
          request: data,
        },
      });
    }
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
                          minDate={fromMinDate()}
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
                          valide: (value) => isDeadlineRespected(value) || 'Le délai minimum avant visite est de 2 jours ouvrés',
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
                          disabled={!watch('from')}
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
                          valide: (value) => !isBefore(value, watch('from')) || 'Date éronnée',
                        },
                      }}
                      defaultValue={null}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Item 5: Période d'acces */}
              <Grid className={classes.comps} item xs={12} sm={12}>
                <Grid container spacing={1} style={{ color: '#c78005' }}>
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
                  inputRef={register({
                    validate: (value) => value.trim() !== '' || 'Le motif est obligatoire',
                  })}
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
                  Accès lieux
                </Typography>
              </Grid>

              <Grid className={classes.compsLow} item md={12} xs={12} sm={12}>
                <Controller
                  as={(
                    <ListLieux
                      options={placesList ? placesList.getCampus.listPlaces.list : []}
                      expanded={expanded}
                      setExpanded={setExpanded}
                      onChange={(checked) => checked}
                      label="Lieux"
                    />
                  )}
                  rules={{
                    validate: {
                      valide: (value) => (value && value.length > 0) || 'Le choix d\'un lieu est obligatoire',
                      acceptedSelection: (value) => checkSelection(value),
                    },
                  }}
                  control={control}
                  name="places"
                  defaultValue={[]}
                />
                {errors.places && (
                  <FormHelperText className={classes.error}>{errors.places.message}</FormHelperText>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item sm={12} xs={12}>
            <Grid container justify="flex-end">
              <Link href="/">
                <Button variant="outlined" color="primary" className={classes.buttonCancel}>
                  Annuler
                </Button>
              </Link>
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
  formData: PropTypes.shape({
    id: PropTypes.string,
    visitors: PropTypes.array,
  }).isRequired,
  setForm: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// React hook form validators
import { useForm, Controller } from 'react-hook-form';

// Apollo
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

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

import { REQUEST_OBJECT, ID_DOCUMENT, EMPLOYEE_TYPE } from '../../utils/constants/enums';
import { mapVisitorData, mapVisitorEdit } from '../../utils/mappers/requestAcces';

import DatePicker from '../styled/date';
import Nationalite from '../../utils/constants/insee/pays2019.json';
import CheckAnimation from '../styled/animations/checked';

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
  checkPos: {
    marginBottom: '5px',
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

function getTypeDocument(isInternal) {
  // TODO Check if MIINARM or not
  if (isInternal === 'MINARM') {
    return [
      { value: ID_DOCUMENT.IDCARD, label: "Carte d'identité" },
      { value: ID_DOCUMENT.PASSPORT, label: 'Passeport' },
      { value: ID_DOCUMENT.CIMSCARD, label: 'Carte CIMS' },
    ];
  }

  return [
    { value: ID_DOCUMENT.IDCARD, label: "Carte d'identité" },
    { value: ID_DOCUMENT.PASSPORT, label: 'Passeport' },
  ];
}

function getNationality() {
  const arr = [...Nationalite];
  return arr.map((item) => item.nationalite);
}

const ADD_VISITOR = gql`
  mutation createVisitor($idRequest: String!, $visitor: RequestVisitorInput!, $campusId: String!) {
    campusId @client @export(as: "campusId")
    mutateCampus(id: $campusId) {
      mutateRequest(id: $idRequest) {
        createVisitor(visitor: $visitor){
          id
          isInternal
          employeeType
          nid
          firstname
          birthLastname
          usageLastname
          rank
          company
          email
          vip
          vipReason
          nationality
          birthday
          birthplace
          identityDocuments {
              kind
              reference
          }
        }
      }
    }
  }
`;

const EDIT_VISITOR = gql`
    mutation editVisitor( $campusId: String!, $idRequest: String!, $visitor: RequestVisitorInput!, $idVisitor: String!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            mutateRequest(id: $idRequest) {
                editVisitor(visitor: $visitor, id: $idVisitor){
                    id
                    isInternal
                    employeeType
                    nid
                    firstname
                    birthLastname
                    usageLastname
                    rank
                    company
                    email
                    vip
                    vipReason
                    nationality
                    birthday
                    birthplace
                    identityDocuments {
                        kind
                        reference
                    }
                }
            }
        }
    }
`;

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
    getValues,
    clearError,
  } = useForm({
    defaultValues: {
      nationality: selectVisitor.nationality ? selectVisitor.nationality : '',
    },
  });

  useEffect(() => {
    if (selectVisitor.id) {
      const visitorData = mapVisitorEdit(selectVisitor);
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(
        visitorData,
      )) {
        setValue(key, value);
      }
    }
  }, [selectVisitor, setValue]);

  const { addAlert } = useSnackBar();

  useEffect(() => {
    register(
      { name: 'nationality' },
      { required: 'La nationalité est obligatoire' },
    );
  }, [register]);

  const handleNationalityChange = (event, value) => {
    clearError('nationality');
    setValue('nationality', value);
    setValue('kind', '');
    setValue('reference', '');
  };

  const handleClickCancel = () => {
    if (formData.visitors.length > 0) handleNext();
    else handleBack();
  };

  const [createVisitor] = useMutation(ADD_VISITOR, {
    onCompleted: (data) => {
      setForm({
        ...formData,
        visitors: [...formData.visitors, data.mutateCampus.mutateRequest.createVisitor],
      });
      // minArmOrNot();
      handleNext();
    },
    onError: () => {
      // Display good message
      addAlert({
        message: 'erreur graphQL',
        severity: 'error',
      });
    },
  });

  const [editVisitor] = useMutation(EDIT_VISITOR, {
    onCompleted: (data) => {
      const newVisitors = formData.visitors.map((visitor) => {
        if (visitor.id === data.mutateCampus.mutateRequest.editVisitor.id) {
          return data.mutateCampus.mutateRequest.editVisitor;
        }
        return visitor;
      });
      setForm({
        ...formData,
        visitors: newVisitors,
      });
      // minArmOrNot();
      handleNext();
    },
    onError: () => {
      // Display good message
      addAlert({
        message: 'erreur graphQL',
        severity: 'error',
      });
    },
  });

  const onSubmit = (data) => {
    const visitorData = mapVisitorData(data);
    if (selectVisitor.id) {
      return editVisitor({
        variables: {
          idRequest: formData.id,
          visitor: { ...visitorData },
          idVisitor: selectVisitor.id,
        },
      });
    }
    return createVisitor({ variables: { idRequest: formData.id, visitor: { ...visitorData } } });
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
                  error={Object.prototype.hasOwnProperty.call(errors, 'employeeType')}
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
                        {Object.entries(EMPLOYEE_TYPE).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    control={control}
                    name="employeeType"
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
                      required: "L'email du visiteur est obligatoire",
                      validate: (value) => validator.isEmail(value) || 'Format invalide',
                    }}
                  />
                </Grid>

                {watch('isInternal') !== 'HORS MINARM' && formData.object === REQUEST_OBJECT.PROFESSIONAL && (
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
                        control={control}
                        name="nid"
                        defaultValue=""
                      />
                      <FormHelperText className={classes.instruction}>optionnel</FormHelperText>
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
                        control={control}
                        name="rank"
                        defaultValue=""
                      />
                      <FormHelperText className={classes.instruction}>optionnel</FormHelperText>
                    </Grid>
                  </>
                )}

                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    label="Nom de naissance"
                    fullWidth
                    name="birthLastname"
                    error={Object.prototype.hasOwnProperty.call(errors, 'birthLastname')}
                    helperText={errors.birthLastname && errors.birthLastname.message}
                    inputRef={register({ validate: (value) => value.trim() !== '' || 'Le nom est obligatoire' })}
                    inputProps={{ 'data-testid': 'visiteur-nomNaissance' }}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    as={(
                      <TextField
                        inputProps={{ 'data-testid': 'visiteur-nomUsage' }}
                        label="Nom marital"
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

                <Grid item md={12} sm={12} xs={12}>
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
                    rules={{ validate: (value) => value.trim() !== '' || 'Le prénom est obligatoire' }}
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
                      validate: (value) => value.trim() !== '' || "L'unité ou la société est obligatoire",
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
                {(selectVisitor.vip || watch('vip') === 'TRUE') && (
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
                    options={getNationality()}
                    getOptionLabel={(option) => option}
                    onChange={handleNationalityChange}
                    defaultValue={
                        getNationality().find((n) => n === getValues().nationality)
                        }
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
                              && errors.nationality.message
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
                          id="typeDocument"
                          labelWidth={labelWidth}
                        >
                          {getTypeDocument(watch('isInternal')).map((doc) => (
                            <MenuItem key={doc.value} value={doc.value}>
                              {doc.label}
                            </MenuItem>
                          ))}
                        </Select>
                        )}
                      control={control}
                      name="kind"
                      defaultValue=""
                      rules={{
                        required: 'Le type de document est obligatoire',
                      }}
                    />
                    {errors.kind && errors.kind.type === 'required' && (
                    <FormHelperText>{errors.kind.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <Controller
                    as={(
                      <TextField
                        label="Numéro"
                        error={Object.prototype.hasOwnProperty.call(errors, 'reference')}
                        helperText={
                            errors.reference
                            && errors.reference.message
                          }
                        fullWidth
                      />
                      )}
                    control={control}
                    name="reference"
                    defaultValue=""
                    rules={{
                      validate: (value) => value.trim() !== '' || 'Le numéro de document est obligatoire',
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <Controller
                    as={(
                      <DatePicker
                        label="Date de naissance"
                        error={Object.prototype.hasOwnProperty.call(errors, 'birthday')}
                        helperText={
                            errors.birthday
                            && errors.birthday.type === 'required'
                            && errors.birthday.message
                          }
                        disableFuture
                        fullWidth
                      />
                      )}
                    control={control}
                    name="birthday"
                    rules={{
                      required: 'La date de naissance est obligatoire',
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
                        error={Object.prototype.hasOwnProperty.call(errors, 'birthplace')}
                        helperText={
                            errors.birthplace
                            && errors.birthplace.message
                          }
                        fullWidth
                        inputProps={{ maxLength: 35 }}
                      />
                      )}
                    control={control}
                    name="birthplace"
                    defaultValue=""
                    rules={{
                      validate: (value) => value.trim() !== '' || 'Le lieu de naissance est obligatoire',
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* TODO add with upload file feature */}
            {/* {watch('nationality') !== 'Française' && ( */}
            {/* <Grid
            container
            spacing={2}
            className={classes.subTitle}
            justify="space-between"
            > */}
            {/*  <Grid item xs={12} sm={12}> */}
            {/*    <Typography variant="subtitle2" gutterBottom> */}
            {/*      Scan papier identité: (obligatoire pour étranger) */}
            {/*    </Typography> */}
            {/*  </Grid> */}
            {/*  <Grid item xs={12} sm={12} md={12} className={classes.comps}> */}
            {/*    <Controller */}
            {/*      as={InputFile} */}
            {/*      rules={{ */}
            {/*        required: watch('nationality') !== 'Française', */}
            {/*      }} */}
            {/*      control={control} */}
            {/*      defaultValue="" */}
            {/*      name="file" */}
            {/*      onChange={(file) => file} */}
            {/*      label="Fichier" */}
            {/*      error={Object.prototype.hasOwnProperty.call(errors, 'file')} */}
            {/*    /> */}
            {/*  </Grid> */}
            {/* </Grid> */}
            {/* )} */}
          </Grid>
          <Grid item sm={12}>
            <Grid container justify="flex-end">
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: '5px' }}
                  onClick={handleClickCancel}
                >
                  Retour
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
    id: PropTypes.string,
    object: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
    reason: PropTypes.string,
    place: PropTypes.array,
    visitors: PropTypes.array,
  }).isRequired,
  setForm: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  selectVisitor: PropTypes.shape({
    id: PropTypes.string,
    nid: PropTypes.string,
    firstname: PropTypes.string,
    birthLastname: PropTypes.string,
    usageLastname: PropTypes.string,
    rank: PropTypes.string,
    company: PropTypes.string,
    email: PropTypes.string,
    vip: PropTypes.bool,
    vipReason: PropTypes.string,
    nationality: PropTypes.string,
    reference: PropTypes.string,
  }).isRequired,
};

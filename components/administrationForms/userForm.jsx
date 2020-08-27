import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import classNames from 'classnames';
import { mapUserData } from '../../utils/mappers/adminMappers';
import { isAdmin, isSuperAdmin } from '../../utils/permissions';
import { useSnackBar } from '../../lib/ui-providers/snackbar';
import { ROLES } from '../../utils/constants/enums';

const useStyles = makeStyles((theme) => ({
  createUserForm: {
    padding: '60px',
  },
  formTextField: {
    marginTop: theme.spacing(1),
  },
  formSelect: {
    margin: theme.spacing(2),
    width: '40%',
  },
  formRadio: {
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
  errorText: {
    color: theme.palette.error.main,
  },
}));

const GET_CAMPUSES = gql`
    query listCampuses {
        listCampuses {
            list {
                id
                label
            }
        }
    }
`;

const GET_UNITS = gql`
    query listUnits($campusId: String!) {
      getCampus(id: $campusId) {
          listUnits {
              list {
                  id
                  label
              }
          }
      }
    }
`;


const radioDisplay = (userRole) => {
  if (userRole.role === ROLES.ROLE_UNIT_CORRESPONDENT.role) { return [ROLES.ROLE_HOST]; }
  if (isAdmin(userRole.role)) { return [ROLES.ROLE_OBSERVER, ROLES.ROLE_HOST, ROLES.ROLE_ADMIN]; }
  if (isSuperAdmin(userRole.role)) {
    return [ROLES.ROLE_OBSERVER, ROLES.ROLE_HOST, ROLES.ROLE_ADMIN, ROLES.ROLE_SUPERADMIN];
  }
  return [];
};

const UserForm = ({
  submitForm, defaultValues, userRole, type,
}) => {
  const classes = useStyles();
  const { addAlert } = useSnackBar();
  const {
    handleSubmit, errors, control, watch,
  } = useForm();

  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  const { data: dataCampuses } = useQuery(GET_CAMPUSES);
  const [reqUnitsList, { data: dataUnits }] = useLazyQuery(GET_UNITS);

  const noUnitRoles = [ROLES.ROLE_OBSERVER.role, ROLES.ROLE_ADMIN.role, ROLES.ROLE_SUPERADMIN.role];

  const onSubmit = (data) => {
    const formData = { ...data };
    if (noUnitRoles.includes(formData.role)) { delete formData.unit; }

    const mappedUser = mapUserData(formData, dataCampuses, dataUnits);
    submitForm(mappedUser);
  };

  const getListUnits = async (campusId) => {
    try {
      reqUnitsList({ variables: { campusId } });
    } catch (e) {
      addAlert({ message: 'Une erreur est survenue au chargement de la liste des unités', severity: 'error' });
    }
  };


  useEffect(() => {
    if (inputLabel.current) setLabelWidth(inputLabel.current.offsetWidth);
    if (defaultValues.campus) {
      getListUnits(defaultValues.campus);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.createUserForm}>
      <Grid container item style={{ justifyContent: 'space-between' }} sm={12} xs={12} lg={12}>
        <Grid item sm={4} xs={4}>
          <Grid item xs={12} sm={12}>
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
                  className={classes.formTextField}
                  fullWidth
                />
              )}
              rules={{ validate: (value) => value.trim() !== '' || 'Le nom est obligatoire' }}
              control={control}
              name="lastname"
              defaultValue={defaultValues.lastname ? defaultValues.lastname : ''}
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
                  className={classes.formTextField}
                  fullWidth
                />
              )}
              rules={{ validate: (value) => value.trim() !== '' || 'Le prénom est obligatoire' }}
              control={control}
              name="firstname"
              defaultValue={defaultValues.firstname ? defaultValues.firstname : ''}
            />
          </Grid>
          <Grid>
            <Controller
              as={(
                <TextField
                  label="Adresse e-mail"
                  inputProps={{ 'data-testid': 'create-user-email', type: 'email' }}
                  error={Object.prototype.hasOwnProperty.call(errors, 'email')}
                  helperText={errors.email && errors.email.message}
                  className={classes.formTextField}
                  fullWidth
                />
              )}
              rules={{ validate: (value) => value.trim() !== '' || 'L\'adresse e-mail est obligatoire' }}
              control={control}
              name="email"
              defaultValue={defaultValues.email ? defaultValues.email : ''}
            />
          </Grid>
        </Grid>
        <Grid item sm={7} xs={7}>
          <Grid container item style={{ justifyContent: 'space-between' }} xs={12} sm={12}>
            <Typography variant="subtitle2" gutterBottom>
              Affectation
            </Typography>
          </Grid>
          <Grid>
            <Grid container style={{ justifyContent: 'space-between' }}>
              <FormControl
                variant="outlined"
                error={Object.prototype.hasOwnProperty.call(errors, 'campus')}
                className={classes.formSelect}
              >
                <InputLabel ref={inputLabel} id="select-outlined-label">
                  Base
                </InputLabel>

                {dataCampuses && (
                <Controller
                  as={(
                    <Select
                      fullWidth
                      labelId="create-user-campus"
                      id="campus"
                      disabled={!isSuperAdmin(userRole.role)}
                      labelWidth={labelWidth}
                    >
                      {dataCampuses.listCampuses.list.map((campus) => (
                        <MenuItem key={campus.id} value={campus.id}>
                          {campus.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  control={control}
                  onChange={([selected]) => {
                    getListUnits(selected.target.value);
                    return selected;
                  }}
                  name="campus"
                  defaultValue={defaultValues.campus ? defaultValues.campus : ''}
                  rules={{ required: true }}
                />
                )}

                {errors.campus && (
                  <FormHelperText className={classes.errorText}>Base obligatoire</FormHelperText>
                )}
              </FormControl>

              {!noUnitRoles.includes(watch('role')) && (
              <FormControl
                variant="outlined"
                error={Object.prototype.hasOwnProperty.call(errors, 'unit')}
                className={classes.formSelect}
              >
                <InputLabel ref={inputLabel} id="select-outlined-label">
                  Unité
                </InputLabel>
                <Controller
                  as={(
                    <Select
                      labelId="create-user-unit"
                      id="unit"
                      disabled={!dataUnits || userRole.role === ROLES.ROLE_UNIT_CORRESPONDENT.role}
                      labelWidth={labelWidth}
                    >
                      {dataUnits && dataUnits.getCampus.listUnits.list.map((unit) => (
                        <MenuItem key={unit.id} value={unit.id}>
                          {unit.label}
                        </MenuItem>
                      ))}
                    </Select>
                    )}
                  control={control}
                  name="unit"
                  defaultValue={(isSuperAdmin(userRole.role) && type === 'create') ? '' : defaultValues.unit}
                  rules={{ required: true }}
                />
                {errors.unit && (
                <FormHelperText className={classes.errorText}>Unité obligatoire</FormHelperText>
                )}
              </FormControl>
              )}
              <Grid container item style={{ justifyContent: 'space-between' }} xs={12} sm={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Rôle
                </Typography>
              </Grid>
              <FormControl
                variant="outlined"
                error={Object.prototype.hasOwnProperty.call(errors, 'roles')}
                className={classes.formRadio}
              >
                <Controller
                  as={(
                    <RadioGroup
                      className={classNames(
                        classes.radioGroup,
                        { [classes.errorText]: errors.role },
                      )}
                      aria-label="vip"
                    >
                      {radioDisplay(userRole).map((roleItem) => (
                        <FormControlLabel
                          value={roleItem.role}
                          control={<Radio color="primary" />}
                          label={roleItem.label}
                          labelPlacement="start"
                          disabled={userRole.role === ROLES.ROLE_UNIT_CORRESPONDENT.role}
                        />
                      ))}
                    </RadioGroup>
                  )}
                  control={control}
                  rules={{ required: 'Le rôle est obligatoire' }}
                  name="role"
                  defaultValue={() => {
                    if (defaultValues.role) return defaultValues.role;
                    return (userRole.role === ROLES.ROLE_UNIT_CORRESPONDENT.role) ? ROLES.ROLE_HOST.role : '';
                  }}
                />
                {errors.role && (
                  <FormHelperText className={classes.errorText}>Le rôle obligatoire</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} xs={12} className={classes.buttonsContainer}>
        <Link href="/administration/utilisateurs">
          <Button variant="outlined" color="primary" className={classes.buttonCancel}>
            Annuler
          </Button>
        </Link>
        <Button type="submit" variant="contained" color="primary">
          {type === 'create' ? 'Créer' : 'Modifier'}
        </Button>
      </Grid>
    </form>
  );
};

UserForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    lastname: PropTypes.string,
    firstname: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    campus: PropTypes.objectOf(PropTypes.string.isRequired),
    unit: PropTypes.objectOf(PropTypes.string.isRequired),
  }).isRequired,
  userRole: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default UserForm;

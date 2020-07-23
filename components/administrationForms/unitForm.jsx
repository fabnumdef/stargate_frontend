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
import Menu from '@material-ui/core/Menu';
import { mapUserData } from '../../utils/mappers/adminMappers';
import { isAdmin, isSuperAdmin } from '../../utils/permissions';
import { useSnackBar } from '../../lib/ui-providers/snackbar';
import { ROLES } from '../../utils/constants/enums';
import ListLieux from '../lists/checkLieux';
import { DndModule } from '../../containers/index';

const useStyles = makeStyles((theme) => ({
  createUnitForm: {
    padding: '20px',
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
  textFieldBlock: {
    paddingLeft: '100px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '30px',
    '& button': {
      margin: '3px',
    },
  },
  error: {
    color: theme.palette.error.main,
  },
}));

const GET_PLACES = gql`
    query listPlaces($campusId: String!) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
          listPlaces {
              list {
                  id
                  label
              }
          }
        }
    }
`;


const UnitForm = ({
  submitForm, defaultValues, userRole, type,
}) => {
  const classes = useStyles();
  const { addAlert } = useSnackBar();
  const {
    handleSubmit, errors, control, watch,
  } = useForm();

  const allCards = Object.values(ROLES).filter((role) => role.workflow).map((role, i) => ({ id: i + 1, text: role.label, role: role.role }));
  const [cards, setCards] = useState(allCards);

  const [expanded, setExpanded] = useState(false);
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  const { data: placesList } = useQuery(GET_PLACES);

  useEffect(() => {
    if (inputLabel.current) setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const onSubmit = (formData) => {
    console.log(formData);
    // submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.createUnitForm}>
      <Typography>Tous les champs sont obligatoires</Typography>
      <Grid container item sm={12} xs={12}>
        <Grid sm={6} xs={6}>
          <Typography variant="subtitle3">Description: </Typography>
          <Grid className={classes.textFieldBlock}>
            <Controller
              as={(
                <TextField
                  label="Nom"
                  inputProps={{ 'data-testid': 'create-unit-name' }}
                  error={Object.prototype.hasOwnProperty.call(errors, 'name')}
                  helperText={errors.name && errors.name.message}
                  className={classes.formTextField}
                  fullWidth
                />
              )}
              rules={{ validate: (value) => value.trim() !== '' || 'Le nom est obligatoire' }}
              control={control}
              name="name"
              defaultValue={defaultValues.name ? defaultValues.name : ''}
            />
            <Grid container alignItems="flex-end" justify="space-between">
              <Controller
                as={(
                  <TextField
                    label="Trigramme"
                    inputProps={{ 'data-testid': 'create-unit-trigram' }}
                    error={Object.prototype.hasOwnProperty.call(errors, 'trigram')}
                    helperText={errors.trigram && errors.trigram.message}
                    className={classes.formTextField}
                  />
                )}
                rules={{
                  validate: {
                    valide: (value) => value.trim() !== '' || 'Le trigramme est obligatoire',
                    format: (value) => (value.length >= 2 && value.length <= 3) || 'Le trigramme doit avoir 2 ou 3 caractères',
                  },
                }}
                control={control}
                name="trigram"
                defaultValue={defaultValues.trigram ? defaultValues.trigram : ''}
              />
              <Grid>
                <Typography>Trigramme de l'unité, 2 à 3 lettres uniques et non editable par la suite</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Typography variant="subtitle3">Lieux: </Typography>
          <Grid className={classes.textFieldBlock}>
            <Controller
              as={(
                <ListLieux
                  options={placesList ? placesList.getCampus.listPlaces.list : []}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  onChange={(checked) => checked}
                  label="Lieux"
                  className={classes.placesList}
                />
              )}
              rules={{
                validate: {
                  valide: (value) => (value && value.length > 0) || 'Le choix d\'un lieu est obligatoire',
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
          <Grid>
            <Typography variant="subtitle3">Parcours de validation: </Typography>
            <DndModule cards={cards} setCards={setCards} allCards={allCards}/>
          </Grid>
        </Grid>
        <Grid sm={6} xs={6}>
          <Typography>Correspondant:</Typography>
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

UnitForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default UnitForm;

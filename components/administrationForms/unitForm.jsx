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
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import { useSnackBar } from '../../lib/ui-providers/snackbar';
import { ROLES } from '../../utils/constants/enums';
import ListLieux from '../lists/checkLieux';
import { DndModule } from '../../containers/index';

const useStyles = makeStyles((theme) => ({
  createUnitForm: {
    padding: '20px',
  },
  sectionContainer: {
    marginTop: '60px',
    paddingRight: '50px',
  },
  formTextField: {
    marginTop: theme.spacing(1),
  },
  formSelect: {
    width: '300px',
  },
  titleUserSelect: {
    display: 'inline-block',
    width: '120px',
    textAlign: 'right',
  },
  userSelect: {
    display: 'inline-block',
    width: '80%',
    padding: '0 0 20px 16px',
  },
  assistantList: {
    width: '200px',
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

const GET_USERS = gql`
    query listUsers {
          listUsers {
              list {
                  id
                  firstname
                  lastname
              }
          }
      }
`;

const AssistantList = ({ user, deleteAssistant }) => {
  const classes = useStyles();

  return (
    <Grid container justify="space-between" className={classes.assistantList}>
      <span>{`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`}</span>
      <button onClick={() => deleteAssistant(user.id)}>x</button>
    </Grid>
  );
};

const UnitForm = ({
  defaultValues, type,
}) => {
  const classes = useStyles();
  const { addAlert } = useSnackBar();
  const {
    handleSubmit, errors, control,
  } = useForm();

  const allCards = Object.values(ROLES)
    .filter((role) => role.workflow)
    .map((role, i) => ({ id: i + 1, text: role.label, role: role.role }));
  const [cards, setCards] = useState(allCards);

  const [corresAssistant, setcorresAssistant] = React.useState([]);
  const addCorresAssistant = (event) => {
    setcorresAssistant(event.target.value);
  };
  const deleteCorresAssistant = (id) => {
    const newUsers = corresAssistant.filter((user) => user.id !== id);
    setcorresAssistant(newUsers);
  };
  const [officerAssistant, setOfficerAssistant] = React.useState([]);
  const addOfficerAssistant = (event) => {
    setOfficerAssistant(event.target.value);
  };
  const deleteOfficerAssistant = (id) => {
    const newUsers = corresAssistant.filter((user) => user.id !== id);
    setOfficerAssistant(newUsers);
  };

  const [expanded, setExpanded] = useState(false);
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  const { data: placesList } = useQuery(GET_PLACES);
  const { data: usersList } = useQuery(GET_USERS);

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
          <Grid className={classes.sectionContainer}>
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
                  <Typography>
                    Trigramme de l'unité, 2 à 3 lettres uniques et non editable par la suite
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.sectionContainer}>
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
          </Grid>
          <Grid className={classes.sectionContainer}>
            <Typography variant="subtitle3">Parcours de validation: </Typography>
            <DndModule cards={cards} setCards={setCards} allCards={allCards} />
          </Grid>
        </Grid>
        <Grid sm={6} xs={6}>
          <Grid className={classes.sectionContainer}>
            <Grid>
              <Grid className={classes.titleUserSelect}>
                <Typography variant="subtitle3" style={{ display: 'inline-block' }}>Correspondant:</Typography>
              </Grid>
              <Grid className={classes.userSelect}>
                <FormControl
                  variant="outlined"
                  error={Object.prototype.hasOwnProperty.call(errors, 'unitCorrespondent')}
                  className={classes.formSelect}
                >
                  <InputLabel ref={inputLabel} id="select-outlined-label">
                    Responsable
                  </InputLabel>
                  <Controller
                    as={(
                      <Select
                        labelId="create-unit-unitCorrespondent"
                        id="unitCorrespondent"
                        labelWidth={labelWidth}
                      >
                        {usersList && usersList.listUsers.list.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    control={control}
                    name="unitCorrespondent"
                    rules={{ required: true }}
                  />
                  {errors.unitCorrespondent && (
                    <FormHelperText className={classes.errorText}>
                      Correspondant obligatoire
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid className={classes.titleUserSelect}>
                <Typography variant="subtitle3">Adjoint(s):</Typography>
              </Grid>
              <Grid className={classes.userSelect}>
                <FormControl className={classes.formControl}>
                  {corresAssistant.map((user) => (
                    <AssistantList user={user} deleteAssistant={deleteCorresAssistant} />
                  ))}
                  <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    value={corresAssistant}
                    renderValue={() => 'optionnel'}
                    onChange={addCorresAssistant}
                  >
                    {usersList && usersList.listUsers.list.map((user) => (
                      <MenuItem key={user.id} value={user}>
                        <Checkbox checked={corresAssistant.indexOf(user) > -1} />
                        <ListItemText primary={`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.sectionContainer}>
            <Grid>
              <Grid className={classes.titleUserSelect}>
                <Typography variant="subtitle3" style={{ display: 'inline-block' }}>Officier Sécurité:</Typography>
              </Grid>
              <Grid className={classes.userSelect}>
                <FormControl
                  variant="outlined"
                  error={Object.prototype.hasOwnProperty.call(errors, 'unitOfficer')}
                  className={classes.formSelect}
                >
                  <InputLabel ref={inputLabel} id="select-outlined-label">
                    Responsable
                    <span style={{ fontStyle: 'italic' }}>: (optionnel)</span>
                  </InputLabel>
                  <Controller
                    as={(
                      <Select
                        labelId="create-unit-Officer"
                        id="unitOfficer"
                        labelWidth={labelWidth}
                      >
                        {usersList && usersList.listUsers.list.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    control={control}
                    name="unitOfficer"
                  />
                </FormControl>
              </Grid>
              <Grid className={classes.titleUserSelect}>
                <Typography variant="subtitle3">Adjoint(s):</Typography>
              </Grid>
              <Grid className={classes.userSelect}>
                <FormControl className={classes.formControl}>
                  {officerAssistant.map((user) => (
                    <AssistantList user={user} deleteAssistant={deleteOfficerAssistant} />
                  ))}
                  <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    value={officerAssistant}
                    renderValue={() => 'optionnel'}
                    onChange={addOfficerAssistant}
                  >
                    {usersList && usersList.listUsers.list.map((user) => (
                      <MenuItem key={user.id} value={user}>
                        <Checkbox checked={officerAssistant.indexOf(user) > -1} />
                        <ListItemText primary={`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
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

UnitForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default UnitForm;

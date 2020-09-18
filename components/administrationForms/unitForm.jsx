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
import { gql, useQuery, useApolloClient } from '@apollo/client';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

import { FORMS_LIST, ROLES } from '../../utils/constants/enums';
import ListLieux from '../lists/checkLieux';
import { DndModule } from '../../containers/index';
import { mapUnitData } from '../../utils/mappers/adminMappers';
import DeletableList from '../lists/deletableList';
import { useSnackBar } from '../../lib/hooks/snackbar';

const useStyles = makeStyles((theme) => ({
  createUnitForm: {
    padding: '20px',
  },
  sectionContainer: {
    marginTop: '40px',
    paddingRight: '50px',
  },
  formTextField: {
    marginTop: theme.spacing(1),
  },
  formSelect: {
    width: '300px',
    top: '-20px',
  },
  titleUserSelect: {
    display: 'inline-block',
    width: '160px',
    textAlign: 'right',
  },
  userSelect: {
    display: 'inline-block',
    width: '70%',
    padding: '0 0 15px 16px',
  },
  assistantSelect: {
    width: '250px',
    top: '-5px',
  },
  formRadio: {
    width: '100%',
  },
  radioGroup: {
    flexDirection: 'row',
  },
  instruction: {
    marginBottom: '1%',
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginLeft: '2%',
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
    query listPlaces($campusId: String!, $filters: PlaceFilters) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
          listPlaces(filters: $filters) {
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
                  roles {
                      role
                      userInCharge
                  }
              }
          }
      }
`;

const UnitForm = ({
  defaultValues, type, submitForm,
}) => {
  const classes = useStyles();
  const client = useApolloClient();
  const { addAlert } = useSnackBar();
  const {
    handleSubmit, errors, control, watch,
  } = useForm();

  const allCards = Object.values(ROLES)
    .filter((role) => role.workflow)
    .map((role, i) => ({
      id: i + 1, text: role.label, role: role.role, behavior: role.behavior,
    }));
  const createDefaultCards = () => allCards.filter(
    (card) => defaultValues.cards.find((c) => c.role === card.role),
  );
  const [cards, setCards] = useState(type === 'create' ? allCards : createDefaultCards);

  const [assistantsList, setAssistantsList] = React.useState(defaultValues.assistantsList);
  const addAssistant = (event, typeAssistant) => {
    setAssistantsList({ ...assistantsList, [typeAssistant]: event.target.value });
  };
  const deleteAssistant = (id, typeAssistant) => {
    const newUsers = assistantsList[typeAssistant].map((user) => {
      if (user.id === id) {
        return { ...user, toDelete: true };
      }
      return user;
    });
    setAssistantsList({ ...assistantsList, [typeAssistant]: newUsers });
  };

  const [expanded, setExpanded] = useState(false);
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  const [placesList, setPlacesList] = useState(null);

  const getPlacesList = async () => {
    try {
      const { data } = await client.query({
        query: GET_PLACES,
        variables: {
          filters: { unitInCharge: null },
        },
        fetchPolicy: 'no-cache',
      });
      return setPlacesList(data.getCampus.listPlaces.list);
    } catch (e) {
      return addAlert({ message: 'Erreur lors du chargement de la liste de lieux, merci de rafraichir la page', severity: 'warning' });
    }
  };
  const { data: usersList } = useQuery(GET_USERS);

  const isAssistant = (userId, typeAssistant) => assistantsList[typeAssistant].find(
    (user) => user.id === userId && !user.toDelete,
  );

  useEffect(() => {
    if (inputLabel.current) setLabelWidth(inputLabel.current.offsetWidth);
    if (!placesList) {
      getPlacesList();
    }
  }, [placesList]);

  const onSubmit = async (formData) => {
    const unitData = mapUnitData(formData, cards);
    await submitForm(formData, unitData, assistantsList);
  };

  return placesList ? (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.createUnitForm}>
      <Typography className={classes.instruction} variant="body1">Tous les champs sont obligatoires</Typography>
      <Grid container item sm={12} xs={12}>
        <Grid item sm={6} xs={6}>
          <Grid className={classes.sectionContainer}>
            <Typography variant="subtitle2">Description: </Typography>
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
                  <Typography style={{ fontStyle: 'italic' }}>
                    {'Trigramme de l\'unité, 2 à 3 lettres uniques et non editable par la suite'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.sectionContainer}>
            <Typography variant="subtitle2">Lieux: </Typography>
            <Grid className={classes.textFieldBlock}>
              <Controller
                as={(
                  <ListLieux
                    options={placesList.concat(defaultValues.placesList) || []}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    onChange={(checked) => checked}
                    defaultChecked={defaultValues.placesList}
                    label="Lieux"
                    className={classes.placesList}
                  />
                )}
                rules={{
                  validate: {
                    valide: (value) => (value && value.length > 0) || 'Le choix d\'un lieu est obligatoire',
                  },
                }}
                defaultValue={defaultValues.placesList}
                control={control}
                name="places"
              />
              {errors.places && (
              <FormHelperText className={classes.error}>{errors.places.message}</FormHelperText>
              )}
            </Grid>
          </Grid>
          <Grid className={classes.sectionContainer}>
            <Typography variant="subtitle2">Parcours de validation&nbsp;: </Typography>
            <DndModule cards={cards} setCards={setCards} allCards={allCards} />
          </Grid>
        </Grid>
        <Grid item sm={6} xs={6}>
          <Grid className={classes.sectionContainer}>
            <Grid>
              <Grid className={classes.titleUserSelect}>
                <Typography variant="subtitle2" style={{ display: 'inline-block' }}>Correspondant&nbsp;:</Typography>
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
                          !isAssistant(user.id, FORMS_LIST.CORRES_ASSISTANTS)
                          && (
                          <MenuItem key={user.id} value={user.id}>
                            {`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`}
                          </MenuItem>
                          )
                        ))}
                      </Select>
                    )}
                    control={control}
                    defaultValue={defaultValues.unitCorrespondent.id ? defaultValues.unitCorrespondent.id : ''}
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
                <Typography>Adjoint(s):</Typography>
              </Grid>
              <Grid className={classes.userSelect}>
                <FormControl className={classes.assistantSelect}>
                  {assistantsList[FORMS_LIST.CORRES_ASSISTANTS].map((user) => (
                    !user.toDelete && (
                    <DeletableList
                      key={user.id}
                      label={`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`}
                      id={user.id}
                      deleteItem={deleteAssistant}
                      type={FORMS_LIST.CORRES_ASSISTANTS}
                    />
                    )
                  ))}
                  <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    displayEmpty
                    value={assistantsList[FORMS_LIST.CORRES_ASSISTANTS]}
                    renderValue={() => (<em>optionnel</em>)}
                    onChange={(evt) => addAssistant(evt, FORMS_LIST.CORRES_ASSISTANTS)}
                  >
                    {usersList && usersList.listUsers.list.map((user) => (
                      user.id !== watch('unitCorrespondent') && (
                      <MenuItem key={user.id} value={user}>
                        <Checkbox
                          checked={assistantsList[FORMS_LIST.CORRES_ASSISTANTS].indexOf(user) > -1}
                        />
                        <ListItemText primary={`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`} />
                      </MenuItem>
                      )
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.sectionContainer}>
            <Grid>
              <Grid className={classes.titleUserSelect}>
                <Typography variant="subtitle2" style={{ display: 'inline-block' }}>Officier Sécurité&nbsp;:</Typography>
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
                          !isAssistant(user.id, FORMS_LIST.OFFICER_ASSISTANTS)
                          && (
                          <MenuItem key={user.id} value={user.id}>
                            {`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`}
                          </MenuItem>
                          )
                        ))}
                      </Select>
                    )}
                    defaultValue={defaultValues.unitOfficer.id ? defaultValues.unitOfficer.id : ''}
                    control={control}
                    name="unitOfficer"
                  />
                </FormControl>
              </Grid>
              <Grid className={classes.titleUserSelect}>
                <Typography>Adjoint(s)&nbsp;:</Typography>
              </Grid>
              <Grid className={classes.userSelect}>
                <FormControl className={classes.assistantSelect}>
                  {assistantsList[FORMS_LIST.OFFICER_ASSISTANTS].map((user) => (
                    !user.toDelete && (
                    <DeletableList
                      key={user.id}
                      label={`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`}
                      id={user.id}
                      deleteItem={deleteAssistant}
                      type={FORMS_LIST.OFFICER_ASSISTANTS}
                    />
                    )
                  ))}
                  <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    displayEmpty
                    value={assistantsList[FORMS_LIST.OFFICER_ASSISTANTS]}
                    renderValue={() => (<em>optionnel</em>)}
                    onChange={(evt) => addAssistant(evt, FORMS_LIST.OFFICER_ASSISTANTS)}
                  >
                    {usersList && usersList.listUsers.list.map((user) => (
                      user.id !== watch('unitOfficer')
                      && (
                      <MenuItem key={user.id} value={user}>
                        <Checkbox
                          checked={assistantsList[FORMS_LIST.OFFICER_ASSISTANTS].indexOf(user) > -1}
                        />
                        <ListItemText primary={`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`} />
                      </MenuItem>
                      )
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Grid>
      <Grid item sm={12} xs={12} className={classes.buttonsContainer}>
        <Link href="/administration/unites">
          <Button variant="outlined" color="primary">
            Annuler
          </Button>
        </Link>
        <Button type="submit" variant="contained" color="primary">
          {type === 'create' ? 'Créer' : 'Modifier'}
        </Button>
      </Grid>
    </form>
  ) : <div />;
};

UnitForm.propTypes = {
  defaultValues: PropTypes.objectOf(PropTypes.shape).isRequired,
  type: PropTypes.string.isRequired,
  submitForm: PropTypes.func.isRequired,
};

export default UnitForm;

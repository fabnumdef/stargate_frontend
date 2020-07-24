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
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { useRouter } from 'next/router';
import { useSnackBar } from '../../lib/ui-providers/snackbar';
import { ROLES } from '../../utils/constants/enums';
import ListLieux from '../lists/checkLieux';
import { DndModule } from '../../containers/index';
import { mapUnitData } from '../../utils/mappers/adminMappers';

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
  assistantList: {
    width: '250px',
    marginBottom: '3px',
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
  icon: {
    height: '20px',
    width: '20px',
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
              }
          }
      }
`;

const CREATE_UNIT = gql`
    mutation createUnit($campusId: String!, $unit: UnitInput!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            createUnit(unit: $unit) {
                id
            }
        }
    }
`;

const EDIT_USER = gql`
    mutation editUser($id: String!, $user: UserInput!) {
        editUser(id: $id, user: $user) {
            id
        }
    }
`;

const EDIT_PLACE = gql`
    mutation editPlace($campusId: String!, $id: String!, $place: PlaceInput!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            editPlace(id: $id, place: $place) {
                id
            }
        }
    }
`;

const AssistantList = ({ user, deleteAssistant, typeAssistant }) => {
  const classes = useStyles();

  return (
    <Grid container justify="space-between" className={classes.assistantList}>
      <span>{`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`}</span>
      <IconButton
        aria-label="supprimer"
        className={classes.icon}
        color="primary"
        onClick={() => deleteAssistant(user.id, typeAssistant)}
      >
        <DeleteIcon />
      </IconButton>
    </Grid>
  );
};

AssistantList.propTypes = {
  user: PropTypes.objectOf(PropTypes.string).isRequired,
  deleteAssistant: PropTypes.func.isRequired,
  typeAssistant: PropTypes.string.isRequired,
};

const UnitForm = ({
  defaultValues, type,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { addAlert } = useSnackBar();
  const {
    handleSubmit, errors, control,
  } = useForm();

  const allCards = Object.values(ROLES)
    .filter((role) => role.workflow)
    .map((role, i) => ({
      id: i + 1, text: role.label, role: role.role, behavior: role.behavior,
    }));
  const [cards, setCards] = useState(allCards);

  const [assistantsList, setAssistantsList] = React.useState({
    corresAssistant: [],
    officerAssistant: [],
  });
  const addAssistant = (event, typeAssistant) => {
    setAssistantsList({ ...assistantsList, [typeAssistant]: event.target.value });
  };
  const deleteAssistant = (id, typeAssistant) => {
    const newUsers = assistantsList[typeAssistant].filter((user) => user.id !== id);
    setAssistantsList({ ...assistantsList, [typeAssistant]: newUsers });
  };

  const [expanded, setExpanded] = useState(false);
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  const { data: placesList } = useQuery(GET_PLACES, {
    variables: {
      filters: { unitInCharge: null },
    },
  });
  const { data: usersList } = useQuery(GET_USERS);
  const [createUnit] = useMutation(CREATE_UNIT);
  const [editUserReq] = useMutation(EDIT_USER);
  const [editPlaceReq] = useMutation(EDIT_PLACE);

  useEffect(() => {
    if (inputLabel.current) setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const editUser = async (id, roles) => {
    try {
      await editUserReq({
        variables: {
          id,
          user: { roles },
        },
      });
    } catch (e) {
      addAlert({ message: 'Une erreur est survenue', severity: 'error' });
    }
    return true;
  };

  const onSubmit = async (formData) => {
    const unitData = mapUnitData(formData, cards);
    try {
      const { data: unitResponse } = await createUnit({ variables: { unit: unitData } });
      const unitId = unitResponse.mutateCampus.createUnit.id;
      await editUser(
        formData.unitCorrespondent,
        {
          role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
          campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
          units: { id: unitId, label: unitData.label },
        },
      );
      await Promise.all(formData.places.map(async (place) => {
        await editPlaceReq(
          {
            variables:
              {
                id: place,
                place:
                  { unitInCharge: unitId },
              },
          },
        );
      }));
      if (assistantsList.corresAssistant.length) {
        await Promise.all(assistantsList.corresAssistant.map(async (user) => {
          await editUser(
            user.id,
            {
              role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
              campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
              units: { id: unitId, label: unitData.label },
            },
          );
        }));
      }
      if (formData.unitOfficer) {
        await editUser(
          formData.unitOfficer,
          {
            role: ROLES.ROLE_SECURITY_OFFICER.role,
            campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
            units: { id: unitId, label: unitData.label },
          },
        );
      }
      if (assistantsList.officerAssistant.length) {
        await Promise.all(assistantsList.officerAssistant.map(async (user) => {
          await editUser(
            user.id,
            {
              role: ROLES.ROLE_SECURITY_OFFICER.role,
              campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
              units: { id: unitId, label: unitData.label },
            },
          );
        }));
      }
      addAlert({ message: 'L\'unité a bien été créé', severity: 'success' });
      return router.push('/administration/unites');
    } catch (e) {
      addAlert({ message: 'Une erreur est survenue', severity: 'error' });
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.createUnitForm}>
      <Typography style={{ fontWeight: 'bold', fontStyle: 'italic' }}>Tous les champs sont obligatoires</Typography>
      <Grid container item sm={12} xs={12}>
        <Grid sm={6} xs={6}>
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
            <Typography variant="subtitle2">Parcours de validation: </Typography>
            <DndModule cards={cards} setCards={setCards} allCards={allCards} />
          </Grid>
        </Grid>
        <Grid sm={6} xs={6}>
          <Grid className={classes.sectionContainer}>
            <Grid>
              <Grid className={classes.titleUserSelect}>
                <Typography variant="subtitle2" style={{ display: 'inline-block' }}>Correspondant:</Typography>
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
                    defaultValue={defaultValues.unitCorrespondent ? defaultValues.unitCorrespondent : ''}
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
                <FormControl className={classes.assistantSelect}>
                  {assistantsList.corresAssistant.map((user) => (
                    <AssistantList user={user} deleteAssistant={deleteAssistant} typeAssistant="corresAssistant" />
                  ))}
                  <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    displayEmpty
                    value={assistantsList.corresAssistant}
                    renderValue={() => (<em>optionnel</em>)}
                    onChange={(evt) => addAssistant(evt, 'corresAssistant')}
                  >
                    {usersList && usersList.listUsers.list.map((user) => (
                      <MenuItem key={user.id} value={user}>
                        <Checkbox checked={assistantsList.corresAssistant.indexOf(user) > -1} />
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
                <Typography variant="subtitle2" style={{ display: 'inline-block' }}>Officier Sécurité:</Typography>
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
                    defaultValue={defaultValues.unitOfficer ? defaultValues.unitOfficer : ''}
                    control={control}
                    name="unitOfficer"
                  />
                </FormControl>
              </Grid>
              <Grid className={classes.titleUserSelect}>
                <Typography variant="subtitle3">Adjoint(s):</Typography>
              </Grid>
              <Grid className={classes.userSelect}>
                <FormControl className={classes.assistantSelect}>
                  {assistantsList.officerAssistant.map((user) => (
                    <AssistantList user={user} deleteAssistant={deleteAssistant} typeAssistant="officerAssistant" />
                  ))}
                  <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    displayEmpty
                    value={assistantsList.officerAssistant}
                    renderValue={() => (<em>optionnel</em>)}
                    onChange={(evt) => addAssistant(evt, 'officerAssistant')}
                  >
                    {usersList && usersList.listUsers.list.map((user) => (
                      <MenuItem key={user.id} value={user}>
                        <Checkbox checked={assistantsList.officerAssistant.indexOf(user) > -1} />
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
  defaultValues: PropTypes.objectOf(PropTypes.shape).isRequired,
  type: PropTypes.string.isRequired,
};

export default UnitForm;

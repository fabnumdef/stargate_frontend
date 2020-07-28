import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Controller, useForm } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useQuery } from '@apollo/react-hooks';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import { PlaceAdministration } from '../../containers';
import DeletableList from '../lists/deletableList';

const useStyles = makeStyles(() => ({
  baseForm: {
    padding: '20px',
  },
  nameInput: {
    marginLeft: '60px',
    width: '400px',
  },
  formSelect: {
    width: '300px',
    top: '-13px',
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
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '30px',
    '& button': {
      margin: '3px',
    },
  },
}));

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

const BaseForm = ({ submitForm, defaultValues, type, campusId }) => {
  const classes = useStyles();
  const {
    handleSubmit, errors, control,
  } = useForm();

  const { data: usersList } = useQuery(GET_USERS);
  const [assistantsList, setAssistantsList] = useState({
    adminAssistant: defaultValues.assistants,
  });
  const addAssistant = (event, typeAssistant) => {
    setAssistantsList({ ...assistantsList, [typeAssistant]: event.target.value });
  };
  const deleteAssistant = (id, typeAssistant) => {
    const newUsers = assistantsList[typeAssistant].filter((user) => user.id !== id);
    setAssistantsList({ ...assistantsList, [typeAssistant]: newUsers });
  };


  const onSubmit = (data) => {
    console.log(data);
  };

  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    if (inputLabel.current) setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.baseForm}>
      <Grid container item sm={12} xs={12}>
        <Grid sm={6} xs={6}>
          <Grid container>
            <Typography variant="subtitle2">Nom&nbsp;:</Typography>
            <Controller
              as={(
                <TextField
                  inputProps={{ 'data-testid': 'campus-name' }}
                  error={Object.prototype.hasOwnProperty.call(errors, 'name')}
                  helperText={errors.name && errors.name.message}
                  className={classes.nameInput}
                />
              )}
              rules={{ validate: (value) => value.trim() !== '' || 'Le nom est obligatoire' }}
              control={control}
              name="name"
              defaultValue={defaultValues.name}
            />
          </Grid>
        </Grid>
        <Grid sm={6} xs={6}>
          <Grid container>
            <Grid className={classes.titleUserSelect}>
              <Typography variant="subtitle2">Administrateur&nbsp;:</Typography>
            </Grid>
            <Grid className={classes.userSelect}>
              <FormControl
                variant="outlined"
                error={Object.prototype.hasOwnProperty.call(errors, 'campusAdmin')}
                className={classes.formSelect}
              >
                <InputLabel ref={inputLabel} id="select-outlined-label">
                  Responsable
                </InputLabel>
                <Controller
                  as={(
                    <Select
                      labelId="create-campus-admin"
                      id="campusAdmin"
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
                  defaultValue={defaultValues.admin.id || ''}
                  name="campusAdmin"
                  rules={{ required: true }}
                />
                {errors.campusAdmin && (
                  <FormHelperText className={classes.errorText}>
                    Administrateur obligatoire
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid className={classes.titleUserSelect}>
            <Typography variant="subtitle3">Adjoint(s):</Typography>
          </Grid>
          <Grid className={classes.userSelect}>
            <FormControl className={classes.assistantSelect}>
              {assistantsList.adminAssistant.map((user) => (
                <DeletableList
                  label={`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`}
                  id={user.id}
                  deleteItem={deleteAssistant}
                  type="adminAssistant"
                />
              ))}
              <Select
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                displayEmpty
                value={assistantsList.adminAssistant}
                renderValue={() => (<em>optionnel</em>)}
                onChange={(evt) => addAssistant(evt, 'adminAssistant')}
              >
                {usersList && usersList.listUsers.list.map((user) => (
                  <MenuItem key={user.id} value={user}>
                    <Checkbox checked={assistantsList.adminAssistant.indexOf(user) > -1} />
                    <ListItemText primary={`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <PlaceAdministration campusId={campusId} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} xs={12} className={classes.buttonsContainer}>
        <Link href="/">
          <Button variant="outlined" color="primary">
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

BaseForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  defaultValues: PropTypes.objectOf(PropTypes.shape).isRequired,
  type: PropTypes.string.isRequired,
};

export default BaseForm;

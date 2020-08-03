import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
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
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import PlaceForm from './placeForm';
import DeletableList from '../lists/deletableList';
import { FORMS_LIST } from '../../utils/constants/enums';

const useStyles = makeStyles((theme) => ({
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
  loadMore: {
    margin: '4px',
    paddingTop: '4px',
    color: theme.palette.primary.main,
    textAlign: 'center',
    borderTop: '1px solid rgba(15, 65, 148, 0.1)',
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}));

const PaginationButton = ({
  users,
  fetchMore,
  selectList,
  setSelectList,
}) => {
  const classes = useStyles();

  const fetchMoreUsers = () => {
    fetchMore({
      variables: {
        cursor: { offset: users.list.length },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return setSelectList({
          listUsers:
            {
              list: [...selectList.listUsers.list, ...fetchMoreResult.listUsers.list],
              meta: fetchMoreResult.listUsers.meta,
            },
        });
      },
    });
  };

  return users.list.length < users.meta.total && (
    <Grid className={classes.loadMore} onClick={fetchMoreUsers}>
      Charger plus...
    </Grid>
  );
};

const BaseForm = ({
  submitForm, defaultValues, usersList, fetchMore,
}) => {
  const classes = useStyles();
  const {
    handleSubmit, errors, control, watch,
  } = useForm();

  const [selectList, setSelectList] = useState(usersList);

  const [assistantsList, setAssistantsList] = useState({
    [FORMS_LIST.ADMIN_ASSISTANTS]: defaultValues.assistants,
  });
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

  const [placesList, setPlacesList] = useState(defaultValues.placesList);

  const findCampusAdmin = () => selectList.listUsers.list.find((user) => user.id === defaultValues.admin.id) || '';

  const onSubmit = (data) => {
    submitForm(data, assistantsList, placesList);
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
                      {selectList && selectList.listUsers.list.map((user) => (
                        <MenuItem key={user.id} value={user}>
                          {`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`}
                        </MenuItem>
                      ))}
                      <PaginationButton
                        users={selectList.listUsers}
                        fetchMore={fetchMore}
                        selectList={selectList}
                        setSelectList={setSelectList}
                      />
                    </Select>
                  )}
                  control={control}
                  defaultValue={findCampusAdmin}
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
              {assistantsList[FORMS_LIST.ADMIN_ASSISTANTS].map((user) => (
                !user.toDelete && (
                <DeletableList
                  label={`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`}
                  id={user.id}
                  deleteItem={deleteAssistant}
                  type={FORMS_LIST.ADMIN_ASSISTANTS}
                />
                )
              ))}
              <Select
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                displayEmpty
                value={assistantsList[FORMS_LIST.ADMIN_ASSISTANTS]}
                renderValue={() => (<em>optionnel</em>)}
                onChange={(evt) => addAssistant(evt, FORMS_LIST.ADMIN_ASSISTANTS)}
              >
                {selectList && selectList.listUsers.list.map((user) => (
                  (!watch('campusAdmin') || watch('campusAdmin').id !== user.id) && (
                  <MenuItem key={user.id} value={user}>
                    <Checkbox
                      checked={assistantsList[FORMS_LIST.ADMIN_ASSISTANTS].indexOf(user) > -1}
                    />
                    <ListItemText primary={`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`} />
                  </MenuItem>
                  )
                ))}
                <PaginationButton
                  users={selectList.listUsers}
                  fetchMore={fetchMore}
                  selectList={selectList}
                  setSelectList={setSelectList}
                />
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <PlaceForm list={placesList} setList={setPlacesList} />
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
          Valider
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

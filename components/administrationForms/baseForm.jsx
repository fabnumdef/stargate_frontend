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
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { FORMS_LIST } from '../../utils/constants/enums';
import updateAssistantList from '../../utils/mappers/editAssistantList';

const useStyles = makeStyles((theme) => ({
  baseForm: {
    padding: '20px',
  },
  nameInput: {
    width: '300px',
  },
  formSelect: {
    width: '300px',
    top: '-13px',
  },
  titleUserSelect: {
    display: 'inline-block',
    width: '160px',
  },
  userSelect: {
    display: 'inline-block',
    width: '70%',
    padding: '20px 0 15px 0px',
  },
  assistantSelect: {
    width: '250px',
    top: '-5px',
  },
  assistantList: {
    width: '250px',
    marginBottom: '3px',
  },
  rightBorder: {
    borderColor: theme.palette.primary.main,
    borderRight: '2px solid',
  },
  marginAdministrator: {
    marginTop: '10%',
  },
  tableContainer: {
    maxHeight: '140px',
  },
  row: {
    borderBottom: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
    paddingLeft: '0px',
  },
  icon: {
    marginBottom: '-16px',
    marginTop: '-16px',
    padding: '1px 3px 1px 3px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '15%',
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

PaginationButton.propTypes = {
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  fetchMore: PropTypes.func.isRequired,
  selectList: PropTypes.objectOf(PropTypes.object).isRequired,
  setSelectList: PropTypes.func.isRequired,
};

const BaseForm = ({
  submitForm,
  defaultValues,
  setDefaultValues,
  usersList,
  fetchMore,
}) => {
  const classes = useStyles();
  const {
    handleSubmit, errors, control, watch, setValue,
  } = useForm();

  const [updated, setUpdated] = useState(false);

  const [selectList, setSelectList] = useState(usersList);

  const [assistantsList, setAssistantsList] = useState({
    [FORMS_LIST.ADMIN_ASSISTANTS]: defaultValues.assistants,
  });

  const editAssistant = (event, typeAssistant) => {
    const updatedList = {
      ...assistantsList,
      [typeAssistant]: updateAssistantList(event.target.value, defaultValues.assistants),
    };
    setUpdated(true);
    setAssistantsList(updatedList);
  };

  const deleteAssistant = (id, typeAssistant) => {
    const newUsers = assistantsList[typeAssistant].map((user) => {
      if (user.id === id) {
        return { ...user, toDelete: true };
      }
      return user;
    });
    setUpdated(true);
    setAssistantsList({ ...assistantsList, [typeAssistant]: newUsers });
  };

  const findCampusAdmin = () => selectList.listUsers.list.find((user) => user.id === defaultValues.admin.id) || '';

  const onSubmit = (data) => {
    const updatedDefaultValues = {
      name: data.name,
      admin: data.campusAdmin,
      assistants: assistantsList[FORMS_LIST.ADMIN_ASSISTANTS].filter(
        (user) => (user.toDelete !== true),
      ),
    };
    setDefaultValues(updatedDefaultValues);
    setUpdated(false);
    submitForm(data, assistantsList);
  };

  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    if (inputLabel.current) setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const [hover, setHover] = useState({});
  const handleMouseEnter = (index) => {
    setHover((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleMouseLeave = (index) => {
    setTimeout(() => { }, 2000);
    setHover((prevState) => ({ ...prevState, [index]: false }));
  };

  const handleCancel = () => {
    setValue('name', defaultValues.name);
    setValue('campusAdmin', defaultValues.admin ? findCampusAdmin : '');
    setAssistantsList({
      [FORMS_LIST.ADMIN_ASSISTANTS]: defaultValues.assistants,
    });
    setUpdated(false);
  };

  const editName = (campusName) => {
    setValue('name', campusName);
    setUpdated(true);
  };

  const editCampusAdmin = (admin) => {
    setValue('campusAdmin', admin);
    setUpdated(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.baseForm}>
      <Grid container item sm={12} xs={12} md={12}>
        <Grid container>
          <Grid item sm={12} xs={12} md={3}>
            <Typography variant="subtitle2">Nom&nbsp;:</Typography>
          </Grid>
          <Grid item sm={12} xs={12} md={12} lg={6}>
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
              onChange={([event]) => {
                editName(event.target.value);
                return event.target.value;
              }}
            />
          </Grid>
        </Grid>
        <Grid container className={classes.marginAdministrator}>
          <Grid item sm={12} xs={12} md={12} lg={3} className={classes.titleUserSelect}>
            <Typography variant="subtitle2">Administrateur&nbsp;:</Typography>
          </Grid>
          <Grid item sm={12} xs={12} md={12} lg={6} className={classes.userSelect}>
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
                    { selectList && selectList.listUsers.list.map((user) => (
                      <MenuItem key={user.id} value={user}>
                        { `${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}` }
                      </MenuItem>
                    )) }
                    <PaginationButton
                      users={selectList.listUsers}
                      fetchMore={fetchMore}
                      selectList={selectList}
                      setSelectList={setSelectList}
                    />
                  </Select>
                        )}
                control={control}
                defaultValue={defaultValues.admin ? findCampusAdmin : ''}
                name="campusAdmin"
                rules={{ required: true }}
                onChange={([event]) => {
                  editCampusAdmin(event.target.value);
                  return event.target.value;
                }}
              />
              { errors.campusAdmin && (
              <FormHelperText className={classes.errorText}>
                Administrateur obligatoire
              </FormHelperText>
              ) }
            </FormControl>
          </Grid>

        </Grid>
        <Grid container>
          <Grid item sm={12} xs={12} md={12} lg={3} className={classes.titleUserSelect}>
            <Typography>Adjoint(s) :</Typography>
          </Grid>
          <Grid item sm={12} xs={12} md={12} lg={6} className={classes.userSelect}>
            <FormControl className={classes.assistantSelect}>
              <TableContainer className={classes.tableContainer}>
                <Table size="small" data-testid="placeTable">
                  <TableBody>
                    { assistantsList[FORMS_LIST.ADMIN_ASSISTANTS].map((user, index) => (
                      !user.toDelete && (
                      <TableRow
                        key={user.id}
                        hover
                        onMouseOver={() => handleMouseEnter(index)}
                        onFocus={() => handleMouseEnter(index)}
                        onMouseLeave={() => handleMouseLeave(index)}
                        tabIndex={-1}
                      >
                        <TableCell key={user.id} className={classes.row}>
                          { `${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}` }
                        </TableCell>
                        <TableCell key="delete" className={classes.row}>
                          { hover[index] && (
                          <div style={{ float: 'right' }}>
                            <IconButton
                              aria-label="supprimer"
                              className={classes.icon}
                              color="primary"
                              onClick={() => deleteAssistant(user.id, FORMS_LIST.ADMIN_ASSISTANTS)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </div>
                          ) }
                        </TableCell>
                      </TableRow>
                      ))) }
                  </TableBody>
                </Table>
              </TableContainer>
              <Select
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                displayEmpty
                value={assistantsList[FORMS_LIST.ADMIN_ASSISTANTS]}
                renderValue={() => (<em>optionnel</em>)}
                onChange={(evt) => editAssistant(evt, FORMS_LIST.ADMIN_ASSISTANTS)}
              >
                { selectList && selectList.listUsers.list.map((user) => (
                  (!watch('campusAdmin') || watch('campusAdmin').id !== user.id) && (
                  <MenuItem key={user.id} value={user}>
                    <Checkbox
                      checked={assistantsList[FORMS_LIST.ADMIN_ASSISTANTS].filter((
                        (assistant) => (assistant.id === user.id && !assistant.toDelete))).length}
                    />
                    <ListItemText primary={`${user.rank ? user.rank : ''} ${user.firstname} ${user.lastname}`} />
                  </MenuItem>
                  )
                )) }
                <PaginationButton
                  users={selectList.listUsers}
                  fetchMore={fetchMore}
                  selectList={selectList}
                  setSelectList={setSelectList}
                />
              </Select>
            </FormControl>
          </Grid>
        </Grid>

      </Grid>
      <Grid item sm={12} xs={12} className={classes.buttonsContainer}>
        <Button onClick={handleCancel} disabled={!updated} variant="outlined" color="primary">
          Annuler
        </Button>
        <Button type="submit" disabled={!updated} variant="contained" color="primary">
          Sauvegarder
        </Button>
      </Grid>
    </form>

  );
};

BaseForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  defaultValues: PropTypes.objectOf(PropTypes.shape).isRequired,
  setDefaultValues: PropTypes.func.isRequired,
  usersList: PropTypes.objectOf(PropTypes.object).isRequired,
  fetchMore: PropTypes.func.isRequired,
};

export default BaseForm;

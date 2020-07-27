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
    marginLeft: '20px',
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

const BaseForm = ({ submitForm, defaultValues }) => {
  console.log(defaultValues)
  const classes = useStyles();
  const {
    handleSubmit, errors, control,
  } = useForm();

  const { data: usersList } = useQuery(GET_USERS);

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
            <Typography variant="h6">Nom:</Typography>
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
            <Typography variant="h6">Administrateur:</Typography>
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
                defaultValue={defaultValues.admin || ''}
                name="unitCorrespondent"
                rules={{ required: true }}
              />
              {errors.unitCorrespondent && (
                <FormHelperText className={classes.errorText}>
                  Administrateur obligatoire
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

BaseForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  defaultValues: PropTypes.objectOf(PropTypes.shape).isRequired,
};

export default BaseForm;

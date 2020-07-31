import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeletableList from '../lists/deletableList';

const useStyles = makeStyles(() => ({
  placesContainer: {
    width: '440px',
    margin: '25px 35px',
  },
  placesHeader: {
    height: '50px',
    backgroundColor: 'rgba(15, 65, 148, 0.1)',
    padding: '10px 15px',
  },
  placesForm: {
    padding: '20px',
  },
  inputContainer: {
    width: '250px',
  },
  submitButton: {
    color: 'white',
    width: '20px',
    height: '20px',
    borderRadius: '5px',
    boxShadow: '5px 3px 6px 0 rgba(0, 0, 0, 0.16)',
  },
}));

const PlaceForm = ({ list, setList }) => {
  const classes = useStyles();
  const [placeName, setPlaceName] = useState('');

  const handleAdd = async () => {
    if (!placeName.length) {
      return null;
    }
    const newList = [...list, { label: placeName }];
    setList(newList);
    return setPlaceName('');
  };

  const handleDelete = async (label) => {
    const newList = list.map((place) => {
      if (place.label === label) {
        return { ...place, toDelete: true };
      }
      return place;
    });
    setList(newList);
  };

  return (
    <Grid className={classes.placesContainer}>
      <Grid container className={classes.placesHeader}>
        <Typography variant="subtitle2">Lieux</Typography>
      </Grid>
      <Grid className={classes.placesForm}>
        {list.map((place) => (
          !place.toDelete && (
            <DeletableList label={place.label} id={place.label} deleteItem={handleDelete} />
          )
        ))}
        <Grid container md={12} sm={12} xs={12} justify="space-between" alignItems="flex-end" className={classes.inputContainer}>
          <TextField
            label="Nom"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
          />
          <Button type="button" className={classes.submitButton} variant="contained" color="primary" onClick={handleAdd}>
            +
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PlaceForm;

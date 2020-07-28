import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
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
    boxShadow: '5px 3px 6px 0',
  },
}));

const PlaceForm = ({ list, createPlace, deletePlace }) => {
  const classes = useStyles();
  const [placesList, setPlacesList] = useState(list);
  const [placeName, setPlaceName] = useState('');
  const [loadSubmit, setLoadSubmit] = useState(false);

  useEffect(() => {
    setPlacesList(list);
  }, [list]);

  const handleCreate = async () => {
    setLoadSubmit(true);
    const place = await createPlace(placeName);
    if (place) {
      const newPlaces = [...placesList, place];
      setPlacesList(newPlaces);
      setPlaceName('');
    }
    return setLoadSubmit(false);
  };

  const handleDelete = async (id) => {
    setLoadSubmit(true);
    const place = await deletePlace(id);
    if (place) {
      const newPlaces = placesList.filter((p) => p.id !== id);
      setPlacesList(newPlaces);
    }
    return setLoadSubmit(false);
  };

  return (
    <Grid className={classes.placesContainer}>
      <Grid container className={classes.placesHeader}>
        <Typography variant="subtitle2">Lieux</Typography>
      </Grid>
      <Grid className={classes.placesForm}>
        {placesList.map((place) => (
          <DeletableList label={place.label} id={place.id} deleteItem={handleDelete} />
        ))}
        <Grid container md={12} sm={12} xs={12} justify="space-between" alignItems="flex-end" className={classes.inputContainer}>
          <TextField
            label="Nom"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
          />
          {loadSubmit
            ? <CircularProgress className={classes.loader} size={15} />

            : (
              <Button type="button" className={classes.submitButton} variant="contained" color="primary" onClick={handleCreate}>
                +
              </Button>
            )}
        </Grid>

      </Grid>
    </Grid>
  );
};

export default PlaceForm;

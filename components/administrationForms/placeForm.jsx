import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { fade } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CustomTableHeader from '../styled/customTableCellHeader';

const useStyles = makeStyles((theme) => ({
  placesContainer: {

    margin: '25px 35px',
  },
  placesContaineSize: {
    width: '440px',
  },
  placesHeader: {
    height: '50px',
    backgroundColor: 'rgba(15, 65, 148, 0.1)',
    padding: '10px 15px',
  },
  placesForm: {
    paddingLeft: '40px',
  },
  inputContainer: {
    width: '250px',
    alignItems: 'flex-end',
    paddingLeft: '16px',
  },
  tableContainer: {
    maxHeight: '280px',
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  submitButton: {
    color: 'white',
    width: '20px',
    height: '20px',
    borderRadius: '5px',
    boxShadow: '5px 3px 6px 0 rgba(0, 0, 0, 0.16)',
  },
  row: {
    borderBottom: 'none',
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
  headerPlaces: {
    backgroundColor: fade(theme.palette.primary.main, 0.05),
    color: theme.palette.primary.main,
  },
}
));
// '(min-width:955px)';
const PlaceForm = ({ list, submitForm }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  const classes = useStyles();
  const {
    handleSubmit,
  } = useForm();
  const [placeName, setPlaceName] = useState('');
  const [placesList, setPlaceList] = useState(list);
  const [hover, setHover] = useState({});

  const handleAdd = async () => {
    if (!placeName.length) {
      return null;
    }
    if (placesList.some((e) => e.label === placeName)) {
      return null;
    }
    const newList = [...placesList, { label: placeName }];
    setPlaceList(newList);
    return setPlaceName('');
  };

  const handleDelete = async (label) => {
    const newList = placesList.map((place) => {
      if (place.label === label) {
        return { ...place, toDelete: true };
      }
      return place;
    });
    setPlaceList(newList);
  };

  const onSubmitPlaces = () => {
    submitForm(placesList);
  };

  const handleMouseEnter = (index) => {
    setHover((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleMouseLeave = (index) => {
    setTimeout(() => { }, 2000);
    setHover((prevState) => ({ ...prevState, [index]: false }));
  };

  const handleCancel = () => {
    setPlaceList(list);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitPlaces)}>
      <Grid className={`${
        matches ? classes.placesContaine : ''} ${classes.placesContaineSize} `}
      >

        <Grid className={`${
          matches ? classes.placesForm : ''}`}
        >
          <TableContainer className={classes.tableContainer}>
            <Table size="small" data-testid="placeTable">
              <TableHead>
                <TableRow>
                  <CustomTableHeader>
                    Lieux
                  </CustomTableHeader>
                  <CustomTableHeader key="action" style={{ minWidth: '50px', width: '60px' }} />
                </TableRow>
              </TableHead>
              <TableBody>
                { placesList.map((place, index) => !place.toDelete && (
                  <TableRow
                    hover
                    onMouseOver={() => handleMouseEnter(index)}
                    onFocus={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                    tabIndex={-1}
                  >
                    <TableCell key={place.id} className={classes.row}>
                      { place.label }
                    </TableCell>
                    <TableCell key="delete" className={classes.row}>
                      { hover[index] && (
                      <div style={{ float: 'right' }}>
                        <IconButton
                          aria-label="supprimer"
                          className={classes.icon}
                          color="primary"
                          onClick={() => handleDelete(place.label)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                      ) }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container className={classes.nameContainer}>
            <Grid item md={5} sm={5} xs={5} className={classes.inputContainer}>
              <TextField
                label="Nom"
                onChange={(e) => setPlaceName(e.target.value)}
                value={placeName}
              />
            </Grid>
            <Grid item md={2} sm={2} xs={2}>
              <Button type="button" className={classes.submitButton} variant="contained" color="primary" onClick={handleAdd}>
                +
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} xs={12} className={classes.buttonsContainer}>
        <Button onClick={handleCancel} variant="outlined" color="primary">
          Annuler
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Sauvegarder
        </Button>
      </Grid>
    </form>
  );
};

PlaceForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultValues: PropTypes.shape({ createdPlaceName: PropTypes.string }).isRequired,
};

export default PlaceForm;

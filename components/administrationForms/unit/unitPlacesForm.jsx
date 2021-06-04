import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Controller, useForm } from 'react-hook-form';

import ListLieux from '../../lists/checkLieux';

const useStyles = makeStyles((theme) => ({
    workflow: {
        marginLeft: theme.spacing(8)
    },
    createUnitManagementForm: {
        padding: '20px 50px'
    },
    fieldLabel: {
        fontWeight: 'bold'
    },
    error: {
        color: theme.palette.error.main
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& button': {
            margin: '3px'
        }
    }
}));

const UnitPlacesForm = ({ unitPlacesList, placesList, updatePlaces }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    const { handleSubmit, errors, control } = useForm({
        unitPlacesList: { places: unitPlacesList }
    });

    const onSubmit = (formData) => {
        updatePlaces(formData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
                <Grid item sm={12}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Lieux
                    </Typography>
                </Grid>
                <Grid item sm={4}>
                    <Controller
                        as={
                            <ListLieux
                                options={placesList.concat(unitPlacesList)}
                                expanded={expanded}
                                setExpanded={setExpanded}
                                defaultChecked={unitPlacesList}
                                onChange={(checked) => checked}
                                label="Lieux"
                            />
                        }
                        rules={{
                            validate: (value) =>
                                (value && value.length > 0) || "Le choix d'un lieu est obligatoire"
                        }}
                        control={control}
                        name="places"
                    />
                    {errors.places && (
                        <FormHelperText className={classes.error}>
                            {errors.places.message}
                        </FormHelperText>
                    )}
                </Grid>
            </Grid>
            <Grid item sm={12} xs={12} className={classes.buttonsContainer}>
                <Button type="submit" variant="contained" color="primary">
                    Valider
                </Button>
                <Button onClick={() => {}} variant="contained" color="primary">
                    Annuler
                </Button>
            </Grid>
        </form>
    );
};

UnitPlacesForm.propTypes = {
    placesList: PropTypes.objectOf(PropTypes.shape).isRequired,
    unitPlacesList: PropTypes.objectOf(PropTypes.shape).isRequired,
    updatePlaces: PropTypes.func.isRequired
};

export default UnitPlacesForm;

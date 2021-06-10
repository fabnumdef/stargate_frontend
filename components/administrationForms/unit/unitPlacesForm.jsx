import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import { Controller, useForm } from 'react-hook-form';

import ListLieux from '../../lists/checkLieux';
import ItemCard from '../../styled/itemCard';
import RoundedIconButton, { ROUNDED_BUTTON_TYPE } from '../../styled/RoundedIconButton';
import RoundButton from '../../styled/common/roundButton';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    placesForm: {
        padding: `20px 10px 23px 50px`,
        backgroundColor: theme.palette.background.layout,
        borderRadius: 4,
        marginBottom: 20
    },
    createUnitManagementForm: {
        padding: '20px 50px'
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
    },
    validateBtn: {
        width: 110,
        height: 36
    }
}));

const UnitPlacesForm = ({ unitPlacesList, placesList, updatePlaces, loadValidateForm }) => {
    const classes = useStyles();
    const [editPlaces, setEditPlaces] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const { handleSubmit, errors, control } = useForm({
        unitPlacesList: { places: unitPlacesList }
    });

    const onSubmit = async (formData) => {
        await updatePlaces(formData);
        setEditPlaces(false);
        setExpanded(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container className={classes.placesForm}>
                <Grid container sm={editPlaces ? 9 : 11}>
                    <Grid item sm={12}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Lieux
                        </Typography>
                    </Grid>
                    {editPlaces ? (
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
                                        (value && value.length > 0) ||
                                        "Le choix d'un lieu est obligatoire"
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
                    ) : (
                        <Grid item container>
                            {unitPlacesList.map((place) => {
                                return <ItemCard key={place.id}>{place.label}</ItemCard>;
                            })}
                        </Grid>
                    )}
                </Grid>
                <Grid sm={editPlaces ? 3 : 1} className={classes.buttonsContainer}>
                    {editPlaces ? (
                        <Grid>
                            <RoundButton
                                onClick={() => setEditPlaces(false)}
                                variant="outlined"
                                color="primary">
                                Annuler
                            </RoundButton>
                            <RoundButton
                                type="submit"
                                variant="outlined"
                                color="primary"
                                className={classes.validateBtn}>
                                {loadValidateForm ? <CircularProgress size={20} /> : 'Valider'}
                            </RoundButton>
                        </Grid>
                    ) : (
                        <Grid>
                            <RoundedIconButton
                                onClick={() => setEditPlaces(true)}
                                type={ROUNDED_BUTTON_TYPE.EDIT}
                            />
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

UnitPlacesForm.propTypes = {
    placesList: PropTypes.objectOf(PropTypes.shape).isRequired,
    unitPlacesList: PropTypes.objectOf(PropTypes.shape).isRequired,
    updatePlaces: PropTypes.func.isRequired,
    loadValidateForm: PropTypes.bool.isRequired
};

export default UnitPlacesForm;

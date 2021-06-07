import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Controller, useForm } from 'react-hook-form';
import { mapUnitData } from '../../../utils/mappers/adminMappers';
import { ROLES } from '../../../utils/constants/enums';
import { DndModule } from '../../../containers';
import Paper from '@material-ui/core/Paper';
import RoundButton from '../../styled/common/roundButton';

const useStyles = makeStyles((theme) => ({
    workflow: {
        marginLeft: theme.spacing(8)
    },
    createUnitForm: {
        padding: '20px 30px',
        marginBottom: 20
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
            margin: '25px 3px 0 3px'
        }
    },
    deleteButton: {
        color: 'red',
        justifyItems: 'flex-end'
    }
}));

const UnitForm = ({ defaultValues, submitForm, handleDeleteUnit, cancelEdit }) => {
    const classes = useStyles();

    const allCards = Object.values(ROLES)
        .filter((role) => role.workflow)
        .map((role, i) => ({
            id: i + 1,
            text: role.shortLabel,
            role: role.role,
            behavior: role.behavior
        }));

    const [cards, setCards] = useState(defaultValues.cards);

    const { handleSubmit, errors, control } = useForm({
        defaultValues
    });

    const onSubmit = (formData) => {
        const unitData = mapUnitData(formData, cards);
        submitForm(unitData);
    };

    const onDelete = () => {
        handleDeleteUnit(defaultValues.name);
    };

    return (
        <Paper className={classes.createUnitForm}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                    {/* Base part */}
                    {defaultValues.id && (
                        <Grid container justify="flex-end">
                            <RoundButton
                                onClick={() => onDelete()}
                                variant="outlined"
                                className={classes.deleteButton}>
                                Supprimer Unité
                            </RoundButton>
                        </Grid>
                    )}
                    <Grid item container spacing={2}>
                        <Grid item sm={12}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Unité
                            </Typography>
                        </Grid>
                        <Grid item sm={12}>
                            <Controller
                                as={
                                    <TextField
                                        label="Nom complet"
                                        style={{ width: '330px' }}
                                        inputProps={{ 'data-testid': 'create-unit-name' }}
                                        error={Object.prototype.hasOwnProperty.call(errors, 'name')}
                                        helperText={errors.name && errors.name.message}
                                        variant="outlined"
                                    />
                                }
                                rules={{
                                    required: 'Le nom est obligatoire'
                                }}
                                control={control}
                                name="name"
                                defaultValue={defaultValues.name || ''}
                            />
                        </Grid>
                        <Grid item sm={12}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Trigramme
                            </Typography>
                        </Grid>
                        <Grid item sm={12}>
                            <Controller
                                as={
                                    <TextField
                                        label="3 lettres"
                                        inputProps={{
                                            maxLength: 3
                                        }}
                                        error={Object.prototype.hasOwnProperty.call(
                                            errors,
                                            'trigram'
                                        )}
                                        helperText={errors.trigram && errors.trigram.message}
                                        variant="outlined"
                                    />
                                }
                                rules={{
                                    validate: {
                                        valide: (value) =>
                                            value.trim() !== '' || 'Le trigramme est obligatoire',
                                        format: (value) =>
                                            (value.length >= 2 && value.length <= 3) ||
                                            'Le trigramme doit avoir 2 ou 3 caractères'
                                    }
                                }}
                                control={control}
                                name="trigram"
                                defaultValue={defaultValues.trigram || ''}
                            />
                        </Grid>
                    </Grid>
                    {/* Workflow part */}
                    <Grid item container>
                        <Grid item sm={12}>
                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                Parcours de validation
                            </Typography>
                            <DndModule cards={cards} setCards={setCards} allCards={allCards} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sm={12} xs={12} className={classes.buttonsContainer}>
                    <RoundButton variant="outlined" color="primary" onClick={cancelEdit}>
                        Annuler
                    </RoundButton>
                    <RoundButton type="submit" variant="outlined" color="primary">
                        Valider
                    </RoundButton>
                </Grid>
            </form>
        </Paper>
    );
};

UnitForm.propTypes = {
    submitForm: PropTypes.func.isRequired,
    handleDeleteUnit: PropTypes.func,
    defaultValues: PropTypes.objectOf({
        name: PropTypes.string.isRequired,
        trigram: PropTypes.string.isRequired,
        cards: PropTypes.array.isRequired
    }),
    cancelEdit: PropTypes.func.isRequired
};

export default UnitForm;

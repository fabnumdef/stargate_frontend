import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    baseForm: {
        padding: '20px'
    },
    mainInput: {
        width: '300px',
        marginBottom: '20px',
        '& input': {
            padding: '20px 12px 20px'
        }
    },
    fieldLabel: {
        fontWeight: 'bold'
    },
    formSelect: {
        width: '300px',
        top: '-13px'
    },
    titleUserSelect: {
        display: 'inline-block',
        width: '160px'
    },
    userSelect: {
        display: 'inline-block',
        width: '70%',
        padding: '20px 0 15px 0px'
    },
    assistantSelect: {
        width: '250px',
        top: '-5px'
    },
    assistantList: {
        width: '250px',
        marginBottom: '3px'
    },
    rightBorder: {
        borderColor: theme.palette.primary.main,
        borderRight: '2px solid'
    },
    marginAdministrator: {
        marginTop: '50px'
    },
    tableContainer: {
        maxHeight: '140px'
    },
    row: {
        borderBottom: 'none',
        color: 'rgba(0, 0, 0, 0.87)',
        paddingLeft: '0px'
    },
    icon: {
        marginBottom: '-16px',
        marginTop: '-16px',
        padding: '1px 3px 1px 3px'
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '15%',
        '& button': {
            margin: '3px'
        }
    },
    loadMore: {
        margin: '4px',
        paddingTop: '4px',
        color: theme.palette.primary.main,
        textAlign: 'center',
        borderTop: '1px solid rgba(15, 65, 148, 0.1)',
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline'
        }
    }
}));

const CampusForm = ({ submitForm, defaultValues }) => {
    const classes = useStyles();
    const { handleSubmit, errors, control, setValue } = useForm();

    const [updated, setUpdated] = useState(false);

    const onSubmit = (data) => {
        setUpdated(false);
        submitForm(data);
    };

    const handleCancel = () => {
        setValue('name', defaultValues.name);
        setUpdated(false);
    };

    const editLabel = (campusLabel) => {
        setValue('label', campusLabel);
        setUpdated(true);
    };

    return (
        <Paper elevation={3}>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.baseForm}>
                <Grid container item sm={12} xs={12} md={12}>
                    <Grid container>
                        <Grid item sm={12} xs={12} md={4}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Identifiant&nbsp;:
                            </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12} md={12} lg={6}>
                            <Controller
                                as={
                                    <TextField
                                        inputProps={{ 'data-testid': 'campus-id' }}
                                        error={Object.prototype.hasOwnProperty.call(errors, 'id')}
                                        helperText={errors.id && errors.id.message}
                                        variant="filled"
                                        className={classes.mainInput}
                                    />
                                }
                                rules={{
                                    validate: (value) =>
                                        value.trim() !== '' || "L'identifiant est obligatoire"
                                }}
                                control={control}
                                name="id"
                                defaultValue={defaultValues.id}
                                disabled={defaultValues.id.length}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item sm={12} xs={12} md={4}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Nom&nbsp;:
                            </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12} md={12} lg={6}>
                            <Controller
                                as={
                                    <TextField
                                        inputProps={{ 'data-testid': 'campus-name' }}
                                        error={Object.prototype.hasOwnProperty.call(
                                            errors,
                                            'label'
                                        )}
                                        helperText={errors.label && errors.label.message}
                                        variant="filled"
                                        className={classes.mainInput}
                                    />
                                }
                                rules={{
                                    validate: (value) =>
                                        value.trim() !== '' || 'Le nom est obligatoire'
                                }}
                                control={control}
                                name="label"
                                defaultValue={defaultValues.label}
                                onChange={([event]) => {
                                    editLabel(event.target.value);
                                    return event.target.value;
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item sm={12} xs={12} md={4}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Trigramme&nbsp;:
                            </Typography>
                            <Typography variant="subtitle2" style={{ fontStyle: 'italic' }}>
                                Trigramme de la base, 2 à 3 lettres uniques et non editable par la
                                suite
                            </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12} md={12} lg={6}>
                            <Controller
                                as={
                                    <TextField
                                        inputProps={{ 'data-testid': 'campus-trigram' }}
                                        error={Object.prototype.hasOwnProperty.call(
                                            errors,
                                            'trigram'
                                        )}
                                        helperText={errors.trigram && errors.trigram.message}
                                        variant="filled"
                                        className={classes.mainInput}
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
                                defaultValue={defaultValues.trigram ? defaultValues.trigram : ''}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sm={12} xs={12} className={classes.buttonsContainer}>
                    <Button
                        onClick={handleCancel}
                        disabled={!updated}
                        variant="outlined"
                        color="primary">
                        Annuler
                    </Button>
                    <Button type="submit" disabled={!updated} variant="contained" color="primary">
                        Sauvegarder
                    </Button>
                </Grid>
            </form>
        </Paper>
    );
};

CampusForm.propTypes = {
    submitForm: PropTypes.func.isRequired,
    defaultValues: PropTypes.objectOf(PropTypes.shape).isRequired
};

export default CampusForm;

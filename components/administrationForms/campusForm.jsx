import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { useRouter } from 'next/router';

const useStyles = makeStyles(() => ({
    baseForm: {
        padding: '20px'
    },
    mainInput: {
        width: '100%',
        marginBottom: '20px',
        '& input': {
            padding: '20px 12px 20px'
        }
    },
    fieldLabel: {
        fontWeight: 'bold'
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '15%',
        '& button': {
            margin: '3px'
        }
    }
}));

const CampusForm = ({ submitForm, defaultValues }) => {
    const classes = useStyles();
    const router = useRouter();
    const { handleSubmit, errors, control } = useForm();

    const onSubmit = (data) => {
        submitForm(data);
    };

    const handleCancel = () => {
        if (defaultValues.id.length) {
            return router.push(`/administration/base/${defaultValues.id}`);
        }
        return router.push('/administration/base');
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
                        <Grid item sm={12} xs={12} md={12} lg={8}>
                            <Controller
                                as={
                                    <TextField
                                        inputProps={{ 'data-testid': 'campus-id' }}
                                        error={Object.prototype.hasOwnProperty.call(errors, 'id')}
                                        helperText={errors.id && errors.id.message}
                                        variant="filled"
                                        className={classes.mainInput}
                                        placeholder={'Ex: BASE-NAVALE'}
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
                        <Grid item sm={12} xs={12} md={12} lg={8}>
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
                                        placeholder={'Ex: Base Navale'}
                                    />
                                }
                                rules={{
                                    validate: (value) =>
                                        value.trim() !== '' || 'Le nom est obligatoire'
                                }}
                                control={control}
                                name="label"
                                defaultValue={defaultValues.label}
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
                        <Grid item sm={12} xs={12} md={12} lg={3}>
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
                                        placeholder={'Ex: BNV'}
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
                    <Button onClick={handleCancel} variant="outlined" color="primary">
                        Annuler
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {defaultValues.id.length ? 'Modifier' : 'Suivant'}
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

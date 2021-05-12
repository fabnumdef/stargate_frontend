import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
// import { useSnackBar } from '../../lib/hooks/snackbar';
import { Controller, useForm } from 'react-hook-form';
import { GET_PLACES_LIST } from '../../lib/apollo/queries';
import { useRouter } from 'next/router';
import ItemCard from '../styled/itemCard';
import ListLieux from '../lists/checkLieux';
import Paper from '@material-ui/core/Paper';
import LoadingCircle from '../styled/animations/loadingCircle';
const useStyles = makeStyles((theme) => ({
    workflow: {
        marginLeft: theme.spacing(8)
    },
    createUnitForm: {
        padding: '20px'
    },
    fieldLabel: {
        fontWeight: 'bold'
    },
    error: {
        color: theme.palette.error.main
    },
    buttonCancel: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
}));

const UnitForm = ({ defaultValues, submitForm }) => {
    const router = useRouter();
    const { campusId } = router.query;
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    // const { addAlert } = useSnackBar();
    const { handleSubmit, errors, control } = useForm();

    const checkMailFormat = (value) => {
        const [username, mail] = value.split('@');
        return username.split('.').length === 2 && mail === 'intradef.gouv.fr';
    };

    const { data: placesList, loading } = useQuery(GET_PLACES_LIST, { variables: { campusId } });

    const onSubmit = (formData) => {
        submitForm(formData);
    };

    if (loading) return <LoadingCircle />;
    return (
        <Paper elevation={3}>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.createUnitForm}>
                <Grid container spacing={4}>
                    {/* Base part */}
                    <Grid item container spacing={2}>
                        <Grid item sm={2}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Nom complet unité :
                            </Typography>
                        </Grid>
                        <Grid item sm={10}>
                            <Controller
                                as={
                                    <TextField
                                        style={{ width: '330px' }}
                                        size="small"
                                        inputProps={{ 'data-testid': 'create-unit-name' }}
                                        error={Object.prototype.hasOwnProperty.call(errors, 'name')}
                                        helperText={errors.name && errors.name.message}
                                        variant="outlined"
                                    />
                                }
                                rules={{
                                    validate: (value) =>
                                        value.trim() !== '' || 'Le nom est obligatoire'
                                }}
                                control={control}
                                name="name"
                                defaultValue={defaultValues.name ?? ''}
                            />
                        </Grid>
                        <Grid item sm={2}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Trigramme :
                            </Typography>
                        </Grid>
                        <Grid item sm={10}>
                            <Controller
                                as={
                                    <TextField
                                        size="small"
                                        inputProps={{
                                            'data-testid': 'create-unit-trigram',
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
                                defaultValue={defaultValues.trigram ?? ''}
                            />
                        </Grid>
                    </Grid>
                    {/* Email part */}
                    <Grid item container spacing={2}>
                        <Grid item sm={2}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                E-mail fonctionnel :
                            </Typography>
                        </Grid>
                        <Grid item sm={10}>
                            <TextField
                                size="small"
                                inputProps={{ 'data-testid': 'unit-emailfonctionnel' }}
                                variant="outlined"
                                placeholder="email"
                            />
                        </Grid>
                        <Grid item sm={2}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Correspondant unité :
                            </Typography>
                        </Grid>
                        <Grid item sm={10}>
                            <Controller
                                as={
                                    <TextField
                                        size="small"
                                        inputProps={{ 'data-testid': 'unit-corresemail' }}
                                        error={Object.prototype.hasOwnProperty.call(
                                            errors,
                                            'corresemail'
                                        )}
                                        helperText={
                                            errors.corresemail && errors.corresemail.message
                                        }
                                        variant="outlined"
                                        placeholder="email"
                                    />
                                }
                                rules={{
                                    validate: (value) =>
                                        value.trim() !== '' ||
                                        "Le correspondant d'unité est obligatoire",
                                    format: (value) =>
                                        checkMailFormat(value) ||
                                        "L'email doit être au format nom.prenom@intradef.gouv.fr"
                                }}
                                control={control}
                                name="corresemail"
                                defaultValue={defaultValues.corresemail ?? ''}
                            />
                        </Grid>
                        <Grid item sm={2}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Officier sécurité :
                            </Typography>
                        </Grid>
                        <Grid item sm={10}>
                            <Controller
                                as={
                                    <TextField
                                        size="small"
                                        inputProps={{ 'data-testid': 'unit-offsecuemail' }}
                                        error={Object.prototype.hasOwnProperty.call(
                                            errors,
                                            'offsecuemail'
                                        )}
                                        helperText={
                                            errors.offsecuemail && errors.offsecuemail.message
                                        }
                                        variant="outlined"
                                        placeholder="email"
                                    />
                                }
                                rules={{
                                    validate: (value) =>
                                        value.trim() !== '' ||
                                        "L'officier de sécurité est obligatoire",
                                    format: (value) =>
                                        checkMailFormat(value) ||
                                        "L'email doit être au format nom.prenom@intradef.gouv.fr"
                                }}
                                control={control}
                                name="offsecuemail"
                                defaultValue={defaultValues.offsecuemail}
                            />
                        </Grid>
                    </Grid>
                    {/* Workflow part */}
                    <Grid item container>
                        <Grid item sm={12}>
                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                Parcours de validation :
                            </Typography>
                        </Grid>
                        <Grid item>
                            <ItemCard style={{ cursor: 'pointer', fontSize: 35 }}>+</ItemCard>
                        </Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item sm={12}>
                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                Lieux :
                            </Typography>
                        </Grid>
                        <Grid item sm={3}>
                            <Controller
                                as={
                                    <ListLieux
                                        options={
                                            placesList ? placesList.getCampus.listPlaces.list : []
                                        }
                                        expanded={expanded}
                                        setExpanded={setExpanded}
                                        defaultChecked={[]}
                                        onChange={(checked) => checked}
                                    />
                                }
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
                </Grid>
                <div className={classes.buttonCancel}>
                    <Button onClick={() => router.back()} variant="contained" color="primary">
                        Annuler
                    </Button>
                </div>
            </form>
        </Paper>
    );
};

UnitForm.propTypes = {
    defaultValues: PropTypes.objectOf(PropTypes.shape).isRequired,
    submitForm: PropTypes.func.isRequired,
    campusId: PropTypes.string.isRequired
};

export default UnitForm;

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

import { ROLES } from '../../utils/constants/enums';
import { DndModule } from '../../containers';

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
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        '& button': {
            margin: '3px'
        }
    }
}));

const UnitForm = ({ defaultValues, type, submitForm }) => {
    const router = useRouter();
    const { campusId } = router.query;
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    const allCards = Object.values(ROLES)
        .filter((role) => role.workflow)
        .map((role, i) => ({
            id: i + 1,
            text: role.label,
            role: role.role,
            behavior: role.behavior
        }));

    const createDefaultCards = () =>
        defaultValues.cards.map((card) => allCards.find((c) => c.role === card.role));

    const [cards, setCards] = useState(type === 'create' ? allCards : createDefaultCards);

    const findOs = cards.find((card) => card.role === ROLES.ROLE_SECURITY_OFFICER.role);

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

    const listPlaces = defaultValues.placesList.concat(
        placesList?.getCampus.listPlaces.list.filter((place) => place.unitInCharge.id === null)
    );

    if (loading) return <LoadingCircle />;
    return (
        <Paper elevation={3}>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.createUnitForm}>
                <Grid container spacing={4}>
                    {/* Base part */}
                    <Grid item container spacing={2}>
                        <Grid item sm={12} md={2}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Nom complet unité :
                            </Typography>
                        </Grid>
                        <Grid item sm={12} md={10}>
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
                                    required: 'Le nom est obligatoire'
                                }}
                                control={control}
                                name="name"
                                defaultValue={defaultValues.name || ''}
                            />
                        </Grid>
                        <Grid item sm={12} md={2}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Trigramme :
                            </Typography>
                        </Grid>
                        <Grid item sm={12} md={10}>
                            <Controller
                                as={
                                    <TextField
                                        size="small"
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
                    {/* Email part */}
                    <Grid item container spacing={2}>
                        <Grid item sm={12} md={2}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                E-mail fonctionnel :
                            </Typography>
                        </Grid>
                        <Grid item sm={12} md={10}>
                            <Controller
                                as={
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        placeholder="email"
                                        disabled
                                    />
                                }
                                rules={{
                                    format: (value) =>
                                        checkMailFormat(value) ||
                                        "L'email doit être au format nom.prenom@intradef.gouv.fr"
                                }}
                                control={control}
                                name="corresemail"
                                defaultValue=""
                            />
                        </Grid>
                        <Grid item sm={12} md={2}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Correspondant unité :
                            </Typography>
                        </Grid>
                        <Grid item sm={12} md={10}>
                            <Controller
                                as={
                                    <TextField
                                        size="small"
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
                                    validate: {
                                        valide: (value) =>
                                            value.trim() !== '' ||
                                            "Le correspondant d'unité est obligatoire",
                                        format: (value) =>
                                            checkMailFormat(value) ||
                                            "L'email doit être au format nom.prenom@intradef.gouv.fr"
                                    }
                                }}
                                control={control}
                                name="corresemail"
                                defaultValue={
                                    defaultValues.unitCorrespondent?.email?.original ?? ''
                                }
                            />
                        </Grid>
                        <Grid item sm={12} md={2}>
                            <Typography variant="body1" className={classes.fieldLabel}>
                                Officier sécurité :
                            </Typography>
                        </Grid>
                        <Grid item sm={12} md={10}>
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
                                    validate: {
                                        valide: (value) =>
                                            (findOs && value.trim() !== '') ||
                                            "L'officier de sécurité est obligatoire",
                                        format: (value) =>
                                            checkMailFormat(value) ||
                                            "L'email doit être au format nom.prenom@intradef.gouv.fr"
                                    }
                                }}
                                control={control}
                                name="offsecuemail"
                                defaultValue={defaultValues.unitOfficer?.email?.original ?? ''}
                            />
                        </Grid>
                    </Grid>
                    {/* Workflow part */}
                    <Grid item container>
                        <Grid item sm={12}>
                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                Parcours de validation :
                            </Typography>
                            <DndModule cards={cards} setCards={setCards} allCards={allCards} />
                        </Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item sm={12}>
                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                Lieux :
                            </Typography>
                        </Grid>
                        <Grid item sm={4}>
                            <Controller
                                as={
                                    <ListLieux
                                        options={listPlaces ? listPlaces : []}
                                        expanded={expanded}
                                        setExpanded={setExpanded}
                                        defaultChecked={defaultValues.placesList}
                                        onChange={(checked) => checked}
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
                    </Grid>
                </Grid>
                <Grid item sm={12} xs={12} className={classes.buttonsContainer}>
                    <Button onClick={() => router.back()} variant="contained" color="primary">
                        Annuler
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Valider
                    </Button>
                </Grid>
            </form>
        </Paper>
    );
};

UnitForm.propTypes = {
    defaultValues: PropTypes.objectOf(PropTypes.shape).isRequired,
    type: PropTypes.string.isRequired,
    submitForm: PropTypes.func.isRequired
};

export default UnitForm;

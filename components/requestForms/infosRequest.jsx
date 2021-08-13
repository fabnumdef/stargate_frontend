import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';

// React Hook Form Validations
import { useForm, Controller } from 'react-hook-form';

// Apollo
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
// Material UI Imports
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import ButtonsFooterContainer from '../styled/common/ButtonsFooterContainer';
import RoundButton from '../styled/common/roundButton';

import { isValid, differenceInDays, isBefore, isThursday, isFriday } from 'date-fns';
import validator from 'validator';

import InputAdornment from '@material-ui/core/InputAdornment';
import { mapRequestEdit, mapCreateRequest } from '../../utils/mappers/requestAcces';

import { useSnackBar } from '../../lib/hooks/snackbar';

// Date Validators
import CheckAnimation from '../styled/animations/checked';

import { REQUEST_OBJECT } from '../../utils/constants/enums';
import ListLieux from '../lists/checkLieux';
import DatePicker from '../styled/date';
import { activeRoleCacheVar } from '../../lib/apollo/cache';

const useStyles = makeStyles((theme) => ({
    radioGroup: {
        flexDirection: 'row'
    },
    formControl: {
        margin: theme.spacing(2)
    },
    paper: {
        padding: theme.spacing(1)
    },
    icon: {
        color: '#fdd835',
        marginRight: '10px',
        marginBottom: '-4px'
    },
    spacingComps: {
        marginBottom: '5vh'
    },
    buttonNext: {
        marginTop: '4vh'
    },
    fixedButton: {
        position: 'fixed',
        bottom: '10vh',
        right: '10vw'
    },
    instruction: {
        marginBottom: '1%',
        fontStyle: 'italic',
        fontWeight: 'bold',
        marginLeft: '2%'
    },
    infos: {
        color: 'rgba(0, 0, 0,0.25)'
    },
    infoTime: {
        backgroundColor: theme.palette.background.layout,
        borderLeft: `3px solid ${theme.palette.primary.light}`,
        paddingTop: '15px'
    },
    infoTimeTitle: {
        fontWeight: 'bold',
        paddingLeft: '16px'
    },
    infoTimeItem: {
        paddingTop: '0px',
        paddingBottom: '0px',
        marginTop: '0px',
        marginBottom: '0px'
    },
    infoIcon: {
        marginLeft: '10px',
        color: theme.palette.primary.light
    },
    error: {
        color: theme.palette.error.main
    },
    radioNature: {
        flexDirection: 'row'
    },
    radioLabel: {
        marginRight: '70px'
    },
    checkPos: {
        marginBottom: '5px'
    },
    fieldLabel: {
        fontWeight: 'bold'
    },
    placesTitle: {
        maxHeight: 55
    }
}));

// is not a business day
function isDeadlineRespected(value) {
    const today = new Date();
    const days = differenceInDays(value, today);
    if (isThursday(today) || isFriday(today)) {
        return days >= 4;
    }
    return days >= 2;
}
const fromMinDate = () => {
    const date = new Date();
    if (isThursday(date)) {
        return date.setDate(date.getDate() + 5);
    }
    if (isFriday(date)) {
        return date.setDate(date.getDate() + 4);
    }
    return date.setDate(date.getDate() + 3);
};

const REQUEST_ATTRIBUTES = gql`
    fragment RequestResult on Request {
        id
        object
        reason
        from
        to
        places {
            id
            label
        }
    }
`;
export const GET_PLACES_LIST = gql`
    query getPlacesList($campusId: String!) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            listPlaces {
                list {
                    id
                    label
                    unitInCharge {
                        id
                        label
                    }
                }
            }
        }
    }
`;
export const CREATE_REQUEST = gql`
    mutation createRequest(
        $request: RequestInput!
        $campusId: String!
        $unit: RequestOwnerUnitInput!
    ) {
        campusId @client @export(as: "campusId")
        activeRoleCache @client @export(as: "unit") {
            id: unit
            label: unitLabel
        }
        mutateCampus(id: $campusId) {
            createRequest(request: $request, unit: $unit) {
                ...RequestResult
            }
        }
    }
    ${REQUEST_ATTRIBUTES}
`;

export const EDIT_REQUEST = gql`
    mutation editRequest($id: String!, $request: RequestInput!, $campusId: String!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            editRequest(id: $id, request: $request) {
                ...RequestResult
            }
        }
    }
    ${REQUEST_ATTRIBUTES}
`;

export default function FormInfosClaimant({ formData, setForm, handleNext, group }) {
    const classes = useStyles();

    const { addAlert } = useSnackBar();
    const client = useApolloClient();

    const { data: placesList } = useQuery(GET_PLACES_LIST);

    const checkSelection = async (value) => {
        const { data } = await client.query({ query: GET_PLACES_LIST });
        const filter = data.getCampus.listPlaces.list.filter((place) =>
            value.find(
                (p) =>
                    p.id === place.id &&
                    (place.unitInCharge.id === activeRoleCacheVar().unit || !place.unitInCharge.id)
            )
        );
        return (
            filter.length > 0 ||
            'Vous devez choisir au moins un lieu correspondant à votre unité ou le Port Militaire'
        );
    };

    const [createRequest] = useMutation(CREATE_REQUEST, {
        onCompleted: (data) => {
            console.log('data');
            console.log(data);
            setForm({ ...data.mutateCampus.createRequest, visitors: formData.visitors });
            handleNext();
        },
        onError: (error) => {
            // Display good message
            addAlert({
                message: error.message,
                severity: 'info'
            });
        }
    });

    const [updateRequest] = useMutation(EDIT_REQUEST, {
        onCompleted: (data) => {
            setForm({ ...data.mutateCampus.editRequest, visitors: formData.visitors });
            handleNext();
        },
        onError: (error) => {
            // Display good message
            addAlert({
                message: error.message,
                severity: 'error'
            });
        }
    });

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        setValue
    } = useForm();

    useEffect(() => {
        if (formData.id) {
            // eslint-disable-next-line no-restricted-syntax
            const requestData = mapRequestEdit(formData);
            // eslint-disable-next-line no-restricted-syntax
            for (const [key, value] of Object.entries(requestData)) {
                setValue(key, value);
            }
        }
    }, []);

    // states of expanded composant for area to choose
    const [expanded, setExpanded] = useState(false);

    const onSubmit = (data) => {
        const request = mapCreateRequest(data, group);

        if (!formData.id) {
            createRequest({
                variables: {
                    request
                }
            });
        } else {
            updateRequest({
                variables: {
                    id: formData.id,
                    request
                }
            });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Debut Main principal Layout */}
                <Grid container spacing={6}>
                    <Typography
                        variant="body2"
                        className={`${classes.instruction} ${classes.infos}`}>
                        Tous les champs sont obligatoire.
                    </Typography>
                    {group && (
                        <Grid item sm={12} xs={12} md={12}>
                            <Grid container>
                                {/* Item 1 */}

                                <Grid item md={2} sm={12}>
                                    <Typography variant="body2" className={classes.fieldLabel}>
                                        Responsable visite :
                                    </Typography>
                                </Grid>
                                <Grid container item md={10} sm={12} xs={12} spacing={3}>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Controller
                                            render={({ field }) => (
                                                <TextField
                                                    id={'refEmail'}
                                                    {...field}
                                                    label="Email"
                                                    variant="filled"
                                                    error={Object.prototype.hasOwnProperty.call(
                                                        errors,
                                                        'refEmail'
                                                    )}
                                                    InputProps={
                                                        watch('refEmail') &&
                                                        validator.isEmail(watch('refEmail')) && {
                                                            endAdornment: (
                                                                <InputAdornment
                                                                    position="end"
                                                                    className={classes.checkPos}>
                                                                    <CheckAnimation />
                                                                </InputAdornment>
                                                            )
                                                        }
                                                    }
                                                    InputLabelProps={{ htmlFor: 'refEmail' }}
                                                    helperText={errors.refEmail?.message}
                                                    fullWidth
                                                />
                                            )}
                                            control={control}
                                            name="refEmail"
                                            defaultValue=""
                                            rules={{
                                                required: "L'email du référent est obligatoire",
                                                validate: (value) =>
                                                    validator.isEmail(value) || 'Format invalide'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Controller
                                            name="refName"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    id={'refName'}
                                                    {...field}
                                                    label="Nom"
                                                    fullWidth
                                                    variant="filled"
                                                    InputLabelProps={{ htmlFor: 'refName' }}
                                                    error={Object.prototype.hasOwnProperty.call(
                                                        errors,
                                                        'refName'
                                                    )}
                                                    helperText={errors.refName?.message}
                                                />
                                            )}
                                            defaultValue=""
                                            rules={{
                                                validate: (value) =>
                                                    value.trim() !== '' || 'Le nom est obligatoire'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Controller
                                            name="refFirstName"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    id={'refFirstName'}
                                                    {...field}
                                                    label="Prénom"
                                                    fullWidth
                                                    variant="filled"
                                                    InputLabelProps={{ htmlFor: 'refFirstName' }}
                                                    error={Object.prototype.hasOwnProperty.call(
                                                        errors,
                                                        'refFirstName'
                                                    )}
                                                    helperText={errors.refFirstName?.message}
                                                />
                                            )}
                                            defaultValue=""
                                            rules={{
                                                validate: (value) =>
                                                    value.trim() !== '' ||
                                                    'Le prénom est obligatoire'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Controller
                                            name="refPhone"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    id={'refPhone'}
                                                    {...field}
                                                    label="Téléphone"
                                                    type="tel"
                                                    fullWidth
                                                    variant="filled"
                                                    InputLabelProps={{ htmlFor: 'refPhone' }}
                                                    error={Object.prototype.hasOwnProperty.call(
                                                        errors,
                                                        'refPhone'
                                                    )}
                                                    helperText={errors.refPhone?.message}
                                                />
                                            )}
                                            defaultValue=""
                                        />
                                        <FormHelperText className={classes.instruction}>
                                            optionnel
                                        </FormHelperText>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                    <Grid container item>
                        <Grid
                            sm={12}
                            xs={12}
                            md={8}
                            item
                            container
                            direction="row"
                            alignItems="center"
                            spacing={2}>
                            {/* Item 1 */}
                            <Grid item xs={12} sm={12} md={3}>
                                <Typography variant="body2" className={classes.fieldLabel}>
                                    Nature de la visite:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={9}>
                                <FormControl
                                    error={Object.prototype.hasOwnProperty.call(errors, 'object')}
                                    component="div">
                                    <Controller
                                        render={({ field }) => (
                                            <RadioGroup
                                                {...field}
                                                className={classes.radioNature}
                                                aria-label="object">
                                                <FormControlLabel
                                                    value={REQUEST_OBJECT.PROFESSIONAL}
                                                    control={<Radio color="primary" />}
                                                    label={
                                                        <Typography variant="caption">
                                                            Professionnelle
                                                        </Typography>
                                                    }
                                                    labelPlacement="end"
                                                    className={classes.radioLabel}
                                                />
                                                <FormControlLabel
                                                    value={REQUEST_OBJECT.PRIVATE}
                                                    control={<Radio color="primary" />}
                                                    label={
                                                        <Typography variant="caption">
                                                            Privée
                                                        </Typography>
                                                    }
                                                    labelPlacement="end"
                                                />
                                            </RadioGroup>
                                        )}
                                        control={control}
                                        rules={{
                                            required: 'La nature de la visite est obligatoire.'
                                        }}
                                        name="object"
                                        defaultValue=""
                                    />
                                    {errors.object && (
                                        <FormHelperText>{errors.object.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Item 4: Selections des dates */}

                            <Grid item xs={12} sm={12} md={3}>
                                <Typography variant="body2" className={classes.fieldLabel}>
                                    Période d&apos;accès :
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                alignItems="flex-end"
                                spacing={6}
                                item
                                xs={12}
                                sm={12}
                                md={9}>
                                <Grid item sm={5} xs={5}>
                                    <Controller
                                        render={({ field: { value, onChange } }) => (
                                            <DatePicker
                                                id={'from'}
                                                value={value}
                                                onChange={onChange}
                                                minDate={fromMinDate()}
                                                label="du"
                                                error={Object.prototype.hasOwnProperty.call(
                                                    errors,
                                                    'from'
                                                )}
                                                disablePast
                                                helperText={errors.from?.message}
                                                fullWidth
                                                InputLabelProps={{ htmlFor: 'from' }}
                                            />
                                        )}
                                        control={control}
                                        name="from"
                                        rules={{
                                            required: 'La date de début est obligatoire.',
                                            validate: {
                                                format: (value) =>
                                                    isValid(value) ||
                                                    'Le format de date ne correspond pas',
                                                valide: (value) =>
                                                    isDeadlineRespected(value) ||
                                                    'Le délai minimum avant visite est de 2 jours ouvrés'
                                            }
                                        }}
                                        defaultValue={null}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography>au</Typography>
                                </Grid>
                                <Grid item sm={5} xs={5}>
                                    <Controller
                                        render={({ field: { value, onChange } }) => (
                                            <DatePicker
                                                id={'to'}
                                                value={value}
                                                onChange={onChange}
                                                minDate={watch('from')}
                                                label="(inclus)"
                                                error={Object.prototype.hasOwnProperty.call(
                                                    errors,
                                                    'to'
                                                )}
                                                helperText={errors.to?.message}
                                                InputLabelProps={{ htmlFor: 'to' }}
                                                disablePast
                                                disabled={!watch('from')}
                                                fullWidth
                                            />
                                        )}
                                        control={control}
                                        name="to"
                                        rules={{
                                            required: 'La date de fin est obligatoire',
                                            validate: {
                                                format: (value) =>
                                                    isValid(value) || 'Format invalide',
                                                valide: (value) =>
                                                    !isBefore(value, watch('from')) ||
                                                    'Date éronnée'
                                            }
                                        }}
                                        defaultValue={null}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Column 2 */}
                        <Grid item md={4} sm={12} xs={12}>
                            {/* Item 5: Période d'acces */}
                            <Grid container className={classes.infoTime}>
                                <Grid item md={1} style={{ textAlign: 'end' }}>
                                    <ErrorOutlineIcon className={classes.infoIcon} />
                                </Grid>
                                <Grid item md={11}>
                                    <Typography variant="caption" className={classes.infoTimeTitle}>
                                        Informations délais de traitement avant la date de visite
                                    </Typography>
                                    <List>
                                        <ListItem className={classes.infoTimeItem}>
                                            <ListItemText
                                                primary="• Français: 2 jours ouvrés"
                                                primaryTypographyProps={{ variant: 'caption' }}
                                            />
                                        </ListItem>
                                        <ListItem className={classes.infoTimeItem}>
                                            <ListItemText
                                                primary="• UE: 15 jours ouvrés"
                                                primaryTypographyProps={{ variant: 'caption' }}
                                            />
                                        </ListItem>
                                        <ListItem className={classes.infoTimeItem}>
                                            <ListItemText
                                                primary="• Hors UE: 30 jours ouvrés"
                                                primaryTypographyProps={{ variant: 'caption' }}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Item 6: Motif */}
                    <Grid item container>
                        <Grid container item alignItems="center" xs={12} sm={12} md={2}>
                            <Typography variant="body2" className={classes.fieldLabel}>
                                Motif de la visite :
                            </Typography>
                        </Grid>
                        <Grid item sm={12} xs={12} md={10}>
                            <Controller
                                name="reason"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        id={'reason'}
                                        {...field}
                                        error={Object.prototype.hasOwnProperty.call(
                                            errors,
                                            'reason'
                                        )}
                                        helperText={errors.reason?.message}
                                        variant="filled"
                                        fullWidth
                                        multiline
                                        InputLabelProps={{
                                            htmlFor: 'reason'
                                        }}
                                    />
                                )}
                                rules={{
                                    validate: (value) =>
                                        value?.trim() !== '' || 'Le motif est obligatoire'
                                }}
                                defaultValue={''}
                            />
                        </Grid>
                    </Grid>

                    {/* Item 1: Liste des lieux */}
                    <Grid item container>
                        <Grid
                            container
                            item
                            alignItems="center"
                            className={classes.placesTitle}
                            xs={12}
                            sm={12}
                            md={2}>
                            <Typography variant="body2" className={classes.fieldLabel} gutterBottom>
                                Accès lieux:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={10}>
                            <Controller
                                render={({ field: { onChange } }) => (
                                    <ListLieux
                                        onChange={onChange}
                                        options={
                                            placesList ? placesList.getCampus.listPlaces.list : []
                                        }
                                        expanded={expanded}
                                        setExpanded={setExpanded}
                                        defaultChecked={formData.places}
                                        label="Lieux"
                                    />
                                )}
                                rules={{
                                    validate: {
                                        valide: (value) =>
                                            (value && value.length > 0) ||
                                            "Le choix d'un lieu est obligatoire",
                                        acceptedSelection: (value) => checkSelection(value)
                                    }
                                }}
                                control={control}
                                name="places"
                                defaultValue={formData.places}
                            />
                            {errors.places && (
                                <FormHelperText className={classes.error}>
                                    {errors.places.message}
                                </FormHelperText>
                            )}
                        </Grid>
                    </Grid>

                    <ButtonsFooterContainer>
                        <Link href="/">
                            <RoundButton variant="outlined" color="secondary">
                                Annuler
                            </RoundButton>
                        </Link>
                        <RoundButton type="submit" variant="contained" color="secondary">
                            Continuer
                        </RoundButton>
                    </ButtonsFooterContainer>
                    {/* Column 3 */}
                </Grid>
            </form>
        </div>
    );
}

FormInfosClaimant.propTypes = {
    formData: PropTypes.shape({
        id: PropTypes.string,
        visitors: PropTypes.arrayOf(PropTypes.object),
        request: PropTypes.objectOf(PropTypes.object),
        places: PropTypes.array
    }).isRequired,
    setForm: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
    group: PropTypes.bool.isRequired
};

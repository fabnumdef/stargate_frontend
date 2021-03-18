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
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { isValid, differenceInDays, isBefore, isThursday, isFriday } from 'date-fns';
import validator from 'validator';

import InputAdornment from '@material-ui/core/InputAdornment';
import { mapRequestEdit, mapCreateRequest } from '../../utils/mappers/requestAcces';

import { useSnackBar } from '../../lib/hooks/snackbar';

// Date Validators
import CheckAnimation from '../styled/animations/checked';

import { REQUEST_OBJECT, STATE_REQUEST } from '../../utils/constants/enums';
import ListLieux from '../lists/checkLieux';
import DatePicker from '../styled/date';
import { useLogin } from '../../lib/loginContext';

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
    comps: {
        marginLeft: '3vw'
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
    infoTime: {
        paddingTop: '0px',
        paddingBottom: '0px',
        marginTop: '0px',
        marginBottom: '0px'
    },
    error: {
        color: theme.palette.error.main
    },
    radioNature: {
        flexDirection: 'row',
        marginLeft: '-7%'
    },
    buttonCancel: {
        marginRight: '5px'
    },
    checkPos: {
        marginBottom: '5px'
    }
}));

// eslint-disable-next-line no-unused-vars
function getTypeEmploie() {
    return [
        'Consultant',
        'Interimaire',
        'Stagiare',
        'Livreur',
        'Militaire actif',
        'Réserviste',
        'Civil de la Defense',
        'Famille',
        'Autorité'
    ];
}

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

export const LIST_MY_REQUESTS = gql`
    query listMyRequests($campusId: String!, $cursor: OffsetCursor!, $filters: RequestFilters!) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            listMyRequests(filters: $filters, cursor: $cursor) {
                list {
                    id
                }
                meta {
                    total
                }
            }
        }
    }
`;

export default function FormInfosClaimant({ formData, setForm, handleNext, group }) {
    const classes = useStyles();

    const { addAlert } = useSnackBar();
    const client = useApolloClient();

    const { data: placesList } = useQuery(GET_PLACES_LIST);
    const { activeRole } = useLogin();
    const { campusId } = client.readQuery({
        query: gql`
            query getCampusId {
                campusId
            }
        `
    });

    const checkSelection = async (value) => {
        const { data } = await client.query({ query: GET_PLACES_LIST });
        const filter = data.getCampus.listPlaces.list.filter((place) =>
            value.find(
                (p) =>
                    p.id === place.id &&
                    (place.unitInCharge.id === activeRole.unit || !place.unitInCharge.id)
            )
        );
        return (
            filter.length > 0 ||
            'Vous devez choisir au moins un lieu correspondant à votre unité ou le Port Militaire'
        );
    };

    const [createRequest] = useMutation(CREATE_REQUEST, {
        update: (
            cache,
            {
                data: {
                    mutateCampus: { createRequest: createdRequest }
                }
            }
        ) => {
            const currentRequests = cache.readQuery({
                query: LIST_MY_REQUESTS,
                variables: {
                    filters: { status: STATE_REQUEST.STATE_CREATED.state },
                    cursor: { first: 10, offset: 0 },
                    campusId
                }
            });
            const updatedTotal = currentRequests.getCampus.listMyRequests.meta.total + 1;
            const updatedRequests = {
                ...currentRequests,
                getCampus: {
                    ...currentRequests.getCampus,
                    listMyRequests: {
                        ...currentRequests.getCampus.listMyRequests,
                        list: [...currentRequests.getCampus.listMyRequests.list, createdRequest],
                        meta: {
                            ...currentRequests.getCampus.listMyRequests.meta,
                            total: updatedTotal
                        }
                    }
                }
            };
            cache.writeQuery({
                query: LIST_MY_REQUESTS,
                variables: {
                    filters: { status: STATE_REQUEST.STATE_CREATED.state },
                    cursor: { first: 10, offset: 0 }
                },
                data: updatedRequests,
                campusId
            });
        },
        onCompleted: (data) => {
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

    const { register, control, handleSubmit, watch, errors, setValue } = useForm();

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
            <form data-testid="form-demandeur" onSubmit={handleSubmit(onSubmit)}>
                {/* Debut Main principal Layout */}
                <Grid container spacing={6}>
                    {group && (
                        <Grid item sm={12} xs={12} md={12}>
                            <Grid container direction="column">
                                {/* Item 1 */}
                                <Grid item md={12} sm={12}>
                                    <Typography variant="subtitle2">Référent groupe :</Typography>
                                </Grid>
                                <Grid item sm={6} xs={6}>
                                    <Controller
                                        as={
                                            <TextField
                                                label="Email"
                                                error={Object.prototype.hasOwnProperty.call(
                                                    errors,
                                                    'refEmail'
                                                )}
                                                InputProps={
                                                    watch('refEmail') &&
                                                    validator.isEmail(watch('refEmail'))
                                                        ? {
                                                              endAdornment: (
                                                                  <InputAdornment
                                                                      position="end"
                                                                      className={classes.checkPos}>
                                                                      <CheckAnimation />
                                                                  </InputAdornment>
                                                              ),
                                                              inputProps: {
                                                                  'data-testid': 'visiteur-email'
                                                              }
                                                          }
                                                        : {
                                                              inputProps: {
                                                                  'data-testid': 'visiteur-email'
                                                              }
                                                          }
                                                }
                                                helperText={
                                                    errors.refEmail && errors.refEmail.message
                                                }
                                                fullWidth
                                            />
                                        }
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

                                <Grid item sm={6} xs={6}>
                                    <TextField
                                        label="Nom"
                                        fullWidth
                                        name="refName"
                                        error={Object.prototype.hasOwnProperty.call(
                                            errors,
                                            'refName'
                                        )}
                                        helperText={errors.refName && errors.refName.message}
                                        inputRef={register({
                                            validate: (value) =>
                                                value.trim() !== '' || 'Le nom est obligatoire'
                                        })}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={6}>
                                    <TextField
                                        label="Prénom"
                                        fullWidth
                                        name="refFirstName"
                                        error={Object.prototype.hasOwnProperty.call(
                                            errors,
                                            'refFirstName'
                                        )}
                                        helperText={
                                            errors.refFirstName && errors.refFirstName.message
                                        }
                                        inputRef={register({
                                            validate: (value) =>
                                                value.trim() !== '' || 'Le prénom est obligatoire'
                                        })}
                                    />
                                </Grid>
                                <Grid item sm={6} xs={6}>
                                    <Controller
                                        as={
                                            <TextField
                                                label="Téléphone"
                                                type="tel"
                                                fullWidth
                                                error={Object.prototype.hasOwnProperty.call(
                                                    errors,
                                                    'refPhone'
                                                )}
                                                helperText={
                                                    errors.refPhone && errors.refPhone.message
                                                }
                                                inputRef={register()}
                                            />
                                        }
                                        control={control}
                                        name="refPhone"
                                        defaultValue=""
                                    />
                                    <FormHelperText className={classes.instruction}>
                                        optionnel
                                    </FormHelperText>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                    <Grid item sm={12} xs={12} md={6}>
                        <Grid container direction="row" spacing={2}>
                            {/* Item 1 */}

                            <Grid item xs={12} sm={12}>
                                <Typography variant="subtitle2">Nature visite :</Typography>
                            </Grid>
                            <Grid className={classes.comps} item xs={12} sm={12}>
                                <FormControl
                                    error={Object.prototype.hasOwnProperty.call(errors, 'object')}
                                    component="div">
                                    <Controller
                                        as={
                                            <RadioGroup
                                                className={classes.radioNature}
                                                aria-label="object">
                                                <FormControlLabel
                                                    value={REQUEST_OBJECT.PROFESSIONAL}
                                                    control={<Radio color="primary" />}
                                                    label="Professionnelle"
                                                    labelPlacement="start"
                                                />
                                                <FormControlLabel
                                                    value={REQUEST_OBJECT.PRIVATE}
                                                    control={<Radio color="primary" />}
                                                    label="Privée"
                                                    labelPlacement="start"
                                                />
                                            </RadioGroup>
                                        }
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
                            <Grid item xs={12} sm={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Période d&apos;accès :
                                </Typography>
                            </Grid>

                            {/* Item 4: Selections des dates */}
                            <Grid className={classes.comps} item xs={12} sm={12}>
                                <Grid container justify="space-between">
                                    <Grid item sm={5} xs={5}>
                                        <Controller
                                            as={
                                                <DatePicker
                                                    minDate={fromMinDate()}
                                                    label="du"
                                                    error={Object.prototype.hasOwnProperty.call(
                                                        errors,
                                                        'from'
                                                    )}
                                                    disablePast
                                                    helperText={errors.from && errors.from.message}
                                                    fullWidth
                                                    inputProps={{
                                                        'data-testid': 'datedebut-visite'
                                                    }}
                                                />
                                            }
                                            control={control}
                                            name="from"
                                            rules={{
                                                required: 'La date de début est obligatoire.',
                                                validate: {
                                                    format: (value) =>
                                                        isValid(value) || 'Format invalide',
                                                    valide: (value) =>
                                                        isDeadlineRespected(value) ||
                                                        'Le délai minimum avant visite est de 2 jours ouvrés'
                                                }
                                            }}
                                            defaultValue={null}
                                        />
                                    </Grid>
                                    <Grid item sm={5} xs={5}>
                                        <Controller
                                            as={
                                                <DatePicker
                                                    minDate={watch('from')}
                                                    label="au (inclus)"
                                                    error={Object.prototype.hasOwnProperty.call(
                                                        errors,
                                                        'to'
                                                    )}
                                                    helperText={errors.to && errors.to.message}
                                                    disablePast
                                                    disabled={!watch('from')}
                                                    fullWidth
                                                    inputProps={{
                                                        'data-testid': 'datefin-visite'
                                                    }}
                                                />
                                            }
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

                            {/* Item 5: Période d'acces */}
                            <Grid className={classes.comps} item xs={12} sm={12}>
                                <Grid container spacing={1} style={{ color: '#c78005' }}>
                                    <Grid item xs={12} md={12}>
                                        <Typography variant="body1">
                                            Délais de traitement avant la date de visite :
                                        </Typography>
                                        <List>
                                            <ListItem className={classes.infoTime}>
                                                <ListItemText primary="• Français: 2 jours ouvrés" />
                                            </ListItem>
                                            <ListItem className={classes.infoTime}>
                                                <ListItemText primary="• UE: 15 jours ouvrés" />
                                            </ListItem>
                                            <ListItem className={classes.infoTime}>
                                                <ListItemText primary="• Hors UE: 30 jours ouvrés" />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Item 6: Motif */}
                            <Grid item xs={12} sm={12}>
                                <Typography variant="subtitle2">Motif de la visite :</Typography>
                            </Grid>
                            <Grid className={classes.comps} item sm={12} xs={12}>
                                <TextField
                                    className={classes.testBlue}
                                    name="reason"
                                    error={Object.prototype.hasOwnProperty.call(errors, 'reason')}
                                    helperText={errors.reason && errors.reason.message}
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    inputRef={register({
                                        validate: (value) =>
                                            value.trim() !== '' || 'Le motif est obligatoire'
                                    })}
                                    inputProps={{
                                        'data-testid': 'motif-visite'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Column 2 */}
                    <Grid item md={6} sm={12} xs={12}>
                        <Grid container spacing={2}>
                            {/* Item 1: Liste des lieux */}

                            <Grid item xs={12} sm={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Accès lieux :
                                </Typography>
                            </Grid>

                            <Grid className={classes.comps} item md={12} xs={12} sm={12}>
                                <Controller
                                    as={
                                        <ListLieux
                                            options={
                                                placesList
                                                    ? placesList.getCampus.listPlaces.list
                                                    : []
                                            }
                                            expanded={expanded}
                                            setExpanded={setExpanded}
                                            defaultChecked={formData.places}
                                            onChange={(checked) => checked}
                                            label="Lieux"
                                        />
                                    }
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
                    </Grid>

                    <Grid item sm={12} xs={12}>
                        <Grid container justify="flex-end">
                            <Link href="/">
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    className={classes.buttonCancel}>
                                    Annuler
                                </Button>
                            </Link>
                            <Button type="submit" variant="contained" color="primary">
                                Continuer
                            </Button>
                        </Grid>
                    </Grid>
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

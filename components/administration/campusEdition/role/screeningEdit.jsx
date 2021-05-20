import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PageTitle from '../../../styled/common/pageTitle';
import { ROLES } from '../../../../utils/constants/enums';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
    checkMailFormat,
    SCREENING_DOMAIN_MAIL
} from '../../../../utils/mappers/createUserFromMail';
import { Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import SquareButton from '../../../styled/common/squareButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useRouter } from 'next/router';
import { ADMIN_CAMPUS_MANAGEMENT } from '../../../../utils/constants/appUrls';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    section: {
        marginBottom: 30
    },
    listScreening: {
        margin: '10px 16px !important'
    },
    icon: {
        color: 'rgba(0, 0, 0, 0.25)',
        padding: '0 !important',
        '&:hover': {
            color: theme.palette.primary.main
        }
    },
    submitScreeningCreateButton: {
        marginLeft: 30
    },
    screeningListItem: {
        borderRadius: 4,
        paddingLeft: 5,
        '&:hover': {
            backgroundColor: theme.palette.background.layoutDark,
            transition: '.4s'
        }
    }
}));

function ScreeningEdit({ campus, role, screeningUsers, submitCreateUser, deleteScreeningRole }) {
    const classes = useStyles();
    const router = useRouter();
    const { control, handleSubmit, errors, setValue } = useForm();

    const handleCreateScreening = async (formData) => {
        const isUserCreate = await submitCreateUser(formData);
        if (isUserCreate) {
            setValue('screeningEmail', '');
        }
    };

    const handleDeleteScreeningRole = async (id) => {
        deleteScreeningRole(id);
    };

    return (
        <Grid>
            <Grid style={{ marginBottom: 50 }}>
                <PageTitle subtitles={[campus.label, ROLES[role].label]}>Base</PageTitle>
            </Grid>
            <Paper style={{ padding: 30 }} elevation={2}>
                <Grid>
                    <form onSubmit={handleSubmit(handleCreateScreening)}>
                        <Grid container alignItems="center" sm={8}>
                            <Grid item sm={1}>
                                {!screeningUsers.list.length && <WarningIcon />}
                            </Grid>
                            <Grid item sm={3}>
                                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                    Responsable(s):
                                </Typography>
                            </Grid>
                            <Grid container alignItems="center" item sm={8}>
                                <Grid item sm={8}>
                                    <Controller
                                        as={
                                            <TextField
                                                label="Email"
                                                variant="filled"
                                                fullWidth
                                                error={Object.prototype.hasOwnProperty.call(
                                                    errors,
                                                    'screeningEmail'
                                                )}
                                                helperText={
                                                    errors.screeningEmail &&
                                                    errors.screeningEmail.message
                                                }
                                            />
                                        }
                                        control={control}
                                        name="screeningEmail"
                                        defaultValue=""
                                        rules={{
                                            validate: (value) =>
                                                checkMailFormat(value, SCREENING_DOMAIN_MAIL) ||
                                                `L'email doit être au format nom.prenom@${SCREENING_DOMAIN_MAIL}`
                                        }}
                                    />
                                </Grid>
                                <Grid item sm={2}>
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        color="primary"
                                        className={classes.submitScreeningCreateButton}>
                                        Ajouter
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                    <Grid container item justify="flex-end" sm={8} className={classes.section}>
                        <Grid item sm={8}>
                            <GridList cols={1} cellHeight={31} className={classes.listScreening}>
                                {screeningUsers.list.map((screening) => (
                                    <GridListTile key={screening.id}>
                                        <Grid container className={classes.screeningListItem}>
                                            <Grid item sm={11} alignItems="center">
                                                <Typography variant="body1">
                                                    {screening.email.original}
                                                </Typography>
                                            </Grid>
                                            <Grid item sm={1}>
                                                <SquareButton
                                                    aria-label="deleteAdmin"
                                                    onClick={() =>
                                                        handleDeleteScreeningRole(screening.id)
                                                    }
                                                    classes={{ root: classes.icon }}>
                                                    <DeleteOutlineIcon />
                                                </SquareButton>
                                            </Grid>
                                        </Grid>
                                    </GridListTile>
                                ))}
                            </GridList>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justify="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push(ADMIN_CAMPUS_MANAGEMENT(campus.id))}>
                        Retour
                    </Button>
                </Grid>
            </Paper>
        </Grid>
    );
}

ScreeningEdit.propTypes = {
    campus: PropTypes.objectOf(PropTypes.string).isRequired,
    role: PropTypes.string.isRequired,
    screeningUsers: PropTypes.array.isRequired,
    submitCreateUser: PropTypes.func.isRequired,
    deleteScreeningRole: PropTypes.func.isRequired
};

export default ScreeningEdit;

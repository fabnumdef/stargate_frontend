import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PageTitle from '../../../styled/common/pageTitle';
import { ROLES } from '../../../../utils/constants/enums';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { checkMailFormat } from '../../../../utils/mappers/createUserFromMail';
import { Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import SquareButton from '../../../styled/common/squareButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const useStyles = makeStyles((theme) => ({
    listAccOff: {
        margin: '10px 16px !important'
    },
    icon: {
        color: 'rgba(0, 0, 0, 0.25)',
        padding: '0 !important',
        '&:hover': {
            color: theme.palette.primary.main
        }
    },
    submitAccOffCreateButton: {
        marginLeft: 30
    },
    accOffListItem: {
        '&:hover': {
            backgroundColor: theme.palette.background.layoutDark
        }
    }
}));

function AccOffEdit({ campus, role, accOffUsers, submitCreateUser, deleteAccOff }) {
    const classes = useStyles();
    const { control, handleSubmit, errors, setValue } = useForm();

    const handleCreateAccOff = async (formData) => {
        const isUserCreate = await submitCreateUser(formData);
        if (isUserCreate) {
            setValue('accOffEmail', '');
        }
    };

    const handleDeleteAccOff = async (id) => {
        deleteAccOff(id);
    };

    return (
        <Grid>
            <Grid style={{ marginBottom: 50 }}>
                <PageTitle subtitles={[campus.label, ROLES[role].label]}>Base</PageTitle>
            </Grid>
            <Grid>
                <form onSubmit={handleSubmit(handleCreateAccOff)}>
                    <Grid container alignItems="center" sm={8}>
                        <Grid container item sm={12} md={3}>
                            <Grid item sm={2}>
                                {accOffUsers.list.length && <WarningIcon />}
                            </Grid>
                            <Grid item sm={10}>
                                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                                    Responsable(s):
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" item sm={9}>
                            <Grid item sm={8}>
                                <Controller
                                    as={
                                        <TextField
                                            label="Email"
                                            variant="filled"
                                            fullWidth
                                            error={Object.prototype.hasOwnProperty.call(
                                                errors,
                                                'accOffEmail'
                                            )}
                                            helperText={
                                                errors.accOffEmail && errors.accOffEmail.message
                                            }
                                        />
                                    }
                                    control={control}
                                    name="accOffEmail"
                                    defaultValue=""
                                    rules={{
                                        validate: (value) =>
                                            checkMailFormat(value) ||
                                            "L'email doit être au format nom.prenom@intradef.gouv.fr"
                                    }}
                                />
                            </Grid>
                            <Grid item sm={2}>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    color="primary"
                                    className={classes.submitAccOffCreateButton}>
                                    Ajouter
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
                <Grid container item justify="flex-end" sm={8}>
                    <Grid item sm={9}>
                        <GridList cols={1} cellHeight={25} className={classes.listAccOff}>
                            {accOffUsers.list.map((accOff) => (
                                <GridListTile key={accOff.id}>
                                    <Grid container sm={8} className={classes.accOffListItem}>
                                        <Grid item sm={11} alignItems="center">
                                            <Typography variant="body1">
                                                {accOff.email.original}
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={1}>
                                            <SquareButton
                                                aria-label="deleteAdmin"
                                                onClick={() => handleDeleteAccOff(accOff.id)}
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
        </Grid>
    );
}

AccOffEdit.propTypes = {
    campus: PropTypes.objectOf(PropTypes.string).isRequired,
    role: PropTypes.string.isRequired,
    accOffUsers: PropTypes.array.isRequired,
    submitCreateUser: PropTypes.func.isRequired,
    deleteAccOff: PropTypes.func.isRequired
};

export default AccOffEdit;

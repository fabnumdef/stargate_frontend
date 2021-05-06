import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/Warning';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Controller, useForm } from 'react-hook-form';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const useStyles = makeStyles((theme) => ({
    globalContainer: {
        paddingLeft: theme.spacing(4)
    },
    warningIcon: {
        width: 30
    },
    content: {
        margin: `${theme.spacing(3)}px ${theme.spacing(10)}px`
    },
    submitButton: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(4)
    },
    listAdmins: {
        margin: '10px 16px !important'
    }
}));

function AdminSection({ listAdmins }) {
    const classes = useStyles();
    const { control, handleSubmit, errors } = useForm();

    const handleCreateAdmin = (e) => {
        e.preventDefault();
        console.log('');
    };

    const handleDeleteAdmin = (id) => {
        console.log(id);
    };

    return (
        <Grid container alignItems="center">
            <Grid container item className={classes.globalContainer}>
                <Grid item className={classes.warningIcon}>
                    {!listAdmins.list.length && <WarningIcon />}
                </Grid>
                <Grid>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Administrateur(s) fonctionnel(s) ({listAdmins.meta.total})
                    </Typography>
                </Grid>
            </Grid>
            <Grid item sm={12} md={12} className={classes.content}>
                <Grid item>
                    <form onSubmit={handleSubmit(handleCreateAdmin)}>
                        <Controller
                            as={
                                <TextField
                                    label="Email"
                                    variant="filled"
                                    error={Object.prototype.hasOwnProperty.call(
                                        errors,
                                        'adminEmail'
                                    )}
                                    helperText={errors.adminEmail && errors.adminEmail.message}
                                    style={{ width: 450 }}
                                />
                            }
                            control={control}
                            name="adminEmail"
                            defaultValue=""
                            rules={{
                                validate: (value) =>
                                    value.trim() !== '' ||
                                    "L'email doit être au format nom.prenom@intradef.gouv.fr"
                            }}
                        />
                        <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            className={classes.submitButton}>
                            Ajouter
                        </Button>
                    </form>
                </Grid>
                <GridList cols={1} cellHeight={20} className={classes.listAdmins}>
                    {listAdmins.list.map((admin) => (
                        <GridListTile key={admin.id}>
                            <Grid container>
                                <Grid item sm={10} md={3}>
                                    <Typography variant="body1">{admin.email.original}</Typography>
                                </Grid>
                                <Grid item sm={2} onClick={handleDeleteAdmin(admin.id)}>
                                    <WarningIcon />
                                </Grid>
                            </Grid>
                        </GridListTile>
                    ))}
                </GridList>
            </Grid>
        </Grid>
    );
}

AdminSection.propTypes = {
    listAdmins: PropTypes.array.isRequired
};

export default AdminSection;

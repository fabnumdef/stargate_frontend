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
import SquareButton from '../../styled/common/squareButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useApolloClient, useMutation } from '@apollo/client';
import { ROLES } from '../../../utils/constants/enums';
import { LIST_USERS, FIND_USER_BY_MAIL } from '../../../lib/apollo/queries';
import { useSnackBar } from '../../../lib/hooks/snackbar';
import {
    createUserData,
    checkMailFormat,
    GOUV_DOMAIN_MAIL
} from '../../../utils/mappers/createUserFromMail';
import { ADD_USER_ROLE, CREATE_USER, DELETE_ROLE } from '../../../lib/apollo/mutations';

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
        margin: '10px 16px !important',
        maxWidth: 450
    },
    icon: {
        color: 'rgba(0, 0, 0, 0.25)',
        padding: '0 !important',
        '&:hover': {
            color: theme.palette.primary.main
        }
    },
    adminsListItem: {
        paddingLeft: 5,
        borderRadius: 4,
        '&:hover': {
            backgroundColor: theme.palette.background.layoutDark,
            transition: '.4s'
        }
    }
}));

function AdminSection({ listAdmins, campusData }) {
    const classes = useStyles();
    const { addAlert } = useSnackBar();
    const client = useApolloClient();
    const { control, handleSubmit, errors, setValue } = useForm();

    const [deleteUserRoleReq] = useMutation(DELETE_ROLE, {
        update: (cache, { data: { deleteUserRole: deletedUser } }) => {
            const currentUsers = cache.readQuery({
                query: LIST_USERS,
                variables: { campus: campusData.id, hasRole: { role: ROLES.ROLE_ADMIN.role } }
            });
            const updatedTotal = currentUsers.listUsers.meta.total - 1;
            const updatedUsers = {
                ...currentUsers,
                listUsers: {
                    ...currentUsers.listUsers,
                    list: currentUsers.listUsers.list.filter((user) => user.id !== deletedUser.id),
                    meta: {
                        ...currentUsers.listUsers.meta,
                        total: updatedTotal
                    }
                }
            };
            cache.writeQuery({
                query: LIST_USERS,
                variables: { campus: campusData.id, hasRole: { role: ROLES.ROLE_ADMIN.role } },
                data: updatedUsers
            });
        }
    });
    const addRoleUpdate = (cache, user) => {
        const currentUsers = cache.readQuery({
            query: LIST_USERS,
            variables: { campus: campusData.id, hasRole: { role: ROLES.ROLE_ADMIN.role } }
        });
        const updatedTotal = currentUsers.listUsers.meta.total + 1;
        const updatedUsers = {
            ...currentUsers,
            listUsers: {
                ...currentUsers.listUsers,
                list: [...currentUsers.listUsers.list, user],
                meta: {
                    ...currentUsers.listUsers.meta,
                    total: updatedTotal
                }
            }
        };
        cache.writeQuery({
            query: LIST_USERS,
            variables: { campus: campusData.id, hasRole: { role: ROLES.ROLE_ADMIN.role } },
            data: updatedUsers
        });
    };

    const [addUserRole] = useMutation(ADD_USER_ROLE, {
        update: (cache, { data: { addUserRole: updatedUser } }) => addRoleUpdate(cache, updatedUser)
    });
    const [createUser] = useMutation(CREATE_USER, {
        update: (cache, { data: { createUser: createdUser } }) => addRoleUpdate(cache, createdUser)
    });

    const submitCreateUser = async (user) => {
        try {
            const {
                data: {
                    createUser: { id }
                }
            } = await createUser({ variables: { user } });
            if (id) {
                addAlert({ message: "L'administrateur a bien été créé", severity: 'success' });
                setValue('adminEmail', '');
            }
            return null;
        } catch (e) {
            switch (true) {
                case e.message === 'GraphQL error: User already exists':
                    return addAlert({
                        message: 'Un utilisateur est déjà enregistré avec cet e-mail',
                        severity: 'error'
                    });
                case e.message.includes(
                    'User validation failed: email.original: queryMx ENOTFOUND'
                ):
                    return addAlert({
                        message: "Erreur, veuillez vérifier le domaine de l'adresse e-mail",
                        severity: 'warning'
                    });
                default:
                    return addAlert({
                        message: 'Erreur serveur, merci de réessayer',
                        severity: 'warning'
                    });
            }
        }
    };

    const submitAddUserRole = async (user, roleData) => {
        try {
            const { data } = await addUserRole({ variables: { id: user.id, roleData } });
            addAlert({
                message: `Le rôle Administrateur à bien été ajouté à ${data.addUserRole.email.original}`,
                severity: 'success'
            });
            return setValue('adminEmail', '');
        } catch {
            addAlert({
                message: "Erreur lors de l'ajout du rôle Administrateur à l'utilisateur",
                severity: 'error'
            });
        }
    };

    const deleteAdmin = async (id) => {
        try {
            await deleteUserRoleReq({
                variables: {
                    id,
                    roleData: {
                        role: ROLES.ROLE_ADMIN.role
                    }
                }
            });
            addAlert({
                message: "Le rôle d'administrateur à bien été supprimé de l'utilisateur",
                severity: 'success'
            });
        } catch {
            return null;
        }
    };

    const handleCreateAdmin = async (formData) => {
        const roleData = {
            role: ROLES.ROLE_ADMIN.role,
            campus: { id: campusData.id, label: campusData.label }
        };
        const { data } = await client.query({
            query: FIND_USER_BY_MAIL,
            variables: {
                email: formData.adminEmail
            },
            fetchPolicy: 'no-cache'
        });
        if (!data.findUser) {
            const userAdmin = createUserData(formData.adminEmail, roleData);
            await submitCreateUser(userAdmin);
        } else {
            await submitAddUserRole(data.findUser, roleData);
        }
    };

    const handleDeleteAdmin = (id) => {
        deleteAdmin(id);
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
                                    checkMailFormat(value, GOUV_DOMAIN_MAIL) ||
                                    `L'email doit être au format nom.prenom@${GOUV_DOMAIN_MAIL}`
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
                <GridList cols={1} cellHeight={30} className={classes.listAdmins}>
                    {listAdmins.list.map((admin) => (
                        <GridListTile key={admin.id}>
                            <Grid container className={classes.adminsListItem}>
                                <Grid item sm={11} alignItems="center">
                                    <Typography variant="body1">{admin.email.original}</Typography>
                                </Grid>
                                <Grid item sm={1}>
                                    <SquareButton
                                        aria-label="deleteAdmin"
                                        onClick={() => handleDeleteAdmin(admin.id)}
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
    );
}

AdminSection.propTypes = {
    listAdmins: PropTypes.array.isRequired,
    campusData: PropTypes.objectOf(PropTypes.string.isRequired).isRequired
};

export default AdminSection;

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { checkMailFormat, createUserData } from '../../utils/mappers/createUserFromMail';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import { Typography } from '@material-ui/core';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import SquareButton from '../styled/common/squareButton';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import { useApolloClient, useMutation } from '@apollo/client';
import { ADD_USER_ROLE, CREATE_USER, DELETE_ROLE } from '../../lib/apollo/mutations';
import { FIND_USER_BY_MAIL, LIST_USERS } from '../../lib/apollo/queries';
import { ROLES } from '../../utils/constants/enums';
import { useSnackBar } from '../../lib/hooks/snackbar';

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: 10
    },
    fieldTitle: {
        marginBottom: 17
    },
    fieldSection: {
        width: 400,
        marginRight: 40
    },
    fieldInput: {
        backgroundColor: theme.palette.common.white
    },
    listUsers: {
        marginTop: 10,
        marginLeft: 20
    },
    userListItem: {
        borderRadius: 4,
        paddingLeft: 5,
        '&:hover': {
            backgroundColor: theme.palette.background.layoutDark,
            transition: '.4s'
        }
    },
    warningIcon: {
        width: 50
    },
    icon: {
        color: 'rgba(0, 0, 0, 0.25)',
        padding: '0 !important',
        '&:hover': {
            color: theme.palette.primary.main
        }
    },
    iconSvg: {
        height: 20
    },
    addButton: {
        width: 109,
        height: 50,
        marginTop: 5,
        padding: '10px 27px 10px 26px',
        borderRadius: 25
    }
}));

const CreateRoleField = ({ mailDomain, usersList, roleData, children }) => {
    const classes = useStyles();
    const { addAlert } = useSnackBar();
    const client = useApolloClient();
    const { control, handleSubmit, errors, setValue } = useForm();

    const [deleteUserRoleReq] = useMutation(DELETE_ROLE, {
        update: (cache, { data: { deleteUserRole: deletedUser } }) => {
            let variables = {
                campus: roleData.campus.id,
                hasRole: { role: roleData.role }
            };
            if (roleData.unit) {
                variables = {
                    ...variables,
                    hasRole: {
                        ...variables.hasRole,
                        unit: roleData.unit.id
                    }
                };
            }
            const currentUsers = cache.readQuery({
                query: LIST_USERS,
                variables
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
                variables,
                data: updatedUsers
            });
        }
    });

    const addRoleUpdate = (cache, user) => {
        let variables = {
            campus: roleData.campus.id,
            hasRole: { role: roleData.role }
        };
        if (roleData.unit) {
            variables = {
                ...variables,
                hasRole: {
                    ...variables.hasRole,
                    unit: roleData.unit.id
                }
            };
        }
        const currentUsers = cache.readQuery({
            query: LIST_USERS,
            variables
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
            variables,
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
                addAlert({
                    message: `L'utilisateur pour le rôle ${
                        ROLES[roleData.role].label
                    } a bien été créé`,
                    severity: 'success'
                });
            }
            return setValue('userEmail', '');
        } catch (e) {
            switch (true) {
                case e.message === 'GraphQL error: User already exists':
                    addAlert({
                        message: 'Un utilisateur est déjà enregistré avec cet e-mail',
                        severity: 'error'
                    });
                    break;
                case e.message.includes(
                    'User validation failed: email.original: queryMx ENOTFOUND'
                ):
                    addAlert({
                        message: "Erreur, veuillez vérifier le domaine de l'adresse e-mail",
                        severity: 'warning'
                    });
                    break;
                default:
                    addAlert({
                        message: 'Erreur serveur, merci de réessayer',
                        severity: 'warning'
                    });
            }
            return false;
        }
    };

    const submitAddUserRole = async (user, roleData) => {
        try {
            const {
                data: {
                    addUserRole: { email }
                }
            } = await addUserRole({ variables: { id: user.id, roleData } });
            addAlert({
                message: `Le rôle ${ROLES[roleData.role].label} à bien été ajouté à ${
                    email.original
                }`,
                severity: 'success'
            });
            return setValue('userEmail', '');
        } catch {
            addAlert({
                message: "Erreur lors de l'ajout du rôle à l'utilisateur",
                severity: 'error'
            });
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await deleteUserRoleReq({
                variables: {
                    id,
                    roleData: {
                        role: roleData.role,
                        unit: roleData.unit
                    }
                }
            });
            addAlert({
                message: `Le rôle ${
                    ROLES[roleData.role].label
                } à bien été supprimé de l'utilisateur`,
                severity: 'success'
            });
        } catch {
            return null;
        }
    };

    const handleCreateUserWithRole = async (formData) => {
        const { data } = await client.query({
            query: FIND_USER_BY_MAIL,
            variables: {
                email: formData.userEmail
            },
            fetchPolicy: 'no-cache'
        });
        if (!data.findUser) {
            const userAdmin = createUserData(formData.userEmail, roleData);
            return submitCreateUser(userAdmin);
        } else {
            return submitAddUserRole(data.findUser, roleData);
        }
    };

    const displayEmail = (mail) => {
        return mail.length > 30 ? mail.slice(0, 30) + '...' : mail;
    };

    return (
        <Grid className={classes.root}>
            <form onSubmit={handleSubmit(handleCreateUserWithRole)}>
                <Grid>
                    <Grid container className={classes.fieldTitle}>
                        {!usersList.length && <WarningIcon className={classes.warningIcon} />}
                        {children}
                    </Grid>
                    <Grid container item>
                        <Grid item className={classes.fieldSection}>
                            <Controller
                                as={
                                    <TextField
                                        label="Adresse mail"
                                        variant="outlined"
                                        fullWidth
                                        className={classes.fieldInput}
                                        error={Object.prototype.hasOwnProperty.call(
                                            errors,
                                            'userEmail'
                                        )}
                                        helperText={errors.userEmail && errors.userEmail.message}
                                    />
                                }
                                control={control}
                                name="userEmail"
                                defaultValue=""
                                rules={{
                                    validate: (value) =>
                                        checkMailFormat(value, mailDomain) ||
                                        `L'email doit être au format nom.prenom@${mailDomain}`
                                }}
                            />
                            <Grid item className={classes.listUsers}>
                                <GridList cols={1} cellHeight={25}>
                                    {usersList.map((user) => (
                                        <GridListTile key={user.id}>
                                            <Grid
                                                container
                                                justify="space-between"
                                                className={classes.userListItem}>
                                                <Grid item>
                                                    <Typography variant="body1">
                                                        {displayEmail(user.email.original)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <SquareButton
                                                        aria-label="deleteAdmin"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        classes={{ root: classes.icon }}>
                                                        <PersonAddDisabledIcon
                                                            classes={{ root: classes.iconSvg }}
                                                        />
                                                    </SquareButton>
                                                </Grid>
                                            </Grid>
                                        </GridListTile>
                                    ))}
                                </GridList>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button
                                type="submit"
                                variant="outlined"
                                color="primary"
                                className={classes.addButton}>
                                Ajouter
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    );
};

CreateRoleField.defaultProps = {
    usersList: [],
    disable: false
};

CreateRoleField.propTypes = {
    mailDomain: PropTypes.string.isRequired,
    usersList: PropTypes.array,
    roleData: PropTypes.shape({
        role: PropTypes.string.isRequired,
        unit: PropTypes.objectOf(PropTypes.string),
        campus: PropTypes.objectOf(PropTypes.string)
    }).isRequired,
    children: PropTypes.node.isRequired
};

export default CreateRoleField;

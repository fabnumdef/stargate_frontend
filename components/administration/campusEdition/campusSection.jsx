import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { ROLES } from '../../../utils/constants/enums';
import ItemCard from '../../styled/itemCard';
import { ADMIN_CAMPUS_EDITION, ADMIN_CAMPUS_ROLE_EDITION } from '../../../utils/constants/appUrls';
import WarningIcon from '@material-ui/icons/Warning';
import EditButton from '../../styled/EditButton';

const useStyles = makeStyles((theme) => ({
    globalContainer: {
        height: 100,
        marginBottom: 40
    },
    textInfos: {
        padding: theme.spacing(2)
    },
    textInfosSubtitle: {
        fontStyle: 'italic'
    },
    validators: {
        padding: `20px 10px 23px 50px`,
        backgroundColor: theme.palette.background.layout,
        borderRadius: 4
    },
    emptyValidatorsIcon: {
        width: 17,
        height: 14,
        color: theme.palette.warning.main
    }
}));

function CampusSection({ campusData, usersTotalByRole }) {
    const classes = useStyles();
    const router = useRouter();

    const validatorsRoles = Object.values(ROLES).filter((r) => r.workflow);

    const handleEditRole = (editable, role) => {
        if (editable) {
            return router.push(ADMIN_CAMPUS_ROLE_EDITION(campusData.id, role));
        }
    };

    return (
        <Grid sm={12}>
            <Grid container className={classes.globalContainer}>
                <Grid item sm={8} md={4}>
                    <Paper elevation={3} className={classes.textInfos}>
                        <Grid container justify="space-between">
                            <Grid item>
                                <Typography variant="h5">
                                    {campusData.label} - {campusData.trigram}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    className={classes.textInfosSubtitle}>
                                    Créée le {format(new Date(campusData.createdAt), 'dd/MM/yyyy')}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <EditButton
                                    onClick={() => router.push(ADMIN_CAMPUS_EDITION(campusData.id))}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container justify="space-between" className={classes.validators}>
                <Grid>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Configurations validateurs
                    </Typography>
                    <Grid container>
                        {validatorsRoles.map((role) => (
                            <Grid
                                item
                                key={role.role}
                                onClick={() => handleEditRole(role.editable, role.role)}>
                                <ItemCard
                                    style={{
                                        cursor: role.editable ? 'pointer' : '',
                                        justifyContent: 'center',
                                        opacity: role.editable ? 1 : 0.6
                                    }}>
                                    <Typography variant="body1">
                                        {role.shortLabel}
                                        {usersTotalByRole[role.role] < 1 && (
                                            <WarningIcon className={classes.emptyValidatorsIcon} />
                                        )}
                                    </Typography>
                                </ItemCard>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid>
                    <EditButton onClick={() => {}} />
                </Grid>
            </Grid>
        </Grid>
    );
}

CampusSection.propTypes = {
    campusData: PropTypes.objectOf(PropTypes.string).isRequired,
    usersTotalByRole: PropTypes.objectOf(PropTypes.number).isRequired
};

export default CampusSection;

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { format } from 'date-fns';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { ROLES } from '../../../utils/constants/enums';
import ItemCard from '../../styled/itemCard';
import { ADMIN_CAMPUS_EDITION, ADMIN_CAMPUS_ROLE_EDITION } from '../../../utils/constants/appUrls';

const useStyles = makeStyles((theme) => ({
    globalContainer: {
        height: 150
    },
    textInfos: {
        height: '100%',
        padding: theme.spacing(2)
    },
    textInfosSubtitle: {
        fontStyle: 'italic'
    },
    validators: {
        padding: `${theme.spacing(8)}px 0 0 ${theme.spacing(8)}px`
    }
}));

function CampusSection({ campusData }) {
    const classes = useStyles();
    const router = useRouter();

    const validatorsRoles = Object.values(ROLES).filter((r) => r.workflow);

    const handleEditRole = (editable, role) => {
        if (editable) {
            return router.push(ADMIN_CAMPUS_ROLE_EDITION(campusData.id, role));
        }
    };

    return (
        <Grid className={classes.root} sm={12}>
            <Grid container className={classes.globalContainer}>
                <Grid item sm={12} md={6}>
                    <Paper elevation={3} className={classes.textInfos}>
                        <Grid container>
                            <Grid item sm={10}>
                                <Typography variant="h5">
                                    {campusData.label} - {campusData.trigram}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    className={classes.textInfosSubtitle}>
                                    Créée le {format(new Date(campusData.createdAt), 'dd/MM/yyyy')}
                                </Typography>
                            </Grid>
                            <Grid item sm={2}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() =>
                                        router.push(ADMIN_CAMPUS_EDITION(campusData.id))
                                    }>
                                    Modifier
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid className={classes.validators}>
                <Typography variant="h6">Configurations validateurs</Typography>
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
                                <Typography variant="body1">{role.label}</Typography>
                            </ItemCard>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

CampusSection.propTypes = {
    campusData: PropTypes.objectOf(PropTypes.string).isRequired
};

export default CampusSection;

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PageTitle from '../../../styled/common/pageTitle';
import { ACCESS_OFFICE_VALIDATION_CHOICES, ROLES } from '../../../../utils/constants/enums';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { useRouter } from 'next/router';
import { ADMIN_CAMPUS_MANAGEMENT } from '../../../../utils/constants/appUrls';
import Paper from '@material-ui/core/Paper';
import { CreateRoleField } from '../../../index';
import { GOUV_DOMAIN_MAIL } from '../../../../utils/mappers/createUserFromMail';

const useStyles = makeStyles(() => ({
    tagSection: {
        marginLeft: 50,
        marginBottom: 30
    },
    tagTitle: {
        marginBottom: 20,
        fontWeight: 'bold'
    }
}));

function AccOffEdit({ roleData, accOffUsers }) {
    const classes = useStyles();
    const router = useRouter();

    return (
        <Grid>
            <Grid style={{ marginBottom: 50 }}>
                <PageTitle subtitles={[roleData.campus.label, ROLES[roleData.role].label]}>
                    Base
                </PageTitle>
            </Grid>
            <Paper style={{ padding: 30 }} elevation={2}>
                <Grid>
                    <CreateRoleField
                        roleData={roleData}
                        usersList={accOffUsers}
                        mailDomain={GOUV_DOMAIN_MAIL}>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                            Responsable(s)
                        </Typography>
                    </CreateRoleField>
                    <Grid className={classes.tagSection}>
                        <Grid item>
                            <Typography variant="body1" className={classes.tagTitle}>
                                Badge accès temporaire
                            </Typography>
                        </Grid>
                        <Grid item sm={10}>
                            <GridList cols={1} cellHeight={25}>
                                {ACCESS_OFFICE_VALIDATION_CHOICES.map((choice) => (
                                    <GridListTile key={choice.label}>
                                        <Grid container alignItems="center">
                                            <Grid item sm={1}>
                                                {choice.mainList ? (
                                                    <StarIcon />
                                                ) : (
                                                    <StarBorderOutlinedIcon />
                                                )}
                                            </Grid>
                                            <Grid item sm={4}>
                                                {choice.label}
                                            </Grid>
                                            <Grid item>{choice.description}</Grid>
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
                        onClick={() => router.push(ADMIN_CAMPUS_MANAGEMENT(roleData.campus.id))}>
                        Retour
                    </Button>
                </Grid>
            </Paper>
        </Grid>
    );
}

AccOffEdit.propTypes = {
    roleData: PropTypes.objectOf({
        role: PropTypes.string,
        campus: PropTypes.objectOf(PropTypes.string).isRequired
    }).isRequired,
    accOffUsers: PropTypes.array.isRequired
};

export default AccOffEdit;

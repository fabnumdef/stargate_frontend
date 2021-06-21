import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { ACCESS_OFFICE_VALIDATION_CHOICES } from '../../../../utils/constants/enums';
import { Typography } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { CreateRoleField } from '../../../index';
import { GOUV_DOMAIN_MAIL } from '../../../../utils/mappers/createUserFromMail';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '20px 50px'
    },
    tagSection: {
        marginTop: 30,
        marginBottom: 30
    },
    tagTitle: {
        marginBottom: 20,
        fontWeight: 'bold'
    },
    mainIcon: {
        color: theme.palette.common.yellow
    },
    icon: {
        marginRight: 5
    }
}));

function AccOffEdit({ roleData, accOffUsers }) {
    const classes = useStyles();

    return (
        <Grid className={classes.root}>
            <CreateRoleField
                roleData={roleData}
                usersList={accOffUsers}
                mailDomain={GOUV_DOMAIN_MAIL}
                canDelete={accOffUsers.length > 1}>
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
                                    <Grid item className={classes.icon}>
                                        {choice.mainList ? (
                                            <StarIcon className={classes.mainIcon} />
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
    );
}

AccOffEdit.propTypes = {
    roleData: PropTypes.shape({
        role: PropTypes.string,
        campus: PropTypes.objectOf(PropTypes.string).isRequired
    }).isRequired,
    accOffUsers: PropTypes.array.isRequired
};

export default AccOffEdit;

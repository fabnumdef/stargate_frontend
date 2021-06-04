import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { CreateRoleField } from '../../index';
import { ROLES } from '../../../utils/constants/enums';
import { GOUV_DOMAIN_MAIL } from '../../../utils/mappers/createUserFromMail';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: `20px 10px 23px 50px`,
        backgroundColor: theme.palette.background.layout,
        borderRadius: 4
    }
}));

const UnitRoleForm = ({ unit, campus, unitCorrespondandList, securityOfficerList }) => {
    const classes = useStyles();

    return (
        <Grid className={classes.root}>
            <CreateRoleField
                roleData={{
                    role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
                    unit: { id: unit.id, label: unit.name },
                    campus: { id: campus.id, label: campus.label }
                }}
                usersList={unitCorrespondandList}
                mailDomain={GOUV_DOMAIN_MAIL}>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Correspondant Unité
                </Typography>
            </CreateRoleField>
            <CreateRoleField
                roleData={{
                    role: ROLES.ROLE_SECURITY_OFFICER.role,
                    unit: { id: unit.id, label: unit.name },
                    campus: { id: campus.id, label: campus.label }
                }}
                usersList={securityOfficerList}
                mailDomain={GOUV_DOMAIN_MAIL}>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    Officier Sécurité
                </Typography>
            </CreateRoleField>
        </Grid>
    );
};

UnitRoleForm.propTypes = {
    unit: PropTypes.object.isRequired,
    campus: PropTypes.object.isRequired,
    unitCorrespondandList: PropTypes.array.isRequired,
    securityOfficerList: PropTypes.array.isRequired
};

export default UnitRoleForm;

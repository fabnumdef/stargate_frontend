import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PageTitle from '../../../../components/styled/common/pageTitle';
import { HeaderConfigurationValidator } from '../../../../components/index';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { ROLES } from '../../../../utils/constants/enums';

const subtitles = ['Configuration validateurs'];

const useStyles = makeStyles({
    backButton: {
        padding: 0,
        marginBottom: 15,
        fontWeight: 'bold',
        cursor: 'pointer'
    }
});

const ValidatorConfiguration = () => {
    const router = useRouter();
    const classes = useStyles();
    const validatorsRoles = Object.values(ROLES).filter((r) => r.workflow);
    const [selectedRole, setSelectedRole] = useState(
        validatorsRoles.find((r) => r.editable).role || null
    );

    return (
        <Grid>
            <Button onClick={() => router.back()} className={classes.backButton}>
                <KeyboardBackspaceIcon />
                Retour administration de base
            </Button>
            <PageTitle subtitles={subtitles}>Administration</PageTitle>
            <Paper>
                <HeaderConfigurationValidator
                    validatorsRoles={validatorsRoles}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                />
            </Paper>
        </Grid>
    );
};

export default ValidatorConfiguration;

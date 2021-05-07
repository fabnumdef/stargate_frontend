import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import PageTitle from '../../../components/styled/common/pageTitle';
import CampusForm from '../../../components/administrationForms/campusForm';
import { Typography } from '@material-ui/core';

function CampusFormContainer({ onSubmit, defaultValues }) {
    return (
        <>
            <PageTitle subtitles={['Base', defaultValues.id.length ? 'Edition' : 'Création']}>
                Administration
            </PageTitle>
            <Typography variant="subtitle2" style={{ fontStyle: 'italic', marginBottom: 10 }}>
                Tous les champs sont obligatoires
            </Typography>
            <Grid container>
                <Grid item sm={10} xs={10} md={6}>
                    <CampusForm submitForm={onSubmit} defaultValues={defaultValues} />
                </Grid>
            </Grid>
        </>
    );
}

CampusFormContainer.defaultProps = {
    defaultValues: {
        id: '',
        label: '',
        trigram: ''
    }
};

CampusFormContainer.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    defaultValues: PropTypes.objectOf(PropTypes.string),
    campusId: PropTypes.string
};

export default CampusFormContainer;

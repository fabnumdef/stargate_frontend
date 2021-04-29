import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import PageTitle from '../../../components/styled/common/pageTitle';
import CampusForm from '../../../components/administrationForms/campusForm';

function CampusFormContainer({ onSubmit, defaultValues }) {
    return (
        <>
            <PageTitle subtitles={['Base', defaultValues.id.length ? 'Edition' : 'Création']}>
                Administration
            </PageTitle>
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

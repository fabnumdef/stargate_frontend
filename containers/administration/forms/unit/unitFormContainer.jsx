import React from 'react';
import PropTypes from 'prop-types';
import { UnitForm } from '../../../../components';

function UnitFormContainer({ submitUnitForm, submitDeleteUnit, defaultValues }) {
    return (
        <UnitForm
            submitForm={submitUnitForm}
            submitDeleteUnit={submitDeleteUnit}
            defaultValues={defaultValues}
        />
    );
}

UnitFormContainer.propTypes = {
    submitUnitForm: PropTypes.func.isRequired,
    submitDeleteUnit: PropTypes.func,
    defaultValues: PropTypes.objectOf({
        name: PropTypes.string.isRequired,
        trigram: PropTypes.string.isRequired,
        cards: PropTypes.array.isRequired
    })
};

export default UnitFormContainer;

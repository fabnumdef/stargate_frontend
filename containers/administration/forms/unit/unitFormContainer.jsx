import React from 'react';
import PropTypes from 'prop-types';
import { UnitForm } from '../../../../components';

function UnitFormContainer({ submitUnitForm, handleDeleteUnit, defaultValues, cancelEdit }) {
    return (
        <UnitForm
            submitForm={submitUnitForm}
            handleDeleteUnit={handleDeleteUnit}
            defaultValues={defaultValues}
            cancelEdit={cancelEdit}
        />
    );
}

UnitFormContainer.propTypes = {
    submitUnitForm: PropTypes.func.isRequired,
    handleDeleteUnit: PropTypes.func,
    defaultValues: PropTypes.objectOf({
        name: PropTypes.string.isRequired,
        trigram: PropTypes.string.isRequired,
        cards: PropTypes.array.isRequired
    }),
    cancelEdit: PropTypes.func.isRequired
};

export default UnitFormContainer;

import React from 'react';
import PropTypes from 'prop-types';
import { UnitDetail } from '../../../../components';

const UnitDetailContainer = ({ defaultValues, toggleEditUnit }) => {
    return <UnitDetail defaultValues={defaultValues} toggleEditUnit={toggleEditUnit} />;
};

UnitDetailContainer.propTypes = {
    defaultValues: PropTypes.objectOf({
        name: PropTypes.string.isRequired,
        trigram: PropTypes.string.isRequired,
        cards: PropTypes.array.isRequired
    }),
    toggleEditUnit: PropTypes.func.isRequired
};

export default UnitDetailContainer;

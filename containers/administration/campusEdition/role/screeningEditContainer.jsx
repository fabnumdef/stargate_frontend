import React from 'react';
import PropTypes from 'prop-types';
import { ScreeningEdit } from '../../../../components';
import { useQuery } from '@apollo/client';
import { LIST_USERS } from '../../../../lib/apollo/queries';
import { ROLES } from '../../../../utils/constants/enums';

function ScreeningEditContainer({ campus, role }) {
    const { data, loading } = useQuery(LIST_USERS, {
        variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_SCREENING.role } }
    });

    return (
        !loading && (
            <ScreeningEdit
                roleData={{ role, campus }}
                screeningUsers={data?.listUsers?.list ?? []}
            />
        )
    );
}

ScreeningEditContainer.propTypes = {
    campus: PropTypes.objectOf(PropTypes.string).isRequired,
    role: PropTypes.string.isRequired
};

export default ScreeningEditContainer;

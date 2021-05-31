import React from 'react';
import PropTypes from 'prop-types';
import { AccOffEdit } from '../../../../components';
import { useQuery } from '@apollo/client';
import { LIST_USERS } from '../../../../lib/apollo/queries';
import { ROLES } from '../../../../utils/constants/enums';

function AccOffEditContainer({ campus, role }) {
    const { data, loading } = useQuery(LIST_USERS, {
        variables: { campus: campus.id, hasRole: { role: ROLES.ROLE_ACCESS_OFFICE.role } }
    });

    return (
        !loading &&
        data && (
            <AccOffEdit
                campus={campus}
                role={role}
                accOffUsers={data?.listUsers?.list ?? []}
                roleData={{ campus, role }}
            />
        )
    );
}

AccOffEditContainer.propTypes = {
    campus: PropTypes.objectOf(PropTypes.string).isRequired,
    role: PropTypes.string.isRequired
};

export default AccOffEditContainer;

import React from 'react';
import PropTypes from 'prop-types';
import { AdminSection } from '../../../components';
import { useQuery } from '@apollo/client';
import { LIST_USERS } from '../../../lib/apollo/queries';
import { ROLES } from '../../../utils/constants/enums';

function AdminSectionContainer({ campusId }) {
    const { data, loading } = useQuery(LIST_USERS, {
        variables: { campus: campusId, hasRole: { role: ROLES.ROLE_ADMIN.role } }
    });
    return (
        !loading && (
            <AdminSection
                listAdmins={data?.listUsers || []}
                total={data?.listUsers?.meta.total || 0}
                campusId={campusId}
            />
        )
    );
}

AdminSectionContainer.propTypes = {
    campusId: PropTypes.string.isRequired
};

export default AdminSectionContainer;

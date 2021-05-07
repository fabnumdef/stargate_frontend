import React from 'react';
import PropTypes from 'prop-types';
import { AdminSection } from '../../../components';
import { useQuery } from '@apollo/client';
import { LIST_USERS, GET_CAMPUS } from '../../../lib/apollo/queries';
import { ROLES } from '../../../utils/constants/enums';

function AdminSectionContainer({ campusId }) {
    const { data, loading } = useQuery(LIST_USERS, {
        variables: { campus: campusId, hasRole: { role: ROLES.ROLE_ADMIN.role } }
    });
    const { data: campusData, loading: loadCampus } = useQuery(GET_CAMPUS, {
        variables: { id: campusId }
    });
    return (
        !loading &&
        !loadCampus && (
            <AdminSection listAdmins={data?.listUsers || []} campusData={campusData.getCampus} />
        )
    );
}

AdminSectionContainer.propTypes = {
    campusId: PropTypes.string.isRequired
};

export default AdminSectionContainer;

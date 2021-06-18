import React from 'react';
import PropTypes from 'prop-types';
import { AdminSection } from '../../../components';
import { useQuery } from '@apollo/client';
import { LIST_USERS, GET_CAMPUS } from '../../../lib/apollo/queries';
import { ROLES } from '../../../utils/constants/enums';

const roleData = (campusData) => ({
    role: ROLES.ROLE_ADMIN.role,
    campus: { id: campusData.id, label: campusData.label }
});

function AdminSectionContainer({ campusId }) {
    const { data, loading } = useQuery(LIST_USERS, {
        variables: {
            campus: campusId,
            cursor: { offset: 0, first: 10 },
            hasRole: { role: ROLES.ROLE_ADMIN.role }
        }
    });
    const { data: campusData, loading: loadCampus } = useQuery(GET_CAMPUS, {
        variables: { id: campusId }
    });

    return (
        !loading &&
        !loadCampus && (
            <AdminSection
                listAdmins={data?.listUsers?.list || []}
                roleData={roleData(campusData.getCampus)}
            />
        )
    );
}

AdminSectionContainer.propTypes = {
    campusId: PropTypes.string.isRequired
};

export default AdminSectionContainer;

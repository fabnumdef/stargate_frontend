import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery } from '@apollo/client';
import { CampusSection } from '../../../components';
import { GET_CAMPUS, LIST_USERS } from '../../../lib/apollo/queries';
import { ROLES } from '../../../utils/constants/enums';

function CampusSectionContainer({ campusId }) {
    const client = useApolloClient();
    const [usersTotalByRole, setUsersTotalByRole] = useState(null);
    const { data: campusData } = useQuery(GET_CAMPUS, { variables: { id: campusId } });

    useEffect(() => {
        async function loadUsersTotalByRole() {
            let usersTotal = {};
            await Promise.all(
                [ROLES.ROLE_ACCESS_OFFICE.role, ROLES.ROLE_SCREENING.role].map(async (role) => {
                    const users = await client.query({
                        query: LIST_USERS,
                        variables: { hasRole: { role }, campusId }
                    });
                    usersTotal = {
                        ...usersTotal,
                        [role]: users.data.listUsers.meta.total
                    };
                })
            );
            setUsersTotalByRole(usersTotal);
        }

        if (!campusData) return;
        loadUsersTotalByRole();
    }, [campusData]);

    return (
        usersTotalByRole && (
            <CampusSection campusData={campusData.getCampus} usersTotalByRole={usersTotalByRole} />
        )
    );
}

CampusSectionContainer.propTypes = {
    campusId: PropTypes.string.isRequired
};

export default CampusSectionContainer;

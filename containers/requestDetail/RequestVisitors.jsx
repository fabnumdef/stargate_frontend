import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { GET_REQUEST_VISITORS } from '../../lib/apollo/queries';
import TableDetailsVisitors from '../../components/tables/TableDetailsVisitors';

export default function RequestVisitors({ id }) {
    const { data, loading } = useQuery(GET_REQUEST_VISITORS, {
        variables: {
            requestId: id
        },
        skip: !id
    });

    if (loading || !data) {
        return '';
    }

    const handleDelete = () => {};

    return (
        <TableDetailsVisitors
            list={data?.getCampus?.getRequest?.listVisitors.list}
            status={data?.getCampus?.getRequest?.status}
            onDelete={handleDelete}
        />
    );
}

RequestVisitors.propTypes = {
    id: PropTypes.string
};

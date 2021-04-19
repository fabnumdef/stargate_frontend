import React from 'react';
import PropTypes from 'prop-types';
import TableDetailsVisitors from '../../components/tables/TableDetailsVisitors';
import useRequest from '../../lib/hooks/useRequest';

export default function RequestVisitors({ id, list, status }) {
    const { deleteRequestVisitor } = useRequest();

    const handleDelete = (visitorId) => {
        deleteRequestVisitor(id, visitorId);
    };

    return <TableDetailsVisitors list={list} status={status} onDelete={handleDelete} />;
}

RequestVisitors.propTypes = {
    id: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    status: PropTypes.string.isRequired
};

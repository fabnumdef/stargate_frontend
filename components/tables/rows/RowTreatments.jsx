import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import ActionCell from '../cells/ActionCell';
import RequestCell from '../cells/RequestCell';
import VisitorCell from '../cells/VisitorCell';
import DecisionsCell from '../cells/DecisionsCell';
import ReasonCell from '../cells/ReasonCell';
import StatusCell from '../cells/StatusCell';
import ExportCell from '../cells/ExportCell';
import TableRow from '@material-ui/core/TableRow';

function RowTreatments({ columns, choices, row, treated, modalOpen }) {
    return (
        <TableRow hover key={row.visitor.id}>
            {columns.map((column) => {
                const value = row[column.id];
                switch (column.id) {
                    case 'request':
                        return <RequestCell key={column.id} request={row.request} />;
                    case 'visitor':
                        return <VisitorCell key={column.id} visitor={row.visitor} />;
                    case 'decisions':
                    case 'screening':
                        return (
                            <DecisionsCell
                                key={column.id}
                                visitor={row.visitor}
                                modalOpen={modalOpen}
                            />
                        );
                    case 'reason':
                        return <ReasonCell key={column.id} request={row.request} />;
                    case 'export':
                        return (
                            row.visitor.exportDate && (
                                <ExportCell key={column.id} visitor={row.visitor} />
                            )
                        );

                    case 'action':
                        return treated ? (
                            <StatusCell key={column.id} visitor={row.visitor} />
                        ) : (
                            <ActionCell
                                key={column.id}
                                decision={{
                                    request: { id: row.request.id },
                                    id: row.visitor.id
                                }}
                                choices={choices}
                            />
                        );

                    default:
                        return (
                            <TableCell key={column.id}>
                                {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                            </TableCell>
                        );
                }
            })}
        </TableRow>
    );
}

export default React.memo(RowTreatments);

RowTreatments.propTypes = {
    treated: PropTypes.bool,
    modalOpen: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    row: PropTypes.shape({
        visitor: PropTypes.shape(VisitorCell.propTypes.visitor),
        request: PropTypes.shape(RequestCell.propTypes.request)
    }).isRequired,
    choices: ActionCell.propTypes.choices
};

RowTreatments.defaultProps = {
    treated: false
};

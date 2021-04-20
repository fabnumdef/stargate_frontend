import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ActionCell from '../cells/ActionCell';
import RequestCell from '../cells/RequestCell';
import VisitorCell from '../cells/VisitorCell';
import DecisionsCell from '../cells/DecisionsCell';
import ReasonCell from '../cells/ReasonCell';
import TableRow from '@material-ui/core/TableRow';
import { useDecisions } from '../../../lib/hooks/useDecisions';

const StyledRow = withStyles((theme) => ({
    root: {
        border: `19px solid ${theme.palette.background.table}`
    },
    hover: {
        '&:hover': {
            boxShadow: `inset -1px -2px 0px ${theme.palette.primary.dark}
            , inset 1px 1px 0px ${theme.palette.primary.dark}`,
            backgroundColor: `${theme.palette.common.white} !important`
        }
    }
}))(TableRow);

function RowTreatments({ columns, choices, row }) {
    const { getDecision } = useDecisions();

    return (
        <StyledRow hover key={row.visitor.id}>
            {columns.map((column) => {
                const value = row[column.id];
                switch (column.id) {
                    case 'request':
                        return <RequestCell key={column.id} request={row.request} />;
                    case 'visitor':
                        return <VisitorCell key={column.id} visitor={row.visitor} />;
                    case 'decisions':
                    case 'screening':
                        return <DecisionsCell key={column.id} visitor={row.visitor} />;
                    case 'reason':
                        return <ReasonCell key={column.id} request={row.request} />;
                    case 'action':
                        return (
                            <ActionCell
                                key={column.id}
                                decision={getDecision(`${row.request.id}_${row.visitor.id}`)}
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
        </StyledRow>
    );
}

export default RowTreatments;

RowTreatments.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    row: PropTypes.shape({
        visitor: PropTypes.shape(VisitorCell.propTypes.visitor),
        request: PropTypes.shape(RequestCell.propTypes.request)
    }).isRequired,
    choices: ActionCell.propTypes.choices
};

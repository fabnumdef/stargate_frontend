import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ActionCell from '../cells/ActionCell';
import RequestCell from '../cells/RequestCell';
import VisitorCell from '../cells/VisitorCell';
import DecisionsCell from '../cells/DecisionsCell';
import ReasonCell from '../cells/ReasonCell';
import TableRow from '@material-ui/core/TableRow';

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

function RowTreatments({ columns, choices, row, updateAdd }) {
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
                                updateAdd={(state) => {
                                    const { validation, tags } =
                                        state.choice.label === 'Autre choix'
                                            ? state.choice.subChoices
                                            : state.choice;
                                    updateAdd({
                                        request: { id: row.request.id },
                                        id: row.visitor.id,
                                        decision: validation,
                                        tags
                                    });
                                }}
                                decision={row.decision}
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
        request: PropTypes.shape(RequestCell.propTypes.request),
        decision: PropTypes.object.isRequired
    }).isRequired,
    choices: ActionCell.propTypes.choices,
    updateAdd: ActionCell.propTypes.updateAdd
};

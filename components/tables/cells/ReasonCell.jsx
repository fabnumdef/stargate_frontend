import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';

import SeeMoreOrLess from '../../styled/common/SeeMoreOrLess';

export default function ReasonCell({ request }) {
    return (
        <TableCell>
            <div>
                <SeeMoreOrLess>{` ${request.reason}`}</SeeMoreOrLess>
            </div>
        </TableCell>
    );
}

ReasonCell.propTypes = {
    request: PropTypes.shape({
        reason: PropTypes.string
    }).isRequired
};

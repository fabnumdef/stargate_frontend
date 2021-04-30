import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import SeeMoreOrLess from '../../styled/common/SeeMoreOrLess';

const useStyles = makeStyles({
    widthCell: {
        maxWidth: '310px',
        minWidth: '150px'
    }
});
export default function ReasonCell({ request }) {
    const classes = useStyles();
    return (
        <TableCell className={classes.widthCell}>
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

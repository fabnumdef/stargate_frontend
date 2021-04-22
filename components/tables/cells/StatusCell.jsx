import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import getDecisions from '../../../utils/mappers/getDecisions';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { WORKFLOW_BEHAVIOR } from '../../../utils/constants/enums';

const useStyles = makeStyles((theme) => ({
    iconSuccess: {
        color: theme.palette.success.main,
        marginRight: '10px'
    },
    iconError: {
        marginRight: '10px'
    },
    typoContent: {
        display: 'flex'
    }
}));

export default function StatusCell({ visitor }) {
    const classes = useStyles();
    const { getMyDecision } = getDecisions();
    const myDecision = getMyDecision(visitor.units);
    function getInfoDisplay() {
        if (myDecision.value.tags.length !== 0) return myDecision.value.tags;
        return myDecision.value.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.positive
            ? 'Accepté'
            : 'Refusé';
    }

    return (
        <TableCell>
            <Typography key={myDecision.unit} className={classes.typoContent}>
                {myDecision.value.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.positive ? (
                    <CheckCircleIcon
                        className={classes.iconSuccess}
                        alt="Validé"
                        title="icone validée"
                    />
                ) : (
                    <ErrorIcon
                        alt="Validé"
                        className={classes.iconError}
                        color="error"
                        title="icone refusée"
                    />
                )}
                {getInfoDisplay()}
            </Typography>
        </TableCell>
    );
}

StatusCell.propTypes = {
    visitor: PropTypes.shape({
        units: PropTypes.array
    }).isRequired
};

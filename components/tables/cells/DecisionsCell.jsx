import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import TimerIcon from '@material-ui/icons/Timer';
import { WORKFLOW_BEHAVIOR, ROLES } from '../../../utils/constants/enums';
import getDecisions from '../../../utils/mappers/getDecisions';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    iconSuccess: {
        color: theme.palette.success.main
    },
    iconWarning: {
        color: '#FF9700'
    },
    typoContent: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#F8F8F8',
        padding: theme.spacing(1),
        borderRadius: '4px',
        marginBottom: '10px'
    }
}));
export default function DecisionsCell({ visitor }) {
    const classes = useStyles();
    const { getPreviousStep } = getDecisions();
    const stepValue = getPreviousStep(visitor.units);
    function GetRightDisplay() {
        switch (stepValue[0].label) {
            case ROLES.ROLE_SCREENING.role: {
                return stepValue[0].value.value ===
                    WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE.positive ? (
                    <CheckCircleIcon className={classes.iconSuccess} alt="RAS" title="icone RAS" />
                ) : (
                    <WarningIcon className={classes.iconWarning} alt="RES" title="icone RES" />
                );
            }
            case ROLES.ROLE_SECURITY_OFFICER.role: {
                return stepValue.map((e) => {
                    //if positive return checkIcon
                    if (e.value.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.positive) {
                        return (
                            <Typography key={e.unit} className={classes.typoContent}>
                                {e.unit}
                                <CheckCircleIcon
                                    className={classes.iconSuccess}
                                    alt="Validé"
                                    title="icone validée"
                                />
                            </Typography>
                        );
                    }
                    //if negative return errorIcon
                    if (e.value.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative) {
                        return (
                            <Typography key={e.unit} className={classes.typoContent}>
                                {e.unit}
                                <ErrorIcon
                                    key={e.unit}
                                    color="error"
                                    alt="Refusée"
                                    title="icone refusée"
                                />
                            </Typography>
                        );
                    }
                    //if no response yet return timerIcon
                    else {
                        return (
                            <Typography key={e.unit} className={classes.typoContent}>
                                {e.unit}
                                <TimerIcon
                                    key={e.unit}
                                    color="error"
                                    alt="En attente"
                                    title="icone en attente"
                                />
                            </Typography>
                        );
                    }
                });
            }
            default:
                return null;
        }
    }

    return (
        <TableCell>
            <div style={{ display: 'block' }}>{GetRightDisplay()}</div>
        </TableCell>
    );
}

DecisionsCell.propTypes = {
    visitor: PropTypes.shape({
        units: PropTypes.array
    }).isRequired
};

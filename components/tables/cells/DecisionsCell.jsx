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
import { activeRoleCacheVar } from '../../../lib/apollo/cache';

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
    },
    more: {
        marginLeft: theme.spacing(2),
        color: theme.palette.primary.dark,
        cursor: 'pointer'
    }
}));
export default function DecisionsCell({ visitor, modalOpen }) {
    const classes = useStyles();
    const { getPreviousStep } = getDecisions();
    const previousStepValue = getPreviousStep(visitor.units);

    /**
     * Check the value of the response for the security officer to send the right icon.
     * @param {*} unit
     * @returns Icon
     */
    function getRightDisplayForOS(unit) {
        //if positive return checkCircleIcon
        if (unit.value.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.positive)
            return (
                <CheckCircleIcon
                    key={unit.unit}
                    className={classes.iconSuccess}
                    alt="Validé"
                    title="icone validée"
                />
            );

        //if negative return errorIcon
        if (unit.value.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative)
            return <ErrorIcon key={unit.unit} color="error" alt="Refusée" title="icone refusée" />;
        //if no response yet return timerIcon
        else
            return (
                <TimerIcon
                    key={unit.unit}
                    className={classes.iconWarning}
                    alt="En attente"
                    title="icone en attente"
                />
            );
    }
    /**
     * Check the role of the previous actor to get the right display.
     * @returns unit label + icon
     */
    function GetRightDisplay() {
        switch (previousStepValue[0].label) {
            case ROLES.ROLE_SCREENING.role: {
                //if screening response is 'positive icon' checkCircle otherwise 'warning icon'
                return previousStepValue[0].value.value ===
                    WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE.positive ? (
                    <CheckCircleIcon className={classes.iconSuccess} alt="RAS" title="icone RAS" />
                ) : (
                    <WarningIcon className={classes.iconWarning} alt="RES" title="icone RES" />
                );
            }
            case ROLES.ROLE_SECURITY_OFFICER.role: {
                //if positive return checkIcon

                return previousStepValue.map((step) => (
                    <Typography key={step.unit} className={classes.typoContent}>
                        {step.unit}
                        {getRightDisplayForOS(step)}
                    </Typography>
                ));
            }
            default:
                return null;
        }
    }

    return (
        <TableCell>
            <div style={{ display: 'block' }}>{GetRightDisplay()}</div>
            <>
                {activeRoleCacheVar().role === ROLES.ROLE_ACCESS_OFFICE.role && (
                    <Typography
                        variant="body2"
                        display="inline"
                        onClick={modalOpen}
                        className={classes.more}>
                        Voir traitement
                    </Typography>
                )}
            </>
        </TableCell>
    );
}

DecisionsCell.propTypes = {
    modalOpen: PropTypes.func.isRequired,
    visitor: PropTypes.shape({
        units: PropTypes.array
    }).isRequired
};

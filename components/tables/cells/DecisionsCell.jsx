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
        color: theme.palette.success.main,
        marginLeft: '5px'
    },
    iconWarning: {
        color: theme.palette.warning.main
    },
    decisionPart: {
        display: 'flex'
    },
    typoContent: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#F8F8F8',
        padding: theme.spacing(1),
        borderRadius: '4px',
        marginBottom: '10px',
        maxWidth: '175px'
    },
    more: {
        marginLeft: theme.spacing(2),
        color: theme.palette.primary.dark,
        cursor: 'pointer'
    }
}));
export default function DecisionsCell({ visitor, modalOpen }) {
    const classes = useStyles();
    const { isRejected, getScreeningDecision, getOSDecision } = getDecisions();
    const screeningDecision = getScreeningDecision(visitor.units);

    function screeningDisplay() {
        if (screeningDecision === WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE.negative)
            return (
                <WarningIcon
                    key="negative"
                    className={classes.iconWarning}
                    alt="RES"
                    title="icone RES"
                />
            );
        if (screeningDecision === WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE.positive)
            return (
                <CheckCircleIcon
                    key="positive"
                    className={classes.iconSuccess}
                    alt="Validé"
                    title="icone RAS"
                />
            );
    }

    /**
     * Check decision of the previous actor to get the right display.
     * @returns icon.
     */
    function GetRightDisplay(decision) {
        if (decision === 'WAITING')
            return (
                <TimerIcon
                    className={classes.iconWarning}
                    alt="En attente"
                    title="icone en attente"
                />
            );
        else
            return (
                <div className={classes.decisionPart}>
                    {decision}
                    <CheckCircleIcon
                        className={classes.iconSuccess}
                        alt="Validé"
                        title="icone validée"
                    />
                </div>
            );
    }
    return (
        <TableCell>
            {activeRoleCacheVar().role === ROLES.ROLE_ACCESS_OFFICE.role ? (
                <>
                    <div style={{ display: 'block' }}>
                        {visitor.units.map((unit) =>
                            unit.label === isRejected(unit) ? (
                                <Typography key={unit.label} className={classes.typoContent}>
                                    {unit.label}
                                    <ErrorIcon
                                        key={unit.label}
                                        color="error"
                                        alt="Refusée"
                                        title="icone refusée"
                                    />
                                </Typography>
                            ) : (
                                <Typography key={unit.label} className={classes.typoContent}>
                                    {unit.label}
                                    {getOSDecision(unit)
                                        ? GetRightDisplay(getOSDecision(unit))
                                        : screeningDisplay()}
                                </Typography>
                            )
                        )}
                    </div>
                    <Typography
                        variant="body2"
                        display="inline"
                        onClick={modalOpen}
                        className={classes.more}>
                        Voir traitement
                    </Typography>
                </>
            ) : (
                screeningDisplay()
            )}
        </TableCell>
    );
}

DecisionsCell.propTypes = {
    modalOpen: PropTypes.func.isRequired,
    visitor: PropTypes.shape({
        units: PropTypes.array
    }).isRequired
};

import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import { WORKFLOW_BEHAVIOR, ROLES } from '../../../utils/constants/enums';
import getDecisions from '../../../utils/mappers/getDecisions';
import PropTypes from 'prop-types';
import { activeRoleCacheVar } from '../../../lib/apollo/cache';

export default function DecisionsCell({ visitor }) {
    const screeningDecision = getDecisions(visitor.units).find(
        (u) => u.label === ROLES.ROLE_SCREENING.label
    );

    const osDecisions = getDecisions(visitor.units).filter(
        (u) => u.label === ROLES.ROLE_SECURITY_OFFICER.label
    );

    function GetRightDisplay() {
        switch (activeRoleCacheVar().role) {
            case ROLES.ROLE_SECURITY_OFFICER.role: {
                return screeningDecision.value.value ===
                    WORKFLOW_BEHAVIOR.ADVISEMENT.RESPONSE.positive ? (
                    <CheckCircleIcon alt="RAS" title="icone RAS" />
                ) : (
                    <WarningIcon alt="RES" title="icone RES" />
                );
            }
            case ROLES.ROLE_ACCESS_OFFICE.role: {
                return osDecisions.map((e) =>
                    e.value.value === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.positive ? (
                        <Typography key={e.unit}>
                            {e.unit}
                            <CheckCircleIcon alt="Validé" title="icone validée" />
                        </Typography>
                    ) : (
                        <Typography key={e.unit}>
                            {e.unit}
                            <ErrorIcon key={e.unit} alt="Refusée" title="icone refusée" />
                        </Typography>
                    )
                );
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

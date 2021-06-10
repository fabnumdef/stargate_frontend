import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { activeRoleCacheVar } from '../../../lib/apollo/cache';
import { ROLES } from '../../../utils/constants/enums';

import SeeMoreOrLess from '../../styled/common/SeeMoreOrLess';

const useStyles = makeStyles(() => ({
    subtitles: {
        fontWeight: 'bold'
    },
    widthCell: {
        maxWidth: '220px',
        verticalAlign: 'baseline'
    }
}));

export default function RequestCell({ request }) {
    const classes = useStyles();
    return (
        <TableCell className={classes.widthCell}>
            <div>
                <Typography display="inline" variant="body2" className={classes.subtitles}>
                    Demande :
                </Typography>
                <Typography display="inline" variant="caption">{` ${request.id}`}</Typography>
            </div>
            <div>
                <Typography display="inline" variant="body2" className={classes.subtitles}>
                    Période :
                </Typography>
                <Typography display="inline" variant="caption">{` ${request.period}`}</Typography>
            </div>
            <div>
                <Typography display="inline" variant="body2" className={classes.subtitles}>
                    Demandeur :
                </Typography>
                <Typography display="inline" variant="caption">{` ${request.owner}`}</Typography>
            </div>
            <div>
                <Typography display="inline" variant="body2" className={classes.subtitles}>
                    Lieux :
                </Typography>

                <Typography display="inline" variant="caption">{` ${request.places}`}</Typography>
            </div>
            {activeRoleCacheVar().role !== ROLES.ROLE_UNIT_CORRESPONDENT.role && (
                <div>
                    <Typography display="inline" variant="body2" className={classes.subtitles}>
                        Motif :
                    </Typography>
                    <SeeMoreOrLess>{` ${request.reason}`}</SeeMoreOrLess>
                </div>
            )}
        </TableCell>
    );
}

RequestCell.propTypes = {
    request: PropTypes.shape({
        id: PropTypes.string,
        period: PropTypes.string,
        owner: PropTypes.string,
        places: PropTypes.string,
        reason: PropTypes.string
    }).isRequired
};

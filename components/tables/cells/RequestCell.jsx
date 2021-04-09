import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { activeRoleCacheVar } from '../../../lib/apollo/cache';
import { ROLES } from '../../../utils/constants/enums';

import SeeMoreOrLess from '../../styled/common/SeeMoreOrLess';

const useStyles = makeStyles(() => ({
    subtitles: {
        fontWeight: 'bold'
    }
}));

export default function RequestCell({ request }) {
    const classes = useStyles();

    return (
        <TableCell>
            <Grid container>
                <Grid item sm={12}>
                    <Typography variant="body1" color="primary" className={classes.subtitles}>
                        Demande :
                    </Typography>
                    <Typography variant="body1" color="primary">
                        {request.id}
                    </Typography>
                </Grid>
                <Grid item sm={12}>
                    <Typography variant="body1" color="primary" className={classes.subtitles}>
                        Période :
                    </Typography>
                    <Typography variant="body1" color="primary">
                        {request.period}
                    </Typography>
                </Grid>
                <Grid item sm={12}>
                    <Typography variant="body1" color="primary" className={classes.subtitles}>
                        Demandeur :
                    </Typography>
                    <Typography variant="body1" color="primary">
                        {request.owner}
                    </Typography>
                    <Typography variant="body1" color="primary" className={classes.subtitles}>
                        Lieux :
                    </Typography>
                    <Typography variant="body1" color="primary">
                        {request.places}
                    </Typography>
                </Grid>
                {!ROLES[activeRoleCacheVar().role].role.includes(
                    ROLES.ROLE_UNIT_CORRESPONDENT.role
                ) && (
                    <Grid item sm={12}>
                        <Typography variant="body1" color="primary" className={classes.subtitles}>
                            Motif :
                        </Typography>
                        <SeeMoreOrLess>{request.reason}</SeeMoreOrLess>
                    </Grid>
                )}
            </Grid>
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

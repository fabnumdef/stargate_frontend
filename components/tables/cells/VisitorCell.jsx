import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyle = makeStyles(() => ({
    subtitles: {
        fontWeight: 'bold'
    },
    widthCell: {
        maxWidth: '220px',
        verticalAlign: 'baseline'
    }
}));

export default function VisitorCell({ visitor }) {
    const classes = useStyle();
    return (
        <TableCell className={classes.widthCell}>
            <div>
                <Typography display="inline" variant="body2" className={classes.subtitles}>
                    Visiteur :
                </Typography>
                <Typography display="inline" variant="caption">
                    {` ${visitor.firstname} ${visitor.lastname}`}
                </Typography>
            </div>
            <div>
                <Typography display="inline" variant="body2" className={classes.subtitles}>
                    Origine :
                </Typography>
                <Typography display="inline" variant="caption">
                    {` ${visitor.isInternal}`}
                </Typography>
            </div>
            <div>
                <Typography display="inline" variant="body2" className={classes.subtitles}>
                    Unité / Société :
                </Typography>
                <Typography display="inline" variant="caption">{` ${visitor.company}`}</Typography>
            </div>
            <div>
                <Typography display="inline" variant="body2" className={classes.subtitles}>
                    Type d&apos;employé :
                </Typography>
                <Typography
                    display="inline"
                    variant="caption">{` ${visitor.employeeType}`}</Typography>
            </div>
        </TableCell>
    );
}

VisitorCell.propTypes = {
    visitor: PropTypes.shape({
        firstname: PropTypes.string,
        isInternal: PropTypes.string,
        lastname: PropTypes.string,
        company: PropTypes.string,
        employeeType: PropTypes.string
    }).isRequired
};

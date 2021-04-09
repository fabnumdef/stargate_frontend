import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyle = makeStyles(() => ({
    subtitles: {
        fontWeight: 'bold'
    }
}));

export default function VisitorCell({ visitor }) {
    const classes = useStyle();

    return (
        <TableCell>
            <Grid container>
                <Grid item sm={12}>
                    <Typography variant="body1" color="primary" className={classes.subtitles}>
                        Visiteur :
                    </Typography>
                    <Typography variant="body1" color="primary">
                        {`${visitor.firstname} ${visitor.lastname}`}
                    </Typography>
                </Grid>
                <Grid item sm={12}>
                    <Typography variant="body1" color="primary" className={classes.subtitles}>
                        Origine :
                    </Typography>
                    <Typography variant="body1" color="primary">
                        {visitor.isInternal}
                    </Typography>
                </Grid>
                <Grid item sm={12}>
                    <Typography variant="body1" color="primary" className={classes.subtitles}>
                        Unité / Société :
                    </Typography>
                    <Typography variant="body1" color="primary">
                        {visitor.compagny}
                    </Typography>
                </Grid>
                <Grid item sm={12}>
                    <Typography variant="body1" color="primary" className={classes.subtitles}>
                        Type d&apos;employé :
                    </Typography>
                    <Typography variant="body1" color="primary">
                        {visitor.employeeType}
                    </Typography>
                </Grid>
            </Grid>
        </TableCell>
    );
}

VisitorCell.propTypes = {
    visitor: PropTypes.shape({
        firstname: PropTypes.string,
        isInternal: PropTypes.string,
        lastname: PropTypes.string,
        compagny: PropTypes.string,
        employeeType: PropTypes.string
    }).isRequired
};

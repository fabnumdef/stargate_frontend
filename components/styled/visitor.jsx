import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    iconStar: {
        height: 'auto'
    },
    gridNameIconVisit: {
        display: 'flex'
    },
    gridReason: {
        lineHeight: '1rem',
        fontStyle: 'italic',
        marginTop: '1%'
    },
    test: {
        maxWidth: '300px',
        width: '300px',
        wordBreak: 'break-word',
        whiteSpace: 'normal'
    }
}));

export default function Visitor({ name, vip, vipReason }) {
    const classes = useStyles();
    return (
        <Grid container className={classes.test}>
            <Grid item sm={11} xs={11} md={11} lg={11}>
                {name}
            </Grid>
            <Grid item sm={1} xs={1} md={1} lg={1} className={classes.gridNameIconVisit}>
                {vip && <StarBorderRoundedIcon color="secondary" className={classes.iconStar} />}
            </Grid>
            <Grid item sm={9} xs={9} md={9} lg={9} className={classes.gridReason}>
                {vip && vipReason}
            </Grid>
        </Grid>
    );
}

Visitor.propTypes = {
    name: PropTypes.string.isRequired,
    vip: PropTypes.bool.isRequired,
    vipReason: PropTypes.string
};

Visitor.defaultProps = {
    vipReason: ''
};

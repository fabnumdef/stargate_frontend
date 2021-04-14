import React from 'react';
import ArrowPath from '../../icons/ArrowPath';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    link: {
        fontSize: '1em',
        color: theme.palette.primary.main,
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.primary.dark
        }
    },
    arrow: {
        fontSize: '1em'
    }
}));

export default function LinkBack({ ...others }) {
    const classes = useStyles();
    return (
        <div role="link" className={classes.link} aria-hidden="true" {...others}>
            <ArrowPath className={classes.arrow} /> RETOUR
        </div>
    );
}

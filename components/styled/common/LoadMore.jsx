import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: '10px',
        background: theme.palette.background.table,
        color: theme.palette.primary.main
    },
    notLoad: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    load: {
        display: 'flex',
        justifyContent: 'center'
    },
    button: {
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.primary.dark
        }
    }
}));

export default function LoadMore({ onLoadMore, display }) {
    const classes = useStyles();

    const [load, setLoad] = useState(false);

    const handlerClick = async () => {
        setLoad(true);
        await onLoadMore();
        setLoad(false);
    };

    return (
        display && (
            <div className={`${classes.root} ${load ? classes.load : classes.notLoad}`}>
                {load ? (
                    <CircularProgress />
                ) : (
                    <Typography className={classes.button} onClick={handlerClick}>
                        Voir les 10 suivants
                    </Typography>
                )}
            </div>
        )
    );
}

LoadMore.propTypes = {
    display: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired
};

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        background: theme.palette.background.table,
        color: theme.palette.primary.main
    }
}));

export default function LoadMore({ onLoadMore }) {
    const classes = useStyles();

    const [load, setLoad] = useState(false);

    const handlerClick = async () => {
        setLoad(true);
        await onLoadMore();
        setLoad(false);
    };

    return (
        <div className={classes.root}>
            {load ? (
                'Loading ...'
            ) : (
                <Typography onClick={handlerClick}>Voir les 10 suivants</Typography>
            )}
        </div>
    );
}

LoadMore.propTypes = {
    onLoadMore: PropTypes.func.isRequired
};

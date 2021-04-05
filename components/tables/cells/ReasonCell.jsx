import React, { useState } from 'react';

import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    more: {
        marginLeft: theme.spacing(2),
        color: theme.palette.primary.dark,
        cursor: 'pointer'
    }
}));

const MAX_LENGTH = 140;

export default function ReasonCell({ children, ...others }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const render = React.useMemo(() => {
        if (children.length < MAX_LENGTH) return children;
        return open ? (
            <>
                {children}
                <Typography
                    variant="body2"
                    display="inline"
                    tabIndex="0"
                    className={classes.more}
                    onClick={() => setOpen(!open)}>
                    Voir moins
                </Typography>
            </>
        ) : (
            <>
                {`${children.slice(0, MAX_LENGTH)}...`}
                <Typography
                    variant="body2"
                    display="inline"
                    className={classes.more}
                    onClick={() => setOpen(!open)}>
                    Voir plus
                </Typography>
            </>
        );
    }, [children, open]);

    return <TableCell {...others}>{render}</TableCell>;
}

ReasonCell.propTypes = {
    children: PropTypes.string.isRequired
};

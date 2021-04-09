import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    more: {
        marginLeft: theme.spacing(2),
        color: theme.palette.primary.dark,
        cursor: 'pointer'
    }
}));

const MAX_LENGTH = 250;

export default function SeeMoreOrLess({ children }) {
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

    return render;
}

SeeMoreOrLess.propTypes = {
    children: PropTypes.string.isRequired
};

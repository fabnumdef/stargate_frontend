import React from 'react';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles((theme) => ({
    alert: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        margin: '15px',
        padding: '8px',
        background: theme.palette.common.white,
        textAlign: 'left'
    },
    title: {
        fontWeight: '700'
    },
    infoAlert: {
        borderLeft: `3px solid ${theme.palette.primary.light}`
    },
    infoIcon: {
        color: theme.palette.primary.light,
        marginRight: '8px'
    }
}));

/** @todo different severity */
export default function AlertMessage({ severity, title, subtitle }) {
    const classes = useStyles();

    const icon = React.useMemo(() => {
        switch (severity) {
            case 'info':
                return InfoOutlinedIcon;
            default:
                return null;
        }
    }, [severity]);

    return (
        <div className={`${classes.alert} ${classes.infoAlert}`}>
            {React.createElement(icon, { className: classes.infoIcon })}
            <div>
                <Typography variant="subtitle2" className={classes.title}>
                    {title}
                </Typography>
                {subtitle}
            </div>
        </div>
    );
}

AlertMessage.propTypes = {
    severity: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.any.isRequired
};

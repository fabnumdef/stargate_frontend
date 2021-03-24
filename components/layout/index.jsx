import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from './AppBar';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    root: {
        height: '100%'
    }
}));

export default function LayoutTemplate({ children }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar drawerWidth={260} />
            {children}
        </div>
    );
}

LayoutTemplate.propTypes = {
    children: PropTypes.node.isRequired
};

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from './AppBar';
import Drawer from './Drawer';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    root: {
        height: '100%'
    }
}));

const DRAWER_WIDTH = 260;
export default function LayoutTemplate({ children }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar drawerWidth={DRAWER_WIDTH} />
            <Drawer drawerWidth={DRAWER_WIDTH} />
            {children}
        </div>
    );
}

LayoutTemplate.propTypes = {
    children: PropTypes.node.isRequired
};

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from './AppBar';
import Drawer from './Drawer';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1, 12),
        paddingTop: theme.spacing(3)
    },
    toolBar: {
        minHeight: 112
    }
}));

const DRAWER_WIDTH = 260;
export default function LayoutTemplate({ children }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar drawerWidth={DRAWER_WIDTH} />
            <Drawer drawerWidth={DRAWER_WIDTH} />
            <main className={classes.content}>
                <div className={classes.toolBar} />
                {children}
            </main>
        </div>
    );
}

LayoutTemplate.propTypes = {
    children: PropTypes.node.isRequired
};

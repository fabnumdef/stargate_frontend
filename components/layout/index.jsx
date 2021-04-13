import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from './AppBar';
import Drawer from './Drawer';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        display: 'flex'
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        paddingTop: theme.spacing(3),
        maxWidth: 1380,
        margin: 'auto'
    },
    toolBar: {
        minHeight: 64
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
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from './MenuIcon';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
const useStyles = (drawerWidth) =>
    makeStyles(() => ({
        grow: {
            flexGrow: 1
        },
        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            position: 'absolute'
        }
    }))();

export default function AppBarTemplate({ drawerWidth }) {
    const classes = useStyles(drawerWidth);

    return (
        <AppBar elevation={0} className={classes.appBar} color="transparent">
            <Toolbar variant="regular" className={classes.toolBarStyle}>
                <div className={classes.grow} />
                <MenuIcon />
            </Toolbar>
        </AppBar>
    );
}

AppBarTemplate.propTypes = {
    drawerWidth: PropTypes.number.isRequired
};

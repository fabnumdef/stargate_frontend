import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DescriptionIcon from '@material-ui/icons/Description';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import PropTypes from 'prop-types';

const useStyles = (drawerWidth) =>
    makeStyles(() => ({
        drawer: {
            width: drawerWidth
        },
        drawerPaper: {
            width: drawerWidth,
            background: 'linear-gradient(138.25deg, #FFFFFF 5.07%, #F3F3F3 62.6%, #FFFFFF 100%)',
            borderRigth: 'none'
        },
        appName: {
            width: 200
        },
        toolBar: {
            minHeight: 64,
            display: 'table-cell',
            textAlign: 'center',
            padding: '30px',
            verticalAlign: 'middle'
        }
    }))();

const menu = [
    { label: 'Mes traitements', permission: '/', icon: DescriptionIcon },
    {
        label: 'Mes Demandes',
        permission: '/mes-demandes',
        icon: DescriptionIcon
    }
];

export default function DrawerTemplate({ drawerWidth }) {
    const classes = useStyles(drawerWidth);

    return (
        <Drawer
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper
            }}
            variant="permanent"
            anchor="left">
            <div className={classes.toolBar}>
                <img src="/img/logo.svg" alt="STARGATE" className={classes.appName} />
            </div>
            <List>
                {menu.map((item) => (
                    <ListItem button key={item.label}>
                        <ListItemIcon>{React.createElement(item.icon)}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
                <Divider />
                <ListItem button>
                    <ListItemIcon>
                        <ThumbUpAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="À propos" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <ContactSupportIcon />
                    </ListItemIcon>
                    <ListItemText primary="Contactez-nous" />
                </ListItem>
            </List>
        </Drawer>
    );
}

DrawerTemplate.propTypes = {
    drawerWidth: PropTypes.number.isRequired
};

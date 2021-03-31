import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { ROLES } from '../../utils/constants/enums';
import { GET_ACTIVE_ROLE } from '../../lib/apollo/queries';
import NormalListItem from './NormalListItem';

import DescriptionIcon from '@material-ui/icons/Description';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import PeopleIcon from '@material-ui/icons/People';
import TreatmentsIcon from '../icons/MyTreatmentsIcon';
import MyRequestsIcon from '../icons/MyRequestsIcon';
import ContactUsIcon from '../icons/ContactUsIcon';

const useStyles = (drawerWidth) =>
    makeStyles((theme) => ({
        drawer: {
            width: drawerWidth
        },
        drawerPaper: {
            width: drawerWidth,
            background: 'linear-gradient(138.25deg, #FFFFFF 5.07%, #F3F3F3 62.6%, #FFFFFF 100%)',
            borderRight: 'none'
        },
        appName: {
            width: 200
        },
        gutter: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4)
        },
        toolBar: {
            minHeight: 64,
            display: 'table-cell',
            textAlign: 'center',
            padding: '30px',
            verticalAlign: 'middle'
        },
        selected: {
            color: theme.palette.primary.main,
            '&:hover': {
                color: theme.palette.primary.dark,
                backgroundColor: fade(theme.palette.primary.light, 0.15)
            }
        },
        icon: {
            color: 'inherit'
        }
    }))();

const menu = [
    { label: 'index', permission: '/', icon: TreatmentsIcon },
    {
        label: 'Mes demandes',
        permission: '/mes-demandes',
        icon: MyRequestsIcon
    },
    {
        label: 'Administration',
        subItems: [
            { label: 'Unité', permission: '/administration/unites', icon: DescriptionIcon },
            { label: 'Base', permission: '/administration/base', icon: DescriptionIcon },
            {
                label: 'Utilisateurs',
                permission: '/administration/utilisateurs',
                icon: PeopleIcon
            }
        ],
        permission: '/administration',
        icon: DescriptionIcon
    }
];

function rootNameByRole(role) {
    switch (role) {
        case ROLES.ROLE_HOST.role:
            return 'Mes demandes';
        case ROLES.ROLE_ADMIN.role:
        case ROLES.ROLE_SUPERADMIN.role:
            return 'Accueil';
        case ROLES.ROLE_SCREENING.role:
        case ROLES.ROLE_GATEKEEPER.role:
        case ROLES.ROLE_UNIT_CORRESPONDENT.role:
        default:
            return 'Mes traitements';
    }
}

export default function DrawerTemplate({ drawerWidth }) {
    const classes = useStyles(drawerWidth);
    const router = useRouter();

    const {
        data: { activeRoleCache }
    } = useQuery(GET_ACTIVE_ROLE);

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
                {menu.map(
                    (item) =>
                        ROLES[activeRoleCache.role].permission.includes(item.permission) && (
                            <NormalListItem
                                key={item.label}
                                item={item}
                                action={(permission) => router.push(permission)}
                                label={
                                    item.label === 'index'
                                        ? rootNameByRole(activeRoleCache.role)
                                        : null
                                }
                                pathname={router.pathname}
                            />
                        )
                )}
                <Divider variant="middle" />
                <NormalListItem
                    item={{ label: 'À propos', permission: '/about', icon: ThumbUpAltIcon }}
                    action={(permission) => router.push(permission)}
                    pathname={router.pathname}
                />
                <NormalListItem
                    item={{
                        label: 'Contactez-nous',
                        permission: '/contactez-nous',
                        icon: ContactUsIcon
                    }}
                    action={(permission) => router.push(permission)}
                    pathname={router.pathname}
                />
            </List>
        </Drawer>
    );
}

DrawerTemplate.propTypes = {
    drawerWidth: PropTypes.number.isRequired
};

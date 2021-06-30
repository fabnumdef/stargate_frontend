import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import { ROLES } from '../../utils/constants/enums';
import { activeRoleCacheVar } from '../../lib/apollo/cache';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.common.grey,
        '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.common.white
        }
    },
    font: {
        fontWeight: '500'
    },
    selected: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.common.white,
        '&:hover': {
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.common.white
        }
    },
    selectItem: {
        marginLeft: '-19px',
        marginRight: '19px'
    },
    selectIcon: {
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        marginRight: '17px'
    },
    icon: {
        color: 'inherit'
    },
    nested: {
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(4)
    },
    gutters: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4)
    }
}));

export default function NormalListItem({ item, action, pathname, label, child }) {
    const classes = useStyles();
    const isSelected = React.useMemo(() => {
        if (item.permission === '/') return pathname === item.permission;

        if (
            (activeRoleCacheVar().role === ROLES.ROLE_SUPERADMIN.role && pathname === '/') ||
            (activeRoleCacheVar().role === ROLES.ROLE_ADMIN.role && pathname === '/')
        )
            return item.permission === '/administration/utilisateurs';

        if (activeRoleCacheVar().role === ROLES.ROLE_HOST.role && pathname === '/')
            return item.permission === '/demandes';

        return pathname.includes(item.permission);
    }, [pathname]);

    const [open, setOpen] = React.useState(isSelected);

    const handleClick = () => {
        if (item?.subItems?.length > 0) {
            setOpen(!open);
            return;
        }
        action(item.permission);
    };

    return (
        <>
            <ListItem
                button
                disableRipple
                classes={{
                    root: classes.root,
                    gutters: child ? classes.nested : classes.gutters
                }}
                className={`${isSelected ? classes.selected : ''}`}
                onClick={handleClick}>
                <ListItemIcon
                    classes={{ root: classes.icon }}
                    className={isSelected && !child ? classes.selectItem : ''}>
                    {isSelected && !child && <div className={classes.selectIcon} />}
                    {React.createElement(item.icon)}
                </ListItemIcon>
                <ListItemText
                    disableTypography
                    classes={{ root: classes.font }}
                    primary={label || item.label}
                />
                {(() => {
                    if (!item?.subItems?.length > 0) return;
                    return open ? <ExpandLess /> : <ExpandMore />;
                })()}
            </ListItem>
            {item?.subItems?.length > 0 && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.subItems.map(
                            (subItem) =>
                                ROLES[activeRoleCacheVar().role].permission.includes(
                                    subItem.permission
                                ) && (
                                    <NormalListItem
                                        key={subItem.label}
                                        item={subItem}
                                        pathname={pathname}
                                        action={(permission) => action(permission)}
                                        child
                                    />
                                )
                        )}
                    </List>
                </Collapse>
            )}
        </>
    );
}

NormalListItem.propTypes = {
    child: PropTypes.bool,
    item: PropTypes.object.isRequired,
    action: PropTypes.func.isRequired,
    pathname: PropTypes.string,
    label: PropTypes.string
};

NormalListItem.defaultProps = {
    pathname: '',
    label: null,
    child: false
};

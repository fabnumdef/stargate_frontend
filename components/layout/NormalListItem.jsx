import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import { ROLES } from '../../utils/constants/enums';
import { activeRoleCacheVar } from '../../lib/apollo/cache';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    selected: {
        color: theme.palette.primary.main,
        '&:hover': {
            color: theme.palette.primary.dark,
            backgroundColor: fade(theme.palette.primary.light, 0.15)
        }
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
                classes={child ? { gutters: classes.nested } : { gutters: classes.gutters }}
                className={`${isSelected ? classes.selected : ''}`}
                onClick={handleClick}>
                <ListItemIcon classes={{ root: classes.icon }}>
                    {React.createElement(item.icon)}
                </ListItemIcon>
                <ListItemText primary={label || item.label} />
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

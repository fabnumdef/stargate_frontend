import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

export const ROUNDED_BUTTON_TYPE = {
    ADD: 'ADD',
    EDIT: 'EDIT'
};

const useStyles = makeStyles(() => ({
    editButton: {
        backgroundColor: 'white',
        boxShadow: '0 2px 10px 0 rgba(93, 119, 255, 0.1)',
        height: 40,
        width: 40
    },
    icon: {
        opacity: '0.4'
    }
}));

const selectButtonType = (type) => {
    const classes = useStyles();
    switch (type) {
        case ROUNDED_BUTTON_TYPE.ADD:
            return <AddIcon className={classes.icon} />;
        case ROUNDED_BUTTON_TYPE.EDIT:
            return <EditOutlinedIcon className={classes.icon} />;
        default:
            return '';
    }
};

const RoundedIconButton = ({ onClick, type }) => {
    const classes = useStyles();
    return (
        <IconButton onClick={onClick} className={classes.editButton}>
            {selectButtonType(type)}
        </IconButton>
    );
};

RoundedIconButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
};

export default RoundedIconButton;

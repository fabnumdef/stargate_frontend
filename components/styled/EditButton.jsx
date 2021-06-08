import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    editButton: {
        backgroundColor: 'white',
        boxShadow: '0 2px 10px 0 rgba(93, 119, 255, 0.1)'
    },
    icon: {
        opacity: '0.4'
    }
}));

const EditButton = ({ onClick }) => {
    const classes = useStyles();
    return (
        <IconButton onClick={onClick} className={classes.editButton}>
            <EditOutlinedIcon className={classes.icon} />
        </IconButton>
    );
};

EditButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default EditButton;

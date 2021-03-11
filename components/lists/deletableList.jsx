import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    list: {
        width: '250px',
        marginBottom: '3px'
    },
    icon: {
        height: '20px',
        width: '20px'
    }
}));

const DeletableList = ({ label, id, deleteItem, type }) => {
    const classes = useStyles();

    return (
        <Grid container justify="space-between" className={classes.list}>
            <span>{label}</span>
            <IconButton
                aria-label="supprimer"
                className={classes.icon}
                color="primary"
                onClick={() => deleteItem(id, type)}>
                <DeleteIcon />
            </IconButton>
        </Grid>
    );
};

DeletableList.defaultProps = {
    type: null
};

DeletableList.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    deleteItem: PropTypes.func.isRequired,
    type: PropTypes.string
};

export default DeletableList;

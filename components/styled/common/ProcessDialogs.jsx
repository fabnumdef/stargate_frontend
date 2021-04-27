import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import TableProcess from '../../tables/TableProcess';

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    dialog: {
        borderRadius: '10px',
        padding: theme.spacing(4),
        minHeight: '500px',
        minWidth: '900px'
    },
    title: {
        fontSize: '1.125rem',
        paddingBottom: theme.spacing(4)
    },
    sizeTypo: {
        fontSize: '1.125rem',
        fontWeight: 'bold'
    },
    actionNotHover: {
        color: 'rgba(0, 0, 0, 0.25)'
    },
    icon: {
        '&:hover': {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main
        }
    },
    deleteButton: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark
        }
    },
    content: {
        margin: theme.spacing(1),
        height: '10vh',
        display: 'flex',
        alignItems: 'center'
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'center'
    }
}));

function ProcessDialogs({ units, isOpen, onClose }) {
    const classes = useStyles();
    return (
        <Dialog
            classes={{ paper: classes.dialog }}
            aria-labelledby="Suppression dialog"
            open={isOpen}>
            <MuiDialogTitle disableTypography className={classes.title}>
                <Typography align="center" variant="h3" className={classes.sizeTypo}>
                    Processus traitement
                </Typography>
                <IconButton aria-label="close" className={classes.closeButton}>
                    <CloseIcon onClick={onClose} />
                </IconButton>
            </MuiDialogTitle>
            <MuiDialogContent className={classes.content}>
                <TableProcess units={units} />
            </MuiDialogContent>
        </Dialog>
    );
}

ProcessDialogs.propTypes = {
    units: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ProcessDialogs;

import React from 'react';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableContainerMui from '@material-ui/core/TableContainer';

const useStyles = (height) =>
    makeStyles((theme) => ({
        cont: {
            position: 'relative',
            width: '100%'
        },
        root: {
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            padding: '0 20px 0 20px',
            background: theme.palette.background.table,
            maxHeight: '63vh',
            overflowX: 'hidden'
        },
        header: {
            position: 'absolute',
            top: '1px',
            left: '0',
            width: '100%',
            height: `${height}px`,
            backgroundColor: 'white',
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-1px',
                height: '1px',
                width: '100%',
                backgroundColor: 'rgba(224, 224, 224, 1)'
            }
        }
    }))();

export default function TableContainer({ height, children }) {
    const classes = useStyles(height);

    return (
        <div className={classes.cont}>
            <div className={classes.header} />
            <TableContainerMui className={classes.root}>{children}</TableContainerMui>
        </div>
    );
}

TableContainer.propTypes = {
    height: PropTypes.number.isRequired,
    children: PropTypes.any.isRequired
};

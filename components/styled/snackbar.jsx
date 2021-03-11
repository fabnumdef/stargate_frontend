import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';
import PropTypes from 'prop-types';

export default function TransitionsSnackbar(props) {
    const { alert, open } = props;

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            TransitionComponent={Fade}
            autoHideDuration={5000}
            open={open}>
            <Alert severity={alert.severity}>{alert.message}</Alert>
        </Snackbar>
    );
}

TransitionsSnackbar.propTypes = {
    alert: PropTypes.objectOf(PropTypes.string).isRequired,
    open: PropTypes.bool.isRequired
};

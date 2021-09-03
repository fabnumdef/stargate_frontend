import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';
import PropTypes from 'prop-types';

export default function TransitionsSnackbar(props) {
    const { alert, open } = props;
    const [snackPack, setSnackPack] = React.useState([]);
    const [openSnack, setOpenSnack] = React.useState(open);
    const [messageInfo, setMessageInfo] = React.useState(alert.message);

    React.useEffect(() => {
        if (snackPack.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpenSnack(true);
        } else if (snackPack.length && messageInfo && openSnack) {
            // Close an active snack when a new one is added
            setOpenSnack(false);
        }
    }, [snackPack, messageInfo, openSnack]);

    const handleEnter = () => () => {
        setSnackPack((prev) => [...prev, { message: messageInfo, key: new Date().getTime() }]);
    };

    const handleClose = () => {
        setOpenSnack(false);
    };

    const handleExited = () => {
        setMessageInfo(undefined);
    };

    return (
        <Snackbar
            key={messageInfo ? messageInfo.key : undefined}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            TransitionComponent={Fade}
            onEnter={handleEnter}
            onClose={handleClose}
            onExited={handleExited}
            autoHideDuration={5000}
            open={open}>
            <Alert severity={alert.severity}>{messageInfo}</Alert>
        </Snackbar>
    );
}

TransitionsSnackbar.propTypes = {
    alert: PropTypes.objectOf(PropTypes.string).isRequired,
    open: PropTypes.bool.isRequired
};

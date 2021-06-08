import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
    backButton: {
        padding: 0,
        marginBottom: 15,
        fontWeight: 'bold',
        cursor: 'pointer'
    }
});

const HeaderPageBackBtn = ({ children }) => {
    const router = useRouter();
    const classes = useStyles();

    return (
        <Button onClick={() => router.back()} className={classes.backButton}>
            <KeyboardBackspaceIcon />
            {children}
        </Button>
    );
};

HeaderPageBackBtn.propTypes = {
    children: PropTypes.node.isRequired
};

export default HeaderPageBackBtn;

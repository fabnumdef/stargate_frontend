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

const HeaderPageBackBtn = ({ to, children }) => {
    const router = useRouter();
    const classes = useStyles();

    return (
        <Button onClick={() => router.push(to)} className={classes.backButton}>
            <KeyboardBackspaceIcon />
            {children}
        </Button>
    );
};

HeaderPageBackBtn.defaultsProps = {
    to: '/'
};

HeaderPageBackBtn.propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string
};

export default HeaderPageBackBtn;

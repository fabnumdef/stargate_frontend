import React from 'react';
import PropTypes from 'prop-types';
// Import Material
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Header, Footer } from '../components';
import Loading from './loading';

const useStyles = makeStyles(() => ({
    container: {
        paddingTop: '20vh',
        minHeight: '100vh',
        marginBottom: '10%'
    }
}));

export default function Template({ children, loading }) {
    const classes = useStyles();

    return (
        <>
            <Header />
            <Box
                className={classes.container}
                mr={{ xs: 4, sm: 12, md: 24 }}
                ml={{ xs: 4, sm: 12, md: 24 }}>
                {loading ? <Loading /> : children}
            </Box>
            <Footer />
        </>
    );
}

Template.propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool
};

Template.defaultProps = {
    loading: false
};

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%'
    },
    pageTitle: {
        fontSize: '1.75rem',
        fontWeight: 'bold'
    }
}));

function PageTitle({ children, subtitles }) {
    const classes = useStyles();

    return (
        <Typography variant="h2" className={classes.pageTitle}>
            {`${children} `}
            {subtitles &&
                subtitles.map((sub) => (
                    <span key={sub}>
                        &gt;
                        {` ${sub} `}
                    </span>
                ))}
        </Typography>
    );
}

PageTitle.defaultProps = {
    subtitles: []
};

PageTitle.propTypes = {
    children: PropTypes.string.isRequired,
    subtitles: PropTypes.arrayOf(PropTypes.string)
};

export default PageTitle;

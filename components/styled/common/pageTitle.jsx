import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%'
    },
    pageTitle: {
        fontSize: '1.50rem',
        marginBottom: 24,
        fontWeight: 'bold',
        '& h2': {
            fontSize: '1.75rem',
            display: 'inline',
            fontWeight: 'bold'
        }
    }
}));

function PageTitle({ children, subtitles }) {
    const classes = useStyles();

    return (
        <Grid className={classes.pageTitle}>
            <Typography variant="h2">{`${children} `}</Typography>
            {subtitles &&
                subtitles.map((sub, i) => (
                    <span key={sub + i}>
                        &gt;
                        {` ${sub} `}
                    </span>
                ))}
        </Grid>
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

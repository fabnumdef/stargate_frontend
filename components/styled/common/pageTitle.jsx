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
        marginBottom: 24,
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
                    <Typography variant="h2" key={sub + i}>
                        &gt;
                        {` ${sub} `}
                    </Typography>
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

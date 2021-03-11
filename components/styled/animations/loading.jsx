import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        height: '300px',
        width: '150px',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto'
    },
    loading1: {
        content: '',
        position: 'absolute',
        display: 'block',
        top: '50%',
        left: '0',
        height: '25%',
        width: '5%',
        background: theme.palette.secondary.main,
        zIndex: 2,
        transformOrigin: 'top',
        transform: 'scaleY(0)',
        animation: '$animate1 6s infinite normal'
    },
    loading2: {
        content: '',
        position: 'absolute',
        display: 'block',
        top: '0%',
        left: 0,
        height: '25%',
        width: '5%',
        background: theme.palette.secondary.main,
        zIndex: 2,
        transformOrigin: 'bottom',
        transform: 'scaleY(0)',
        animation: '$animate2 6s infinite normal'
    },
    loading3: {
        content: '',
        position: 'absolute',
        display: 'block',
        top: '50%',
        right: '0%',
        height: '25%',
        width: '5%',
        background: theme.palette.primary.main,
        zIndex: 2,
        transformOrigin: 'top',
        transform: 'scaleY(0)',
        animation: '$animate1 6s infinite normal'
    },
    loading4: {
        content: '',
        position: 'absolute',
        display: 'block',
        top: '0%',
        right: '0%',
        height: '25%',
        width: '5%',
        background: theme.palette.primary.main,
        zIndex: 2,
        transformOrigin: 'bottom',
        transform: 'scaleY(0)',
        animation: '$animate2 6s infinite normal'
    },

    '@keyframes animate1': {
        '0%': {
            transform: 'translateY(0) scaleY(0)',
            transformOrigin: 'top'
        },
        '100%': {
            transform: 'translateY(0) scaleY(0)',
            transformOrigin: 'top'
        },
        '40% ': {
            transform: 'translateY(0) scaleY(1)',
            transformOrigin: 'top'
        }
    },
    '@keyframes animate2': {
        '0%': {
            transform: 'translateY(100%) scaleY(0)',
            transformOrigin: 'bottom'
        },
        '100%': {
            transform: 'translateY(100%) scaleY(0)',
            transformOrigin: 'bottom'
        },
        '40%': {
            transform: 'translateY(100%) scaleY(1)',
            transformOrigin: 'bottom'
        }
    },
    men: {
        position: 'absolute',
        display: 'block',
        top: '35%',
        height: '30%',
        animation: '$walk 6s normal infinite'
    },
    '@keyframes walk': {
        '0%': {
            left: '-100%'
        },

        '100%': {
            left: '150%'
        }
    }
}));

export default function LoadingAnimation() {
    const classes = useStyles();

    const [hidden, setHidden] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            setHidden(false);
        }, 1500);
    }, []);

    if (!hidden) {
        return (
            <div style={{ textAlign: 'center' }}>
                <div className={classes.wrapper}>
                    <div className={classes.loading1} />
                    <div className={classes.loading2} />
                    <div className={classes.loading3} />
                    <div className={classes.loading4} />
                    <img src="/img/businesmmen.png" className={classes.men} alt="loadingAnim" />
                </div>
                Chargement ...
            </div>
        );
    }
    return '';
}

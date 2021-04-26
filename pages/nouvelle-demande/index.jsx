import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import PageTitle from '../../components/styled/common/pageTitle';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import Link from 'next/link';

import AlertMessage from '../../components/styled/common/sticker';
import RoundedButton from '../../components/styled/common/roundButton';
import AddVisitorIcon from '../../components/icons/AddVisitorIcon';
import GroupVisitorsIcon from '../../components/icons/GroupVisitorsIcon';
import PermanentIcon from '../../components/icons/PermanentIcon';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(6),
            width: theme.spacing(16),
            height: theme.spacing(16)
        }
    },
    demand: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        background: theme.palette.background.layout,
        alignItems: 'center',
        textAlign: 'center',
        height: '277px',
        padding: '20px',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
        width: '277px',
        '&:hover': {
            boxShadow: '0px 20px 30px rgba(0, 0, 0, 0.101961)'
        }
    },
    demandHover: {
        height: '392px'
    },
    avatar: {
        height: '68px',
        width: '68px',
        background: theme.palette.common.purple,
        color: theme.palette.common.white
    },
    iconDemand: {
        fontSize: '2.2rem'
    },
    button: {
        marginTop: '12px',
        '&:hover': {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.primary.dark,
            borderColor: `1px solid ${theme.palette.common.white}`
        }
    }
}));

function TypeDemand({ icon, title, subtitle, link }) {
    const classes = useStyles();

    return (
        <Paper className={classes.demand}>
            <Avatar className={classes.avatar}>
                {React.createElement(icon, { className: classes.iconDemand })}
            </Avatar>
            <div>
                <Typography variant="h6">{title}</Typography>
                {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
            </div>
            <Link href={link}>
                <RoundedButton className={classes.button} color="primary" variant="outlined">
                    Y accéder
                </RoundedButton>
            </Link>
        </Paper>
    );
}

TypeDemand.propTypes = {
    icon: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    link: PropTypes.string
};

function TypeDemandGroup({ icon, title, subtitle, link }) {
    const classes = useStyles();
    const [hover, setHover] = React.useState(false);

    return (
        <Paper
            className={`${classes.demand} ${hover ? classes.demandHover : ''}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <Avatar className={classes.avatar}>
                {React.createElement(icon, { className: classes.iconDemand })}
            </Avatar>
            <div>
                <Typography variant="h6">{title}</Typography>
                {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
            </div>
            <Link href={link}>
                <RoundedButton className={classes.button} color="primary" variant="outlined">
                    Y accéder
                </RoundedButton>
            </Link>
            {hover && (
                <AlertMessage
                    severity="info"
                    title="Information pré-requis"
                    subtitle={
                        <ul>
                            <li>Fichier CSV</li>
                            <li>1 référent de groupe</li>
                        </ul>
                    }
                />
            )}
        </Paper>
    );
}

TypeDemandGroup.propTypes = {
    icon: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    link: PropTypes.string
};

const demands = [
    {
        id: 'IndTempAcces',
        title: "Demande d'accès temporaire",
        subtitle: 'Un ou plusieurs visiteurs',
        icon: AddVisitorIcon,
        link: '/nouvelle-demande/simple'
    },
    {
        id: 'GroupTempAcces',
        title: "Demande d'accès temporaire",
        subtitle: 'Groupe important',
        icon: GroupVisitorsIcon,
        link: '/nouvelle-demande/groupe'
    },
    {
        id: 'IndPermAcces',
        title: "Demande d'accès permanent",
        icon: PermanentIcon,
        link: ''
    }
];

function NewRequestPage() {
    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <PageTitle>Nouvelle demande</PageTitle>
            <div className={classes.root}>
                {demands.map((demand) => {
                    if (demand.id === 'GroupTempAcces')
                        return (
                            <TypeDemandGroup
                                key={demand.id}
                                title={demand.title}
                                subtitle={demand.subtitle}
                                icon={demand.icon}
                                link={demand.link}
                            />
                        );

                    return (
                        <TypeDemand
                            key={demand.id}
                            title={demand.title}
                            subtitle={demand.subtitle}
                            icon={demand.icon}
                            link={demand.link}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default NewRequestPage;

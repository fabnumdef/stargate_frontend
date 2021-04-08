import React from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import PageTitle from '../../components/styled/common/pageTitle';
import { useQuery } from '@apollo/client';
import { GET_REQUEST } from '../../lib/apollo/queries';
import ArrowPath from '../../components/icons/ArrowPath';
import DetailsRequest from '../../components/styled/common/DetailsRequest';
import { STATE_REQUEST } from '../../utils/constants/enums';
import AlertMessage from '../../components/styled/common/sticker';
import { Typography } from '@material-ui/core';
import RequestVisitors from '../../containers/requestDetail/RequestVisitors';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(9, 12),
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
    },
    link: {
        fontSize: '1em',
        color: theme.palette.primary.dark,
        cursor: 'pointer'
    },
    arrow: {
        fontSize: '1em'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
}));

const STATUS = [
    { shortLabel: 'VA', label: 'Visiteur Accompagné' },
    { shortLabel: 'VL', label: 'Visiteur Libre' },
    { shortLabel: 'L', label: 'Libre' },
    { shortLabel: 'VIP', label: 'Autorité' }
];

function RequestDetailPageProgress() {
    const router = useRouter();
    const classes = useStyles();

    /** @todo Manage if request is not in cache */
    const { data, loading } = useQuery(GET_REQUEST, {
        variables: {
            requestId: router.query.id
        },
        skip: !router.query.id
    });

    if (loading || !data) {
        return '';
    }

    return (
        <div className={classes.paper}>
            <div
                role="link"
                className={classes.link}
                aria-hidden="true"
                onClick={() => router.back()}>
                <ArrowPath className={classes.arrow} /> RETOUR
            </div>
            <PageTitle className={classes.connection}>
                {data.getCampus?.getRequest?.status === STATE_REQUEST.STATE_CREATED.state
                    ? 'Demande en cours'
                    : 'Demande finalisée'}
            </PageTitle>
            <div className={classes.header}>
                <DetailsRequest request={data?.getCampus?.getRequest} />
                <AlertMessage
                    severity="info"
                    title="Information status"
                    subtitle={
                        <ul>
                            {STATUS.map((status) => (
                                <li key={status.shortLabel}>
                                    <Typography variant="subtitle2" display="inline">
                                        {status.shortLabel}
                                    </Typography>{' '}
                                    : {status.label}
                                </li>
                            ))}
                        </ul>
                    }
                />
            </div>
            <RequestVisitors id={data?.getCampus?.getRequest?.id} />
        </div>
    );
}

export default RequestDetailPageProgress;

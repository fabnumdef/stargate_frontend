import React from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import PageTitle from '../../../components/styled/common/pageTitle';
import { useQuery } from '@apollo/client';
import { GET_REQUEST } from '../../../lib/apollo/queries';
import ArrowPath from '../../../components/icons/ArrowPath';
import DetailsRequest from '../../../components/styled/common/DetailsRequest';

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
    }
}));

function RequestDetailPageProgress() {
    const router = useRouter();
    const classes = useStyles();

    const { data, loading } = useQuery(GET_REQUEST, {
        variables: {
            id: router.query.id
        }
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
            <PageTitle className={classes.connection}>Demande en cours</PageTitle>
            <DetailsRequest request={data.request} />
        </div>
    );
}

export default RequestDetailPageProgress;

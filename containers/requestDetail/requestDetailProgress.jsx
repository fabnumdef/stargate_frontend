import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client';

// Material Import
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useRouter } from 'next/router';
import { DetailsInfosRequest, TabRequestVisitorsProgress } from '../../components';

import { useSnackBar } from '../../lib/hooks/snackbar';
import Loading from '../loading';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%'
    },
    pageTitle: {
        margin: '16px 0',
        color: '#0d40a0',
        fontWeight: 'bold'
    },
    idRequest: {
        marginLeft: '10px',
        marginTop: '4px',
        color: '#0d40a0'
    },
    pageTitleHolder: {
        borderBottom: '1px solid #e5e5e5'
    },
    pageTitleControl: {
        marginLeft: 'auto'
    },
    tabContent: {
        margin: '20px 0'
    }
}));

export const READ_REQUEST = gql`
    query readRequest($requestId: String!, $campusId: String!) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            getRequest(id: $requestId) {
                id
                reason
                from
                to
                places {
                    label
                }
                owner {
                    id
                    lastname
                    firstname
                }
                listVisitors {
                    list {
                        id
                        vip
                        rank
                        firstname
                        birthLastname
                        employeeType
                        company
                        status
                        units {
                            id
                            label
                            steps {
                                role
                                behavior
                                state {
                                    isOK
                                    value
                                    tags
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const DELETE_VISITOR = gql`
    mutation deleteVisitor($idVisitor: ObjectID!, $requestId: String!, $campusId: String!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            mutateRequest(id: $requestId) {
                cancelVisitor(id: $idVisitor) {
                    id
                    status
                }
            }
        }
    }
`;

export default function RequestDetails({ requestId }) {
    const classes = useStyles();
    const router = useRouter();
    const client = useApolloClient();

    const userData = client.readQuery({
        query: gql`
            query getUserId {
                me {
                    id
                }
            }
        `
    });

    const { addAlert } = useSnackBar();

    const { data, loading, refetch } = useQuery(READ_REQUEST, {
        variables: { requestId }
    });

    const [deleteVisitor] = useMutation(DELETE_VISITOR);

    useEffect(() => {
        if (data && userData && data.getCampus.getRequest.owner.id !== userData.me.id) {
            router.push('/');
        }
    }, [data]);

    // @todo a real 404 page
    // if (error) return <p>page 404</p>;

    return loading ? (
        <Loading />
    ) : (
        <>
            <Grid container spacing={2} className={classes.root}>
                <Grid item sm={12} xs={12}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="h5" className={classes.pageTitle}>
                            Demandes en cours :
                        </Typography>
                        <Typography variant="subtitle2" className={classes.idRequest}>
                            {data && data.getCampus.getRequest.id}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item sm={12} xs={12}>
                    <DetailsInfosRequest request={data && data.getCampus.getRequest} />
                </Grid>
                <Grid item sm={12} xs={12} className={classes.tabContent}>
                    <TabRequestVisitorsProgress
                        visitors={data && data.getCampus.getRequest.listVisitors.list}
                        onDelete={async (idVisitor) => {
                            try {
                                // @todo waiting back to delete
                                await deleteVisitor({
                                    variables: {
                                        requestId,
                                        idVisitor
                                    }
                                });
                                refetch();
                            } catch (e) {
                                addAlert({ message: e.message, severity: 'error' });
                            }
                        }}
                    />
                </Grid>
                <Grid item sm={12}>
                    <Grid container justify="flex-end">
                        <div>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => router.back()}>
                                Retour
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

RequestDetails.propTypes = {
    requestId: PropTypes.string.isRequired
};

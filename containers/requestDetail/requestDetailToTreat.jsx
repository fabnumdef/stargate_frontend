import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation, useApolloClient } from '@apollo/client';

import { useRouter } from 'next/router';

// Material Import
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { useSnackBar } from '../../lib/hooks/snackbar';
import {
    DetailsInfosRequest,
    TabRequestVisitorsToTreat,
    TabRequestVisitorsToTreatAcces
} from '../../components';

import { useLogin } from '../../lib/loginContext';

import { ROLES, STATE_REQUEST, WORKFLOW_BEHAVIOR } from '../../utils/constants/enums';
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
    }
}));

export const READ_REQUEST = gql`
    query readRequest(
        $requestId: String!
        $campusId: String!
        $isDone: RequestVisitorIsDone
        $visitorFilters: RequestVisitorFilters
    ) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            getRequest(id: $requestId) {
                id
                reason
                from
                to
                owner {
                    id
                    lastname
                    firstname
                }
                places {
                    label
                }
                listVisitors(isDone: $isDone, filters: $visitorFilters) {
                    list {
                        id
                        rank
                        vip
                        firstname
                        birthLastname
                        employeeType
                        company
                        vip
                        vipReason
                        units {
                            id
                            label
                            steps {
                                role
                                behavior
                                state {
                                    value
                                    isOK
                                    date
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

export const MUTATE_VISITOR = gql`
    mutation validateVisitorStep(
        $requestId: String!
        $campusId: String!
        $visitorId: ObjectID!
        $as: ValidationPersonas!
        $tags: [String]
        $decision: String!
    ) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            mutateRequest(id: $requestId) {
                validateVisitorStep(id: $visitorId, as: $as, decision: $decision, tags: $tags) {
                    id
                }
            }
        }
    }
`;

export default function RequestDetails({ requestId }) {
    const classes = useStyles();
    const router = useRouter();

    const client = useApolloClient();
    const { activeRole } = useLogin();

    const { addAlert } = useSnackBar();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [result, setResult] = useState({});

    const fetchData = async () => {
        if (!loading) {
            setLoading(true);
        }
        try {
            const { data } = await client.query({
                query: READ_REQUEST,
                variables: {
                    requestId,
                    isDone: { role: activeRole.role, value: false },
                    visitorFilters: { status: STATE_REQUEST.STATE_CREATED.state }
                },
                fetchPolicy: 'no-cache'
            });
            if (error) {
                setError(false);
            }
            setResult(data);
            return setLoading(false);
        } catch {
            return setError(true);
        }
    };

    const [validateVisitorStep] = useMutation(MUTATE_VISITOR);

    const [visitors, setVisitors] = useState([]);

    useEffect(() => {
        if (result.getCampus) {
            fetchData();
        }
    }, [activeRole]);

    useEffect(() => {
        if (!result.getCampus && !result.error) {
            fetchData();
        }
    }, [result]);

    const sendChainShiftVisitor = async (sortVisitors, count) => {
        await validateVisitorStep({
            variables: {
                requestId,
                visitorId: sortVisitors[count].id,
                decision: sortVisitors[count].decision,
                tags: sortVisitors[count].vip
                    ? [...sortVisitors[count].tags, 'VIP']
                    : sortVisitors[count].tags,
                as: { role: activeRole.role, unit: activeRole.unit ? activeRole.unit : null }
            }
        }).then(() => {
            if (count < sortVisitors.length - 1) {
                return sendChainShiftVisitor(sortVisitors, count + 1);
            }
            return fetchData();
        });
    };

    const submitForm = async () => {
        const sortVisitors = visitors.filter((visitor) => visitor.validation !== null);
        if (
            activeRole.role === ROLES.ROLE_ACCESS_OFFICE.role ||
            sortVisitors.every(
                (visitor) => visitor.decision === WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.negative
            )
        ) {
            return sendChainShiftVisitor(sortVisitors, 0);
        }
        await Promise.all(
            visitors.map(async (visitor) => {
                if (visitor.validation !== null) {
                    try {
                        await validateVisitorStep({
                            variables: {
                                requestId,
                                visitorId: visitor.id,
                                decision: visitor.decision,
                                tags: visitor.vip ? [...visitor.tags, 'VIP'] : visitor.tags,
                                as: { role: activeRole.role, unit: activeRole.unit }
                            }
                        });
                    } catch (e) {
                        addAlert({
                            message: e.message,
                            severity: 'error'
                        });
                    }
                }
            })
        );
        return fetchData();
    };

    if (error) return <p>page 404</p>;

    return loading ? (
        <Loading />
    ) : (
        <>
            <Grid container spacing={2} className={classes.root}>
                <Grid item sm={12} xs={12}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="h5" className={classes.pageTitle}>
                            {/* @todo change title if treated */}
                            Demandes à traiter :
                        </Typography>
                        <Typography variant="subtitle2" className={classes.idRequest}>
                            {/* @todo change title if treated */}
                            {result.getCampus && result.getCampus.getRequest.id}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item sm={12} xs={12}>
                    <DetailsInfosRequest
                        request={result.getCampus && result.getCampus.getRequest}
                    />
                </Grid>
                <Grid item sm={12} xs={12}>
                    {(() => {
                        switch (activeRole.role) {
                            case ROLES.ROLE_ACCESS_OFFICE.role:
                                return (
                                    <TabRequestVisitorsToTreatAcces
                                        visitors={
                                            result.getCampus &&
                                            result.getCampus.getRequest.listVisitors.list
                                        }
                                        onChange={(entries) => {
                                            setVisitors(entries);
                                        }}
                                    />
                                );
                            default:
                                return (
                                    <TabRequestVisitorsToTreat
                                        visitors={
                                            result.getCampus &&
                                            result.getCampus.getRequest.listVisitors.list
                                        }
                                        onChange={(entries) => {
                                            setVisitors(entries);
                                        }}
                                    />
                                );
                        }
                    })()}
                </Grid>
                <Grid item sm={12}>
                    <Grid container justify="flex-end">
                        <div>
                            <Button
                                variant="outlined"
                                color="primary"
                                style={{ marginRight: '5px' }}
                                onClick={() => router.back()}>
                                Annuler
                            </Button>
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={submitForm}
                                disabled={!visitors.find((visitor) => visitor.validation !== null)}>
                                Envoyer
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

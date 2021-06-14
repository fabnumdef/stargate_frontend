import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
// Material Import
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import SearchField from '../components/styled/common/SearchField';
import ListItemVisitors from '../components/lists/listItem/requestVisitor';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    pageTitle: {
        margin: '16px 0',
        color: '#0d40a0',
        fontWeight: 'bold'
    },
    searchField: {
        display: 'flex',
        justifyContent: 'center'
    },
    list: {
        padding: 20,
        backgroundColor: theme.palette.background.layout
    }
}));

export const LIST_VISITOR_REQUESTS = gql`
    query ListVisitorsRequestQuery($campusId: String!, $search: String, $cursor: OffsetCursor!) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            listVisitors(search: $search, cursor: $cursor) {
                list {
                    id
                    firstname
                    nationality
                    birthday
                    birthplace
                    birthLastname
                    usageLastname
                    company
                    identityDocuments {
                        kind
                        reference
                        file {
                            id
                        }
                    }
                    generateIdentityFileExportLink {
                        link
                    }
                    units {
                        id
                        label
                        steps {
                            role
                            state {
                                isOK
                                value
                                tags
                            }
                        }
                    }
                    request {
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
                    }
                }
                meta {
                    total
                }
            }
        }
    }
`;

export default function GatekeeperManagement() {
    const classes = useStyles();
    // filters

    const [search, setSearch] = useState(null);
    const { data, loading, refetch } = useQuery(LIST_VISITOR_REQUESTS, {
        variables: {
            cursor: { first: 30, offset: 0 }
        }
    });

    return (
        <>
            <Grid container spacing={2} className={classes.root}>
                <Grid item sm={12} xs={12}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="h5" className={classes.pageTitle}>
                            Demandes de contrôle
                        </Typography>
                    </Box>
                </Grid>
                <Grid item sm={12} xs={12} className={classes.searchField}>
                    <SearchField
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            refetch({
                                cursor: {
                                    first: 30,
                                    offset: 0
                                },
                                search: event.target.value.trim().toLowerCase()
                            });
                        }}>
                        Rechercher...
                    </SearchField>
                </Grid>

                <Grid item sm={12}>
                    <List className={classes.list}>
                        {!loading &&
                            data &&
                            data.getCampus.listVisitors.list.map((visitorRequest) => (
                                <ListItemVisitors
                                    key={visitorRequest.id}
                                    requestVisitor={visitorRequest}
                                />
                            ))}
                    </List>
                </Grid>
            </Grid>
        </>
    );
}

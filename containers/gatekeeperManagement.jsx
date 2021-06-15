import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { fade, makeStyles } from '@material-ui/core/styles';
// Material Import
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import ListItemVisitors from '../components/lists/listItem/requestVisitor';
import PageTitle from '../components/styled/common/pageTitle';

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
        borderRadius: '25px',
        paddingLeft: '20px !important',
        backgroundColor: fade(theme.palette.common.black, 0.05),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.1)
        },
        marginBottom: 40
    },
    list: {
        padding: '20px 20px 1px 20px',
        backgroundColor: theme.palette.background.layout
    },
    resultTotal: {
        fontWeight: 'bold',
        fontSize: '1.35rem',
        marginLeft: 8
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
    const [list, setList] = useState(null);
    const { refetch } = useQuery(LIST_VISITOR_REQUESTS, {
        variables: {
            cursor: { first: 30, offset: 0 }
        },
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
            setList(data.getCampus.listVisitors.list);
        }
    });

    return (
        <Grid container spacing={2} className={classes.root}>
            <PageTitle>Recherche</PageTitle>
            <Grid item sm={12} xs={12} className={classes.searchField}>
                <InputBase
                    value={search}
                    variant="outlined"
                    fullWidth
                    placeholder="Nom ou prénom du visiteur"
                    endAdornment={<SearchIcon />}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        refetch({
                            cursor: {
                                first: 50,
                                offset: 0
                            },
                            search: event.target.value.trim().toLowerCase()
                        });
                    }}
                />
            </Grid>
            {list && (
                <Typography color="primary" className={classes.resultTotal}>
                    {list.length} résultats trouvés
                </Typography>
            )}
            <Grid item sm={12}>
                <List className={classes.list}>
                    {list &&
                        list.map((visitorRequest) => (
                            <ListItemVisitors
                                key={visitorRequest.id}
                                requestVisitor={visitorRequest}
                            />
                        ))}
                </List>
            </Grid>
        </Grid>
    );
}

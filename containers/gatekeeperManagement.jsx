import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
// Material Import
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import ListItemVisitors from '../components/lists/listItem/requestVisitor';

const useStyles = makeStyles(() => ({
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
    }
}));

export const LIST_VISITOR_REQUESTS = gql`
    query ListVisitorsRequestQuery($campusId: String!, $search: String, $cursor: OffsetCursor!) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            listVisitors(search: $search, cursor: $cursor) {
                list {
                    id
                    firstname
                    nationality
                    birthday
                    birthplace
                    birthLastname
                    usageLastname
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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(1);
    const [list, setList] = useState(null);

    const [search, setSearch] = useState(null);
    const { data, fetchMore } = useQuery(LIST_VISITOR_REQUESTS, {
        variables: {
            cursor: { first: rowsPerPage, offset: 0 },
            search
        },
        fetchPolicy: 'cache-and-network',
        onCompleted: (d) => (list ? null : setList(d))
    });

    const handleFetchMore = (selectedPage) => {
        fetchMore({
            variables: {
                cursor: { first: rowsPerPage, offset: selectedPage * rowsPerPage }
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                setList(fetchMoreResult);
                return fetchMoreResult;
            }
        });
    };

    const handlePageSize = () => {
        if (!data) return 0;
        return data.getCampus.listVisitors.meta.total;
    };

    const handleChangePage = async (event, newPage) => {
        setPage(newPage);
        handleFetchMore(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
                    <TextField
                        style={{ float: 'right', width: '300px' }}
                        margin="dense"
                        variant="outlined"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Rechercher..."
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            inputProps: { 'data-testid': 'searchField' }
                        }}
                    />
                </Grid>

                <Grid item sm={12}>
                    <List>
                        {list &&
                            list.getCampus.listVisitors.list.map((visitorRequest) => (
                                <ListItemVisitors
                                    key={visitorRequest.id}
                                    requestVisitor={visitorRequest}
                                />
                            ))}
                    </List>
                </Grid>
                <Grid item sm={12}>
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 30, 40, 50]}
                        component="div"
                        count={handlePageSize()}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        </>
    );
}

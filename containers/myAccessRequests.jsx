import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import { makeStyles } from '@material-ui/core/styles';
import SelectedBadge from '../components/styled/common/TabBadge';
import Tabs from '@material-ui/core/Tabs';
import AntTab from '../components/styled/common/Tab';

import TabPanel from '../components/styled/tabpanel';
import TableMyRequests from '../components/tables/TableMyRequests';

import PageTitle from '../components/styled/common/pageTitle';
import EmptyArray from '../components/styled/common/emptyArray';

import { STATE_REQUEST } from '../utils/constants/enums';
import useRequest from '../lib/hooks/useRequest';
import { LIST_MY_REQUESTS } from '../lib/apollo/queries';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%'
    },
    tabs: {
        marginBottom: '20px'
    },
    tab: {
        '& .MuiBox-root': {
            padding: 'Opx'
        }
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    buttonNew: {
        marginLeft: 20
    }
}));

const filtersP = { status: STATE_REQUEST.STATE_CREATED.state };
const filtersT = {
    status: [
        STATE_REQUEST.STATE_CANCELED.state,
        STATE_REQUEST.STATE_ACCEPTED.state,
        STATE_REQUEST.STATE_MIXED.state,
        STATE_REQUEST.STATE_REJECTED.state
    ]
};

const tabList = [
    {
        index: 0,
        value: 'progress',
        label: `En cours`
    },
    {
        index: 1,
        value: 'treated',
        label: 'Finalisées'
    }
];

const FIRST_INIT = 50;

export default function MyRequestAccess() {
    const classes = useStyles();

    const [first, setFirst] = useState(FIRST_INIT);

    const { data, loading, fetchMore } = useQuery(LIST_MY_REQUESTS, {
        variables: {
            filtersP,
            filtersT,
            cursor: {
                first,
                offset: 0
            }
        }
    });

    const { deleteRequest } = useRequest();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        if (first !== FIRST_INIT) {
            fetchMore({
                variables: {
                    filtersP,
                    filtersT,
                    cursor: {
                        first: FIRST_INIT,
                        offset: 0
                    }
                }
            });
            setFirst(FIRST_INIT);
        }
        setValue(newValue);
    };

    const load = React.useMemo(() => {
        return first < data?.getCampus[tabList[value].value]?.meta?.total;
    }, [data, value]);

    const handleFetchMore = async () => {
        await fetchMore({
            variables: {
                filtersP,
                filtersT,
                cursor: {
                    first: first + 10,
                    offset: 0
                }
            }
        });
        setFirst(first + 10);
    };

    const handleDelete = (id) => {
        deleteRequest(id);
    };

    if (loading || !data) {
        return '';
    }

    return (
        <div className={classes.paper}>
            <PageTitle>Mes demandes</PageTitle>
            {/** Tabulator  */}
            <Tabs
                indicatorColor="primary"
                value={value}
                onChange={handleChange}
                className={classes.tabs}
                variant="scrollable"
                scrollButtons="off"
                aria-label="tabs my requests">
                {tabList.map((tab) => (
                    <AntTab
                        label={
                            <>
                                {tab.label}{' '}
                                <SelectedBadge select={value === tab.index}>
                                    {data.getCampus[tab.value].meta.total}
                                </SelectedBadge>
                            </>
                        }
                        value={tab.index}
                        id={tab.index}
                        aria-controls={tab.index}
                        key={tab.label}
                    />
                ))}
            </Tabs>

            <TabPanel value={value} index={0} classes={{ root: classes.tab }}>
                {data.getCampus.progress.meta.total > 0 ? (
                    <TableMyRequests
                        request={data.getCampus.progress.list}
                        onDelete={handleDelete}
                        onLoadMore={handleFetchMore}
                        load={load}
                    />
                ) : (
                    <EmptyArray type="en cours" />
                )}
            </TabPanel>

            <TabPanel value={value} index={1} classes={{ root: classes.tab }}>
                {data.getCampus.treated.meta.total > 0 ? (
                    <TableMyRequests
                        request={data.getCampus.treated.list}
                        onDelete={handleDelete}
                        onLoadMore={handleFetchMore}
                        load={load}
                    />
                ) : (
                    <EmptyArray type="terminée" />
                )}
            </TabPanel>
        </div>
    );
}

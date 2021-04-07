import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
// Material Import
import { makeStyles } from '@material-ui/core/styles';
import SelectedBadge from '../components/styled/common/TabBadge';
import Tabs from '@material-ui/core/Tabs';
import AntTab from '../components/styled/common/Tab';

import TabPanel from '../components/styled/tabpanel';
import TableMyRequests from '../components/tables/TableMyRequests';

import PageTitle from '../components/styled/common/pageTitle';

import { STATE_REQUEST } from '../utils/constants/enums';
import useRequest from '../lib/hooks/useRequest';
import { LIST_MY_REQUESTS } from '../lib/apollo/queries';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    tabs: {
        marginBottom: '30px'
    },
    tab: {
        '& .MuiBox-root': {
            padding: 'Opx'
        }
    },
    paper: {
        padding: theme.spacing(9, 12),
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

export default function MyRequestAcces() {
    const classes = useStyles();

    const { data, loading } = useQuery(LIST_MY_REQUESTS, {
        variables: {
            filtersP: { status: STATE_REQUEST.STATE_CREATED.state },
            filtersT: {
                status: [
                    STATE_REQUEST.STATE_CANCELED.state,
                    STATE_REQUEST.STATE_ACCEPTED.state,
                    STATE_REQUEST.STATE_MIXED.state,
                    STATE_REQUEST.STATE_REJECTED.state
                ]
            },
            cursor: {
                first: 30,
                offset: 0
            }
        }
    });

    const { deleteRequest } = useRequest();

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

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleDelete = (id) => {
        deleteRequest(id);
    };

    if (loading) {
        return '';
    }

    return (
        <div className={classes.paper}>
            <div className={classes.title}>
                <PageTitle>Mes demandes</PageTitle>
            </div>
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
                <TableMyRequests
                    request={data.getCampus.progress.list}
                    emptyLabel="en cours"
                    onDelete={handleDelete}
                />
            </TabPanel>

            <TabPanel value={value} index={1} classes={{ root: classes.tab }}>
                {/* @todo to replace by treated */}
                <TableMyRequests
                    request={data.getCampus.treated.list}
                    emptyLabel="terminée"
                    onDelete={handleDelete}
                />
            </TabPanel>
        </div>
    );
}

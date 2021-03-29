import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
// Material Import
import { makeStyles } from '@material-ui/core/styles';
import SelectedBadge from '../components/styled/common/TabBadge';
import Tabs from '@material-ui/core/Tabs';
import AntTab from '../components/styled/common/Tab';

import { TabPanel, TabMesDemandesToTreat, TabDemandesProgress } from '../components';
import PageTitle from '../components/styled/common/pageTitle';
import RoundButton from '../components/styled/common/roundButton';

import { STATE_REQUEST } from '../utils/constants/enums';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
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

export const LIST_MY_REQUESTS = gql`
    query listMyRequests(
        $campusId: String!
        $cursor: OffsetCursor!
        $filtersP: RequestFilters!
        $filtersT: RequestFilters!
    ) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            progress: listMyRequests(filters: $filtersP, cursor: $cursor) {
                list {
                    id
                    from
                    to
                    reason
                    status
                    places {
                        id
                        label
                    }
                    owner {
                        firstname
                        lastname
                        unit {
                            label
                        }
                    }
                }
                meta {
                    total
                }
            }
            treated: listMyRequests(filters: $filtersT, cursor: $cursor) {
                list {
                    id
                    from
                    to
                    reason
                    status
                    places {
                        id
                        label
                    }
                    owner {
                        firstname
                        lastname
                        unit {
                            label
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

export default function MyRequestAcces() {
    const classes = useStyles();
    const [value, setValue] = useState(0);

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (loading) {
        return '';
    }

    return (
        <div className={classes.paper}>
            <div className={classes.title}>
                <PageTitle>Mes demandes</PageTitle>
                <RoundButton
                    size="large"
                    color="primary"
                    variant="outlined"
                    className={classes.buttonNew}>
                    Créer une nouvelle demande
                </RoundButton>
            </div>
            {/** Tabulator  */}
            <Tabs
                indicatorColor="primary"
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="off"
                aria-label="simple tabs example">
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
                <TabDemandesProgress request={data.getCampus.progress.list} emptyLabel="en cours" />
            </TabPanel>

            <TabPanel value={value} index={1} classes={{ root: classes.tab }}>
                <TabMesDemandesToTreat
                    requests={data.getCampus.treated.list}
                    detailLink="traitees"
                    emptyLabel="finalisée"
                />
            </TabPanel>
        </div>
    );
}

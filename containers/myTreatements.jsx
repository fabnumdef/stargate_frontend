import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
// Material Import
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PageTitle from '../components/styled/common/pageTitle';

import Tabs from '@material-ui/core/Tabs';
import AntTab from '../components/styled/common/Tab';
import TabPanel from '../components/styled/tabpanel';

import SelectedBadge from '../components/styled/common/TabBadge';
import TableTreatmentsToTreat from '../components/tables/TableTreatmentsToTreat';

import { useRouter } from 'next/router';
import { LIST_TREATMENTS } from '../lib/apollo/queries';
import { useDecisions, withDecisionsProvider } from '../lib/hooks/useDecisions';
import useVisitors from '../lib/hooks/useVisitors';
import RoundButton from '../components/styled/common/roundButton';
import LoadingCircle from '../components/styled/animations/loadingCircle';
import EmptyArray from '../components/styled/common/emptyArray';
import AlertMessage from '../components/styled/common/sticker';
import { activeRoleCacheVar } from '../lib/apollo/cache';
import { ROLES } from '../utils/constants/enums/index';
import { STATE_REQUEST } from '../utils/constants/enums';
import ButtonsFooterContainer from '../components/styled/common/ButtonsFooterContainer';

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
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '250px',
        right: '6vw',
        position: 'absolute'
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline'
    }
}));

// export const LIST_MY_VISITORS = gql`
//     query listMyVisitors(
//         $campusId: String!
//         $isDone: RequestVisitorIsDone!
//         $requestsId: [String]
//     ) {
//         campusId @client @export(as: "campusId")
//         getCampus(id: $campusId) {
//             id
//             listVisitors(isDone: $isDone, requestsId: $requestsId) {
//                 generateCSVExportLink {
//                     token
//                     link
//                 }
//             }
//         }
//     }
// `;

const tabList = [
    {
        index: 0,
        value: 'progress',
        label: `À traiter`
    },
    {
        index: 1,
        value: 'treated',
        label: `Traitées`
    }
];

const STATUS = [
    { shortLabel: 'VA', label: 'Visiteur Accompagné' },
    { shortLabel: 'VL', label: 'Visiteur Libre' },
    { shortLabel: 'VIP', label: 'Autorité' }
];

function MyTreatements() {
    const classes = useStyles();
    const router = useRouter();

    const { decisions, addDecision, resetDecision, submitDecisionNumber } = useDecisions();
    const { shiftVisitors } = useVisitors();

    React.useEffect(() => {
        router.replace(router.pathname, '/mes-traitements', { shallow: true });
    }, []);

    /** tab engine */
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { data, loading } = useQuery(LIST_TREATMENTS, {
        filtersP: { status: STATE_REQUEST.STATE_CREATED.state },
        variables: {
            cursor: {
                first: 10,
                offset: 0
            }
        },
        onCompleted: (d) =>
            d.getCampus.progress.list.forEach((visitor) =>
                addDecision({
                    id: visitor.id,
                    request: { id: visitor.request.id },
                    choice: {
                        label: '',
                        validation: '',
                        tags: []
                    }
                })
            )
    });

    const handleSubmit = () => {
        const visitors = Object.values(decisions).filter(
            (visitor) => visitor.choice.validation !== ''
        );
        shiftVisitors(visitors);
        resetDecision();
    };

    // get link of export csv if BA role
    // const [exportCsv] = useLazyQuery(LIST_MY_VISITORS, {
    //     onCompleted: React.useCallback((d) => {
    //         const link = document.createElement('a');
    //         link.href = d.getCampus.listVisitors.generateCSVExportLink.link;
    //         link.setAttribute('download', `export-${new Date()}.csv`);
    //         document.body.appendChild(link);
    //         link.click();
    //         link.parentNode.removeChild(link);
    //     }),
    //     onError: React.useCallback((e) => {
    //         addAlert({
    //             message: e.message,
    //             severity: 'error'
    //         });
    //     }, [])
    // });

    if (loading) return <LoadingCircle />;

    return (
        <div className={classes.paper}>
            <div className={classes.title}>
                <PageTitle>Mes traitements</PageTitle>
            </div>
            {activeRoleCacheVar().role === ROLES.ROLE_SECURITY_OFFICER.role && (
                <div className={classes.header}>
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
            )}
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
                    <>
                        <TableTreatmentsToTreat
                            requests={data.getCampus.progress?.list}
                            treated={false}
                        />
                        <ButtonsFooterContainer>
                            <RoundButton
                                variant="outlined"
                                color="primary"
                                type="reset"
                                onClick={resetDecision}>
                                Annuler
                            </RoundButton>
                            <RoundButton
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={submitDecisionNumber === 0}>
                                {`Soumettre (${submitDecisionNumber})`}
                            </RoundButton>
                        </ButtonsFooterContainer>
                    </>
                ) : (
                    <EmptyArray type={'à traiter'} />
                )}
            </TabPanel>

            <TabPanel value={value} index={1} classes={{ root: classes.tab }}>
                {data.getCampus.treated.meta.total > 0 ? (
                    <TableTreatmentsToTreat
                        requests={data.getCampus.treated?.list}
                        treated={true}
                    />
                ) : (
                    <EmptyArray type={'finalisé'} />
                )}
            </TabPanel>
        </div>
    );
}

export default withDecisionsProvider(MyTreatements);

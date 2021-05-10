import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
// Material Import
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PageTitle from '../components/styled/common/pageTitle';

import Tabs from '@material-ui/core/Tabs';
import AntTab from '../components/styled/common/Tab';
import TabPanel from '../components/styled/tabpanel';

import SelectedBadge from '../components/styled/common/TabBadge';
import TableTreatmentsToTreat from '../components/tables/TableTreatments';

import { useRouter } from 'next/router';
import { LIST_TREATMENTS, LIST_EXPORTS } from '../lib/apollo/queries';
import { useDecisions, withDecisionsProvider } from '../lib/hooks/useDecisions';
import { useExport, withExportProvider } from '../lib/hooks/useExportBA';
import useVisitors from '../lib/hooks/useVisitors';
import RoundButton from '../components/styled/common/roundButton';
import LoadingCircle from '../components/styled/animations/loadingCircle';
import EmptyArray from '../components/styled/common/emptyArray';
import AlertMessage from '../components/styled/common/sticker';
import { activeRoleCacheVar } from '../lib/apollo/cache';
import { ROLES, WORKFLOW_BEHAVIOR } from '../utils/constants/enums/index';
import ButtonsFooterContainer from '../components/styled/common/ButtonsFooterContainer';
import { getMyDecision } from '../utils/mappers/getDecisions';

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

function getTabList() {
    if (activeRoleCacheVar().role === ROLES.ROLE_ACCESS_OFFICE.role)
        return [
            {
                index: 0,
                value: 'progress',
                label: `À traiter`
            },
            {
                index: 1,
                value: 'export',
                label: `À exporter`
            },
            {
                index: 2,
                value: 'treated',
                label: `Traitées`
            }
        ];
    return [
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
}

const STATUS = [
    { shortLabel: 'VA', label: 'Visiteur Accompagné' },
    { shortLabel: 'VL', label: 'Visiteur Libre' },
    { shortLabel: 'VIP', label: 'Autorité' }
];

function MyTreatments() {
    const classes = useStyles();
    const router = useRouter();

    const { decisions, addDecision, resetDecision, submitDecisionNumber } = useDecisions();
    const { visitors, exportVisitors, visitorsNumber } = useExport();
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

    const { data: exportData, loading: exportLoading } = useQuery(LIST_EXPORTS, {
        variables: {
            cursor: {
                first: 10,
                offset: 0
            },
            filters: { exportDate: null }
        },
        skip: activeRoleCacheVar().role !== ROLES.ROLE_ACCESS_OFFICE.role
    });

    const exportDataFilters = useMemo(() => {
        if (!exportData) return [];

        return exportData.getCampus.export.list.filter(
            (v) =>
                getMyDecision(v.units).value.value ===
                WORKFLOW_BEHAVIOR.VALIDATION.RESPONSE.positive
        );
    }, [exportData]);

    /** Ba's controllers */
    const treatedArrayBA = useMemo(() => {
        if (activeRoleCacheVar().role !== ROLES.ROLE_ACCESS_OFFICE.role) return;

        let treated = [];

        if (!data) return treated;

        treated = data.getCampus.treated.list.filter(
            (visitor) => !isNaN(Date.parse(visitor.exportDate))
        );

        return treated;
    }, [data]);

    const handleSubmit = () => {
        const visitors = Object.values(decisions).filter(
            (visitor) => visitor.choice.validation !== ''
        );
        shiftVisitors(visitors);
        resetDecision();
    };

    const handleExportMany = () => {
        exportVisitors(exportData.getCampus.export.list.map((visitor) => visitor.id));
    };

    const handleExportSelected = () => {
        exportVisitors(visitors);
    };

    if (loading || exportLoading || !data) return <LoadingCircle />;

    return (
        <div className={classes.paper}>
            <PageTitle>Mes traitements</PageTitle>
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
                {getTabList().map((tab) => (
                    <AntTab
                        label={
                            <>
                                {tab.label}{' '}
                                <SelectedBadge select={value === tab.index}>
                                    {(() => {
                                        if (tab.value === 'export') return exportDataFilters.length;

                                        if (
                                            tab.value === 'treated' &&
                                            activeRoleCacheVar().role ===
                                                ROLES.ROLE_ACCESS_OFFICE.role
                                        )
                                            return treatedArrayBA.length;
                                        return data.getCampus[tab.value].meta.total;
                                    })()}
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
                        <TableTreatmentsToTreat requests={data.getCampus.progress?.list} />
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
                {(() => {
                    if (activeRoleCacheVar().role === ROLES.ROLE_ACCESS_OFFICE.role)
                        return (
                            <>
                                {exportData?.getCampus?.export?.meta?.total > 0 ? (
                                    <>
                                        <TableTreatmentsToTreat
                                            requests={exportDataFilters}
                                            treated
                                        />
                                        <ButtonsFooterContainer>
                                            <RoundButton
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                onClick={handleExportMany}>
                                                {`Exporter (${exportDataFilters.length})`}
                                            </RoundButton>
                                        </ButtonsFooterContainer>
                                    </>
                                ) : (
                                    <EmptyArray type={'à exporter'} />
                                )}
                            </>
                        );
                    return (
                        <>
                            {data.getCampus.treated.meta.total > 0 ? (
                                <TableTreatmentsToTreat
                                    requests={data.getCampus.treated?.list}
                                    treated
                                />
                            ) : (
                                <EmptyArray type={'finalisé'} />
                            )}
                        </>
                    );
                })()}
            </TabPanel>

            {!!getTabList()[2] && (
                <TabPanel value={value} index={2} classes={{ root: classes.tab }}>
                    {treatedArrayBA.length > 0 ? (
                        <>
                            <TableTreatmentsToTreat requests={treatedArrayBA} treated exported />
                            <ButtonsFooterContainer>
                                <RoundButton
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={visitorsNumber === 0}
                                    onClick={handleExportSelected}>
                                    {`Ré Exporter (${visitorsNumber})`}
                                </RoundButton>
                            </ButtonsFooterContainer>
                        </>
                    ) : (
                        <EmptyArray type={'finalisé'} />
                    )}
                </TabPanel>
            )}
        </div>
    );
}

export default withDecisionsProvider(withExportProvider(MyTreatments));

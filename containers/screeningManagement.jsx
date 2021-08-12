import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client';

// Material Import
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';

import SelectedBadge from '../components/styled/common/TabBadge';

import { CSVLink } from 'react-csv';
import { TabPanel } from '../components';

import TableScreening from '../components/tables/TableScreening';
import AntTab from '../components/styled/common/Tab';
import { LIST_TREATMENTS_SCREENING } from '../lib/apollo/queries';
import EmptyArray from '../components/styled/common/emptyArray';
import RoundButton from '../components/styled/common/roundButton';
import PageTitle from '../components/styled/common/pageTitle';
import { useDecisions, withDecisionsProvider } from '../lib/hooks/useDecisions';
import SearchField from '../components/styled/common/SearchField';
import useVisitors from '../lib/hooks/useVisitors';
import { campusIdVar } from '../lib/apollo/cache';

import ButtonsFooterContainer from '../components/styled/common/ButtonsFooterContainer';

const CSV_REGEX = /[êëîïç\- ]/gi;
const convertCSVDate = (date) => {
    const dateToConvert = new Date(date);
    const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
    };
    return dateToConvert.toLocaleString('fr-FR', options);
};

function csvName() {
    const date = Date.now();
    return `criblage du ${convertCSVDate(date)}.csv`;
}

const formatCsvData = (value) => {
    switch (value) {
        case 'ê':
        case 'ë':
            return 'e';
        case 'î':
        case 'ï':
            return 'i';
        case 'ç':
            return 'c';
        default:
            return '';
    }
};

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

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        '& section': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '20px'
        },
        '& a': {
            textDecoration: 'none'
        }
    },
    tabs: {
        marginBottom: '20px'
    },
    tab: {
        '& .MuiBox-root': {
            padding: 'Opx'
        }
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
    },
    divLoadMore: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 10
    }
}));

const UP_FIRST = 10;
const MAX_FIRST = 50;

const mapRequestsToTreat = (requestsToTreat) => requestsToTreat?.getCampus?.progress?.list ?? [];
const mapRequestsTreated = (requestsTreated) => requestsTreated?.getCampus?.treated?.list ?? [];

function ScreeningManagement() {
    const classes = useStyles();

    const { decisions, addDecision, resetDecision, submitDecisionNumber } = useDecisions();
    const { shiftVisitors } = useVisitors();
    // submit values
    const [value, setValue] = useState(0);
    const [first, setFirst] = useState(10);
    /** loading management */
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [search, setSearch] = useState('');

    const { data, fetchMore, refetch } = useQuery(LIST_TREATMENTS_SCREENING, {
        variables: {
            cursor: {
                first,
                offset: 0
            },
            search
        }
    });
    // check if buttons fetchmore have to be displayed
    const hasMoreToTreat = () =>
        mapRequestsToTreat(data).length < data.getCampus.progress.meta.total &&
        mapRequestsToTreat(data).length < MAX_FIRST;
    const hasMoreTreated = () =>
        mapRequestsTreated(data).length < data.getCampus.treated.meta.total &&
        mapRequestsTreated(data).length < MAX_FIRST;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const csvData = useMemo(() => {
        const csv = [['Nom de N.', 'Prénom', 'Date de N.', 'Lieu de N.', 'Nationalité']];
        if (!data) return csv;
        data.getCampus.progress.list.map((visitor) =>
            csv.push([
                visitor.birthLastname.replace(CSV_REGEX, formatCsvData).trim().toUpperCase(),
                visitor.firstname.replace(CSV_REGEX, formatCsvData).trim().toUpperCase(),
                convertCSVDate(visitor.birthday.trim()),
                visitor.birthplace.replace(CSV_REGEX, formatCsvData).trim().toUpperCase(),
                visitor.nationality.replace(CSV_REGEX, formatCsvData).trim().toUpperCase()
            ])
        );
        return csv;
    }, [data]);

    const handleSelectAll = useCallback(
        (choice) =>
            data.getCampus.progress.list.forEach((visitor) =>
                addDecision({
                    id: visitor.id,
                    request: { id: visitor.request.id },
                    choice
                })
            ),
        [data]
    );

    const handleFetchMore = async () => {
        setIsLoadingMore(true);
        await fetchMore({
            variables: {
                cursor: {
                    first: first + UP_FIRST,
                    offset: 0
                },
                campusId: campusIdVar()
            }
        });
        setFirst(first + UP_FIRST);
        setIsLoadingMore(false);
    };

    const handleSubmit = () => {
        const visitors = Object.values(decisions).filter(
            (visitor) => visitor.choice.validation !== ''
        );
        shiftVisitors(visitors);
        resetDecision();
        refetch();
    };

    if (!data) return '';

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <PageTitle>Demandes de contrôle</PageTitle>
            </div>
            {/** Tabulator  */}
            <Tabs
                indicatorColor="primary"
                value={value}
                onChange={handleChange}
                className={classes.tabs}
                variant="scrollable"
                scrollButtons="off"
                aria-label="tabs screening">
                {tabList.map((tab) => (
                    <AntTab
                        label={
                            <>
                                {tab.label}{' '}
                                <SelectedBadge select={value === tab.index}>
                                    {data.getCampus[tab.value].meta.total || 0}
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
                {data?.getCampus?.progress?.meta?.total ? (
                    <>
                        <section>
                            <CSVLink data={csvData} separator=";" filename={csvName()}>
                                <RoundButton
                                    variant="outlined"
                                    color="secondary"
                                    disabled={data?.getCampus?.progress?.meta?.total <= 0}>
                                    Export CSV
                                </RoundButton>
                            </CSVLink>
                            <SearchField value={search} onChange={handleSearchChange}>
                                Rechercher...
                            </SearchField>
                        </section>
                        <TableScreening
                            requests={mapRequestsToTreat(data)}
                            selectAll={handleSelectAll}
                        />
                        <div className={classes.divLoadMore}>
                            {hasMoreToTreat() &&
                                (isLoadingMore ? (
                                    'Chargement...'
                                ) : (
                                    <RoundButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleFetchMore()}>
                                        Voir plus de visiteurs
                                    </RoundButton>
                                ))}
                        </div>
                        <ButtonsFooterContainer>
                            <RoundButton
                                variant="outlined"
                                color="secondary"
                                type="reset"
                                onClick={resetDecision}>
                                Annuler
                            </RoundButton>
                            <RoundButton
                                variant="contained"
                                color="secondary"
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
            <TabPanel value={value} index={1}>
                {data?.getCampus?.treated?.meta?.total ? (
                    <>
                        <section>
                            <CSVLink data={csvData} separator=";" filename={csvName()} />
                            <SearchField value={search} onChange={handleSearchChange}>
                                Rechercher...
                            </SearchField>
                        </section>
                        <TableScreening
                            treated
                            requests={mapRequestsTreated(data)}
                            selectAll={() => {}}
                        />
                        <div className={classes.divLoadMore}>
                            {hasMoreTreated() &&
                                (isLoadingMore ? (
                                    'Chargement...'
                                ) : (
                                    <RoundButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleFetchMore()}>
                                        Voir plus de visiteurs
                                    </RoundButton>
                                ))}
                        </div>
                    </>
                ) : (
                    <EmptyArray type={'à traiter'} />
                )}
            </TabPanel>
        </div>
    );
}

export default withDecisionsProvider(ScreeningManagement);

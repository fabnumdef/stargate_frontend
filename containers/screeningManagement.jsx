import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';

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
    }
}));

function ScreeningManagement() {
    const classes = useStyles();

    const { decisions, addDecision, resetDecision, submitDecisionNumber } = useDecisions();
    const { shiftVisitors } = useVisitors();
    // submit values
    const [value, setValue] = useState(0);
    const [search, setSearch] = React.useState('');

    const [fetchData, { data, networkStatus }] = useLazyQuery(LIST_TREATMENTS_SCREENING, {
        notifyOnNetworkStatusChange: true
    });

    useEffect(() => {
        fetchData({
            variables: {
                cursor: {
                    first: 30,
                    offset: 0
                }
            }
        });
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSearchChange = (event) => {
        event.preventDefault();
        fetchData({
            variables: {
                cursor: {
                    first: 30,
                    offset: 0
                },
                search: event.target.value !== '' ? event.target.value : ''
            }
        });
        setSearch(event.target.value);
    };

    const csvData = useMemo(() => {
        if (!data) return [];
        return data.getCampus.progress.list.map((visitor) => [
            visitor.birthLastname.replace(CSV_REGEX, formatCsvData).trim().toUpperCase(),
            visitor.firstname.replace(CSV_REGEX, formatCsvData).trim().toUpperCase(),
            convertCSVDate(visitor.birthday.trim())
        ]);
    }, [data]);

    useEffect(() => {
        if (!data) return;
        data.getCampus.progress.list.forEach((visitor) =>
            addDecision({
                id: visitor.id,
                request: { id: visitor.request.id },
                choice: {
                    label: '',
                    validation: '',
                    tags: []
                }
            })
        );

        console.log(data);
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

    const handleSubmit = () => {
        const visitors = Object.values(decisions).filter(
            (visitor) => visitor.choice.validation !== ''
        );
        shiftVisitors(visitors);
        resetDecision();
    };

    if (!data || networkStatus === 1) return '';

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
                                    color="primary"
                                    disabled={data?.getCampus?.progress?.meta?.total <= 0}>
                                    Export CSV
                                </RoundButton>
                            </CSVLink>
                            <SearchField value={search} onChange={handleSearchChange}>
                                Rechercher...
                            </SearchField>
                        </section>
                        <TableScreening
                            requests={data.getCampus.progress.list}
                            selectAll={handleSelectAll}
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
                            requests={data.getCampus.treated.list}
                            selectAll={() => {}}
                        />
                    </>
                ) : (
                    <EmptyArray type={'à traiter'} />
                )}
            </TabPanel>
        </div>
    );
}

export default withDecisionsProvider(ScreeningManagement);

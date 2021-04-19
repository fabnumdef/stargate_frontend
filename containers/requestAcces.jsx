import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import NoSsr from '../lib/nossr';

import {
    FormInfosRequest,
    FormInfosVisitor,
    FormInfosRecapDemande,
    FormInfosImport
} from '../components';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%'
    },
    tab: {
        '& .MuiBox-root': {
            padding: 'Opx'
        }
    },
    stepperTitles: {
        marginRight: '20px',
        pointerEvents: 'none'
    },
    pageTitle: {
        margin: '16px 0',
        fontWeight: 'bold'
    },
    pageTitleControl: {
        marginLeft: 'auto'
    },
    instruction: {
        marginBottom: '1%',
        fontStyle: 'italic',
        fontWeight: 'bold',
        marginLeft: '2%'
    }
}));

function TabPanel({ children, value, index }) {
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}>
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node.isRequired,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
};

function getSteps() {
    return ['Demande', 'Visiteur', 'Recapitulatif'];
}

export default function RequestAccesForm({ group }) {
    const classes = useStyles();

    // Stepper's functions
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // functionality to update a Visitor.
    const [selectVisitor, setSelectVisitor] = useState(null);

    // FormState
    const [formData, setForm] = useState({
        visitors: []
    });

    return (
        <>
            <Grid container spacing={2} className={classes.root}>
                <Grid item sm={12} xs={12}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="h4" className={classes.pageTitle}>
                            {group
                                ? "Nouvelle demande d'accès temporaire de groupe"
                                : "Nouvelle demande d'accès temporaire"}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item sm={12} xs={12}>
                    {steps.map((label, index) => (
                        <Button
                            className={classes.stepperTitles}
                            disabled={index !== activeStep}
                            key={`tab ${label}`}
                            variant="outlined"
                            color="primary">
                            {index + 1}. {label}
                        </Button>
                    ))}
                </Grid>
                <Grid item sm={12} xs={12} elevation={2}>
                    <Paper elevation={3}>
                        <TabPanel value={activeStep} index={0} classes={{ root: classes.tab }}>
                            <NoSsr>
                                <FormInfosRequest
                                    formData={formData}
                                    setForm={setForm}
                                    handleNext={handleNext}
                                    group={group}
                                    setSelectVisitor={setSelectVisitor}
                                    handleBack={handleBack}
                                />
                            </NoSsr>
                        </TabPanel>
                        <TabPanel value={activeStep} index={1} classes={{ root: classes.tab }}>
                            <NoSsr>
                                {(() => {
                                    if (group && !selectVisitor) {
                                        return (
                                            <FormInfosImport
                                                formData={formData}
                                                setForm={setForm}
                                                handleNext={handleNext}
                                                handleBack={handleBack}
                                            />
                                        );
                                    }
                                    return (
                                        <FormInfosVisitor
                                            formData={formData}
                                            setForm={setForm}
                                            selectVisitor={selectVisitor}
                                            handleNext={handleNext}
                                            handleBack={handleBack}
                                        />
                                    );
                                })()}
                            </NoSsr>
                        </TabPanel>
                    </Paper>
                    <TabPanel value={activeStep} index={2} classes={{ root: classes.tab }}>
                        <NoSsr>
                            <FormInfosRecapDemande
                                formData={formData}
                                setForm={setForm}
                                handleNext={handleNext}
                                handleBack={handleBack}
                                setSelectVisitor={setSelectVisitor}
                                group={group}
                            />
                        </NoSsr>
                    </TabPanel>
                </Grid>
            </Grid>
        </>
    );
}

RequestAccesForm.propTypes = {
    group: PropTypes.bool
};

RequestAccesForm.defaultProps = {
    group: false
};

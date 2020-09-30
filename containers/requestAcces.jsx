import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import { fade } from '@material-ui/core/styles/colorManipulator';

import NoSsr from '../lib/nossr';

import Template from './template';
import {
  FormInfosRequest,
  FormInfosVisitor,
  FormInfosRecapDemande,
} from '../components';


const AntTab = withStyles((theme) => ({
  root: {
    color: fade(theme.palette.primary.main, 0.8),
    textTransform: 'none',
    width: '20%',
    fontSize: '1.05rem',
    minWidth: 72,
    marginRight: theme.spacing(4),
    '&$selected': {
      color: theme.palette.primary.main,
    },
    pointerEvents: 'none',
  },
  selected: {},
  // Many props needed by Material-UI
  // eslint-disable-next-line react/jsx-props-no-spreading
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  tab: {
    '& .MuiBox-root': {
      padding: 'Opx',
    },
  },
  stepperTitles: {
    fontSize: '1.2rem',
  },
  pageTitle: {
    margin: '16px 0',
    color: '#0d40a0',
  },
  pageTitleControl: {
    marginLeft: 'auto',
  },
  instruction: {
    marginBottom: '1%',
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginLeft: '2%',
  },
}));

function TabPanel({ children, value, index }) {
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
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
  const [selectVisitor, setSelectVisitor] = useState({});

  // FormState
  const [formData, setForm] = useState({
    visitors: [],
  });

  return (
    <Template>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center">
            {group ? (
              <Typography variant="h5" className={classes.pageTitle}>
                Nouvelle Demande Groupe
              </Typography>
            ) : (
              <Typography variant="h5" className={classes.pageTitle}>
                Nouvelle Demande
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
          <Tabs value={activeStep} aria-label="Etapes demande acces">
            {steps.map((label, index) => (
              <AntTab
                className={classes.stepperTitles}
                label={`${index + 1}. ${label}`}
                key={`tab ${label}`}
              />
            ))}
          </Tabs>
        </Grid>
        <Grid item sm={12} xs={12}>
          <TabPanel value={activeStep} index={0} classes={{ root: classes.tab }}>
            <NoSsr>
              <Typography className={classes.instruction} variant="body1">
                Tous les champs sont obligatoires
              </Typography>
              <FormInfosRequest
                formData={formData}
                setForm={setForm}
                handleNext={handleNext}
                group={group}
              />
            </NoSsr>
          </TabPanel>
          <TabPanel value={activeStep} index={1} classes={{ root: classes.tab }}>
            <NoSsr>
              <FormInfosVisitor
                formData={formData}
                setForm={setForm}
                selectVisitor={selectVisitor}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            </NoSsr>
          </TabPanel>
          <TabPanel value={activeStep} index={2} classes={{ root: classes.tab }}>
            <NoSsr>
              <FormInfosRecapDemande
                formData={formData}
                setForm={setForm}
                handleNext={handleNext}
                handleBack={handleBack}
                setSelectVisitor={setSelectVisitor}
              />
            </NoSsr>
          </TabPanel>
        </Grid>
      </Grid>
    </Template>
  );
}

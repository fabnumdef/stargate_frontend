// @flow
import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import { fade } from '@material-ui/core/styles/colorManipulator';

import NoSsr from '../lib/nossr';

import Template from './template';
import { FormInfosDemandeur, FormInfosVisiteur, FormInfosRecapDemande } from '../components';

const AntTab = withStyles((theme) => ({
  root: {
    color: fade(theme.palette.primary.main, 0.6),
    textTransform: 'none',
    width: '25%',
    fontSize: '1.05rem',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  pageTitle: {
    margin: '16px 0',
    color: '#0d40a0',
    fontWeight: theme.typography.fontWeightBold,
  },
  pageTitleHolder: {
    borderBottom: '1px solid #e5e5e5',
  },
  pageTitleControl: {
    marginLeft: 'auto',
  },
}));

type TabPanelProps = {
  children: any,
  value: number,
  index: number,
  ...
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

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

function getSteps(): Array<string> {
  return ['Demande', 'Visiteur', 'Recapitulatif'];
}

export default function FormDemandeAcces() {
  const classes = useStyles();
  // Moteur du Stepper
  const [activeStep, setActiveStep] = useState<number>(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Data finale du form
  const [formData, setForm] = useState({
    listVisiteurs: [],
  });

  const dataToProps = {
    formData,
    setForm,
    handleNext,
    handleBack,
  };

  return (
    <Template>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center" className={classes.pageTitleHolder}>
            <Typography variant="h5" className={classes.pageTitle}>
              Nouvelle Demande
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
          <Tabs value={activeStep} aria-label="Etapes demande acces">
            {steps.map((label, index) => (
              <AntTab label={`${index + 1}. ${label}`} key={`tab ${label}`} />
            ))}
          </Tabs>
        </Grid>
        <Grid item sm={12} xs={12}>
          <TabPanel value={activeStep} index={0}>
            <NoSsr>
              <FormInfosDemandeur dataToProps={dataToProps} />
            </NoSsr>
          </TabPanel>
          <TabPanel value={activeStep} index={1}>
            <NoSsr>
              <FormInfosVisiteur dataToProps={dataToProps} />
            </NoSsr>
          </TabPanel>
          <TabPanel value={activeStep} index={2}>
            <NoSsr>
              <FormInfosRecapDemande dataToProps={dataToProps} />
            </NoSsr>
          </TabPanel>
        </Grid>
      </Grid>
    </Template>
  );
}

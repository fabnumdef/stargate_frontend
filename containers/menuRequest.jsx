import React, { useState } from 'react';
import Link from 'next/link';

// Material Import
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { TabPanel, TabMesDemandes, TabDemandesTraitees } from '../components';
import Template from './template';

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

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#0d40a0',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      opacity: 1,
    },
    '&$selected': {
      color: '#0d40a0',
      fontWeight: theme.typography.fontWeightBold,
      backgroundColor: 'rgba(219, 227, 239, 0)',
    },
    backgroundColor: 'rgba(219, 227, 239, .6)',
    borderRadius: '5%',
  },
  selected: {},
// Many props needed by Material-UI
// eslint-disable-next-line react/jsx-props-no-spreading
}))((props) => <Tab disableRipple {...props} />);

// Modify number with API data
const tabList = [
  { label: 'En cours (3)' },
  { label: 'A traiter (2)' },
  { label: 'Traitées' },
];

export default function NestedList() {
  const classes = useStyles();

  const [tabData, setTab] = useState({
    demandes: [
      {
        numDemande: 'CSD02020-1',
        dateDemande: '13/02/2020',
        demandeur: {
          prenomDemandeur: 'Henri',
          nomDemandeur: 'Durand',
          gradeDemandeur: 'MP',
          uniteDemandeur: 'Etat Major',
        },
        periode: {
          dateDebut: '02/03/2020',
          dateFin: '04/03/2020',
        },
        motif:
          'Visite des lieux alors que la difference du 6 eme et que le 7 sont sont différentes, oui, oui, oui tu le sais',
        etapeDemande: 'Demande',
      },
      {
        numDemande: 'CSD02020-2',
        dateDemande: '02/01/2020',
        demandeur: {
          gradeDemandeur: 'AV1',
          prenomDemandeur: 'Jean',
          nomDemandeur: 'Paul',
          uniteDemandeur: 'Etat major',
        },
        periode: {
          dateDebut: '07/02/2020',
          dateFin: '20/02/2020',
        },
        motif: 'signature contrat',
        etapeDemande: 'Viser',
      },
    ],
  });

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Template>
      <Grid container spacing={2} className={classes.root}>
        <Grid item sm={12} xs={12}>
          <Box display="flex" alignItems="center" className={classes.pageTitleHolder}>
            <Typography variant="h5" className={classes.pageTitle}>
              Mes Demandes
            </Typography>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12}>
          {/** Tabulator  */}
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="off"
            aria-label="simple tabs example"
          >
            { tabList.map((tab, index) => (
              <AntTab label={tab.label} id={index} aria-controls={index} key={tab.label} />
            ))}
          </Tabs>
        </Grid>
        <Grid item sm={12} xs={12}>
          <TabPanel value={value} index={0}>
            <TabMesDemandes tabData={tabData} setTab={setTab} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TabDemandesTraitees tabData={tabData} setTab={setTab} />
          </TabPanel>
          <TabPanel value={value} index={2} />
        </Grid>
      </Grid>
    </Template>
  );
}

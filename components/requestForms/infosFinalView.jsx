import React from 'react';
import Link from 'next/link';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import remove from 'lodash';

import { format } from 'date-fns';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import TabRecapRequest from '../tabs/tabRecapRequest';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function InfosFinalView({ formData, setForm, handleBack }) {
  const classes = useStyles();

  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = event => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  return (
    <Grid container spacing={4}>
      <Grid item sm={11}>
        <Typography variant="body1">
          Visite du
          {' '}
          {format(formData.from, 'dd/MM/yyyy')}
          {' '}
          au
          {' '}
          {format(formData.to, 'dd/MM/yyyy')}
        </Typography>
        <Typography variant="body1">
          à :
          {' '}
          {formData.place.map((lieu, index) => {
            if (index === formData.place.length - 1) return `${lieu.value}.`;
            return `${lieu.value}, `;
          })}
        </Typography>
        <Typography variant="body1">
          Motif:
          {' '}
          {formData.reason}
        </Typography>
      </Grid>
      <Grid item sm={12}>
        <Paper className={classes.root}>
          <TabRecapRequest
            visitors={formData.visitors}
            onUpdate={(visiteur) => {
              setForm({ ...formData, visiteur });
            }}
            onDelete={(mail) => {
              let visiteurs = [...formData.visitors];
              visiteurs = remove(visiteurs, (visiteur) => visiteur.email === mail);
              setForm({ ...formData, visitors: visiteurs });
            }}
            handleBack={handleBack}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Grid container justify="flex-end">
          <Link href="/">
            <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
              Valider
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}

InfosFinalView.propTypes = {
  formData: PropTypes.shape({
    object: PropTypes.string.isRequired,
    from: PropTypes.instanceOf(Date).isRequired,
    to: PropTypes.instanceOf(Date).isRequired,
    reason: PropTypes.string.isRequired,
    place: PropTypes.array.isRequired,
    visitors: PropTypes.array.isRequired,
  }).isRequired,
  setForm: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
};

import React from 'react';
import Link from 'next/link';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import remove from 'lodash';

// Apollo
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { format } from 'date-fns';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { useSnackBar } from '../../lib/ui-providers/snackbar';

import TabRecapRequest from '../tabs/tabRecapRequest';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

const DELETE_VISITOR = gql`
  mutation deleteVisitor($idRequest: String!, $idVisitor: String!) {
    mutateCampus(id: "MORDOR") {
      mutateRequest(id: $idRequest) {
        deleteVisitor(id: $idVisitor) {
          id
        }
      }
    }
  }
`;

export default function InfosFinalView({
  formData, setForm, handleBack, setSelectVisitor,
}) {
  const classes = useStyles();

  const { addAlert } = useSnackBar();

  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = event => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  const [deleteVisitor] = useMutation(DELETE_VISITOR, {
    onCompleted: (data) => {
      setForm({
        ...formData,
        visitors: [...formData.visitors, data.mutateCampus.mutateRequest.addVisitor],
      });
    },
    onError: () => {
      // Display good message
      addAlert({
        message: 'erreur graphQL',
        severity: 'error',
      });
    },
  });


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
              setSelectVisitor(visiteur);
            }}
            onDelete={(idVisitor) => {
              deleteVisitor({ variables: { idRequest: formData.id, idVisitor } });

              // Delete from formData
              let visiteurs = [...formData.visitors];
              visiteurs = remove(visiteurs, (visiteur) => visiteur.id === idVisitor);
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
    id: PropTypes.string,
    object: PropTypes.string,
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
    reason: PropTypes.string,
    place: PropTypes.array,
    visitors: PropTypes.array,
  }),
  setForm: PropTypes.func.isRequired,
  setSelectVisitor: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
};

InfosFinalView.defaultProps = {
  formData: {},
};

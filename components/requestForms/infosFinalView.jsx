import React from 'react';
import Link from 'next/link';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
  mutation deleteVisitor($idRequest: String!, $idVisitor: String!, $campusId: String!) {
    campusId @client @export(as: "campusId")
    mutateCampus(id: $campusId) {
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

  const [deleteVisitor] = useMutation(DELETE_VISITOR, {
    onCompleted: (data) => {
      const newVisitors = formData.visitors.filter(
        (visitor) => visitor.id !== data.mutateCampus.mutateRequest.deleteVisitor.id,
      );
      setForm({
        ...formData,
        visitors: newVisitors,
      });
      addAlert({
        message: 'Le visiteur a bien été supprimé de la demande',
        severity: 'success',
      });
    },
    onError: () => {
      //  @todo: Display good message
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
          {format(new Date(formData.from), 'dd/MM/yyyy')}
          {' '}
          au
          {' '}
          {format(new Date(formData.to), 'dd/MM/yyyy')}
        </Typography>
        <Typography variant="body1">
          à :
          {' '}
          {formData.places.map((lieu, index) => {
            if (index === formData.places.length - 1) return `${lieu.label}.`;
            return `${lieu.label}, `;
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
    places: PropTypes.array,
    visitors: PropTypes.array,
  }),
  setForm: PropTypes.func.isRequired,
  setSelectVisitor: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
};

InfosFinalView.defaultProps = {
  formData: {},
};

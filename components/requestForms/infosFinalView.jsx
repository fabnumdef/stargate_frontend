import React from 'react';
import { useRouter } from 'next/router';

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

const DELETE_REQUEST = gql`
    mutation deleteRequest($idRequest: String!, $campusId: String!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            deleteRequest(id: $idRequest) {
                id
            }
        }
    }
`;

const CREATE_REQUEST = gql`
    mutation shiftRequestMutation($idRequest: String!, $campusId: String!, $transition: RequestTransition!) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            shiftRequest(id: $idRequest, transition: $transition) {
                id
                status
            }
        }
    }
`;

export default function InfosFinalView({
  formData, setForm, handleBack, setSelectVisitor,
}) {
  const classes = useStyles();
  const router = useRouter();

  const { addAlert } = useSnackBar();

  const [deleteVisitor] = useMutation(DELETE_VISITOR, {
    onCompleted: (data) => {
      const newVisitors = formData.visitors.filter(
        (visitor) => visitor.id !== data.mutateCampus.mutateRequest.deleteVisitor.id,
      );
      if (newVisitors.length === 0) {
        return setForm({
          visitors: [],
        });
      }
      setForm({
        ...formData,
        visitors: newVisitors,
      });
      return addAlert({
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

  const [deleteRequest] = useMutation(DELETE_REQUEST, {
    onCompleted: () => {
      router.push('/');
      addAlert({
        message: 'La demande a bien été supprimée',
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

  const [createRequest] = useMutation(CREATE_REQUEST, {
    onCompleted: (data) => {
      if (data.mutateCampus.shiftRequest.status === 'created') {
        router.push('/');
        addAlert({
          message: `La demande ${data.mutateCampus.shiftRequest.id} a bien été créé`,
          severity: 'success',
        });
      }
    },
    onError: () => {
      addAlert({
        message: 'Erreur lors de la création de votre demande',
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
          {formData.from && format(new Date(formData.from), 'dd/MM/yyyy')}
          {' '}
          au
          {' '}
          {formData.to && format(new Date(formData.to), 'dd/MM/yyyy')}
        </Typography>
        <Typography variant="body1">
          à :
          {' '}
          {formData.places && formData.places.map((lieu, index) => {
            if (index === formData.places.length - 1) return `${lieu.label}.`;
            return `${lieu.label}, `;
          })}
        </Typography>
        <Typography variant="body1">
          Motif:
          {' '}
          {formData.reason && formData.reason}
        </Typography>
      </Grid>
      <Grid item sm={12}>
        <Paper className={classes.root}>
          <TabRecapRequest
            visitors={formData.visitors}
            setSelectVisitor={setSelectVisitor}
            onDelete={(idVisitor) => {
              deleteVisitor({ variables: { idRequest: formData.id, idVisitor } });
              if (formData.visitors && formData.visitors.length === 1) {
                deleteRequest({ variables: { idRequest: formData.id } });
              }
            }}
            handleBack={handleBack}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Grid container justify="flex-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={() => createRequest({ variables: { idRequest: formData.id, transition: 'CREATE' } })}
          >
            Valider
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

InfosFinalView.propTypes = {
  formData: PropTypes.shape({
    id: PropTypes.string,
    object: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
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

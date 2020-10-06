import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Apollo
import { gql, useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
import { useSnackBar } from '../../lib/hooks/snackbar';

const IMPORT_VISITOR = gql`
  mutation importFile($file: Upload!, $idRequest:String!, $campusId: String!) {
    campusId @client @export(as: "campusId")
    mutateCampus(id: $campusId) {
      mutateRequest(id: $idRequest) {
        createGroupVisitors(file: $file){
          id
          isInternal
          employeeType
          nid
          firstname
          birthLastname
          usageLastname
          rank
          company
          email
          vip
          vipReason
          nationality
          birthday
          birthplace
          identityDocuments {
              kind
              reference
          }
        }
      }
    }
  }
`;


export default function InfosFinalView({
  formData, setForm, handleNext, handleBack,
}) {
  const { addAlert } = useSnackBar();

  const [importFile, { loading }] = useMutation(IMPORT_VISITOR, {
    onCompleted: (data) => {
      setForm({
        ...formData,
        visitors: [...formData.visitors, ...data.mutateCampus.mutateRequest.createGroupVisitors],
      });
      handleNext();
    },
    onError: () => {
      // Display good message
      addAlert({
        message: 'erreur graphQL',
        severity: 'error',
      });
    },
  });

  const handleChange = ({ target: { validity, files: [file] } }) => {
    if (validity.valid) { importFile({ variable: { idRequest: formData.id, file } }); }
  };

  const handleClickCancel = () => {
    if (formData.visitors.length > 0) handleNext();
    else handleBack();
  };

  return (
    <Grid container spacing={4}>
      <Grid item sm={8}>
        <Typography variant="body1">
          Import du fichier de visiteurs
        </Typography>
      </Grid>
      <Grid item sm={4}>
        <Button variant="contained" color="primary" component="label">
          Import
          <input
            type="file"
            onChange={(event) => {
              handleChange(event || null);
            }}
            style={{ display: 'none' }}
          />
        </Button>
      </Grid>
      <Grid item sm={12}>
        <div>
          {loading && (
            <Grid container>
              <Grid item sm={4}>
                <CircularProgress />
              </Grid>
              <Grid item sm={8}>
                <Typography variant="body1">
                  Importation du fichier en cours
                </Typography>
              </Grid>
            </Grid>
          )}
        </div>
      </Grid>
      <Grid item sm={12}>
        <Grid container justify="flex-end">
          <div>
            <Button
              variant="outlined"
              color="primary"
              style={{ marginRight: '5px' }}
              onClick={handleClickCancel}
            >
              Retour
            </Button>
          </div>
          <div>
            <Button type="submit" variant="contained" color="primary">
              Envoyer
            </Button>
          </div>
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
  handleBack: PropTypes.func.isRequired,
};

InfosFinalView.defaultProps = {
  formData: {},
};

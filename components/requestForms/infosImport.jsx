import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import red from '@material-ui/core/colors/red';

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
          visitor {
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
          errors {
            lineNumber
            kind
            field
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

  const [importFile, { data }] = useMutation(IMPORT_VISITOR, {
    onCompleted: (dataCallback) => {
      if (dataCallback.visitor) {
        setForm({
          ...formData,
          visitors: [
            ...formData.visitors,
            ...dataCallback.mutateCampus.mutateRequest.createGroupVisitors,
          ],
        });
      }
      // handleNext();
    },
    onError: (e) => {
      // Display good message
      addAlert({
        message: 'erreur graphQL',
        severity: 'error',
      });
      console.log(e);
    },
  });

  const handleChange = ({ target: { validity, files: [file] } }) => {
    if (validity.valid) importFile({ variables: { idRequest: formData.id, file } });
  };

  const handleClickCancel = () => {
    if (formData.visitors.length > 0) handleNext();
    else handleBack();
  };

  const displayIcon = () => {
    if (!data) return '';
    const visitors = data.mutateCampus.mutateRequest.createGroupVisitors;

    let render = <CheckCircleIcon style={{ color: '#28a745' }} />;

    visitors.forEach((visitor) => {
      if (visitor.visitor === null) {
        render = <ErrorIcon style={{ color: red.A400 }} />;
      }
    });
    return render;
  };

  return (
    <Grid container spacing={2} justify="center">
      <Grid item sm={3}>
        <Typography variant="subtitle2">
          Importer le fichier visiteurs
        </Typography>
      </Grid>
      <Grid item sm={3}>
        <Button variant="contained" color="primary" component="label">
          Import
          <input
            type="file"
            accept=".csv"
            onChange={(event) => {
              handleChange(event || null);
            }}
            style={{ display: 'none' }}
          />
        </Button>
      </Grid>
      <Grid item sm={12}>
        <div>
          <Grid container spacing={0}>
            { data
              && (data.mutateCampus.mutateRequest.createGroupVisitors
                .map((visitor) => (
                  <>
                    <Grid item sm={1} style={{ textAlign: 'center' }}>
                      {/* display if first visitor */}
                      { displayIcon() }
                    </Grid>
                    <Grid item sm={1}>
                      <Typography variant="body1" color="error" style={{ fontWeight: 'bold' }}>
                        {visitor.errors && visitor.errors.length > 0 && `Ligne ${visitor.errors[0].lineNumber}:`}
                      </Typography>
                    </Grid>
                    <Grid item sm={10}>
                      { (visitor.errors && visitor.errors.length > 0) ? (
                        visitor.errors.map((error) => (
                          <>
                            <Typography display="inline" variant="body2" color="error" style={{ fontWeight: 'bold' }}>
                              {`${error.field}:   `}
                            </Typography>
                            <Typography display="inline" variant="body2" color="error">
                              {error.kind}
                            </Typography>
                            <br />
                          </>
                        ))
                      ) : (
                        <>
                          <Typography display="inline" variant="body2" color="success" style={{ fontWeight: 'bold' }}>
                            {`${visitor.visitor.birthLastname} `}
                          </Typography>
                          <Typography display="inline" variant="body2" color="success">
                            {`${visitor.visitor.firstname} à bien été importé(e).`}
                          </Typography>
                          <br />
                        </>
                      ) }
                    </Grid>
                  </>
                ))
              )}
          </Grid>
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
            <Button type="submit" variant="contained" color="primary" disabled={!data || data.error}>
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

import React, { useEffect, useState } from 'react';
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

import { VISITOR_INFOS, ERROR_TYPE } from '../../utils/constants/enums';

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

export default function InfosImport({
  formData, setForm, handleNext, handleBack,
}) {
  const { addAlert } = useSnackBar();

  const [errorStatement, setErrorStatement] = useState(false);

  const [importFile, { data }] = useMutation(IMPORT_VISITOR, {
    onCompleted: (dataCallback) => {
      let errors = false;
      const visitors = [];
      dataCallback.mutateCampus.mutateRequest.createGroupVisitors.forEach((visitor) => {
        if (visitor.visitor !== null) {
          visitors.push(visitor.visitor);
        }
        if (errors === false && visitor.errors) {
          errors = true;
        }
      });
      if (errors === false) {
        addAlert({ message: 'Import réussi', severity: 'success' });
      }
      setForm({ ...formData, visitors });
    },
    onError: () => {
      // Display good message
      addAlert({
        message: "Échec de l'import",
        severity: 'error',
      });
    },
  });


  useEffect(() => {
    // On Component creation, init visitors to empty array.
    setForm({ ...formData, visitors: [] });
  }, []);

  const handleChange = ({ target: { validity, files: [file] } }) => {
    setErrorStatement(false);
    if (validity.valid) importFile({ variables: { idRequest: formData.id, file } });
  };

  const handleClickCancel = () => {
    if (formData.visitors.length > 0) handleNext();
    else handleBack();
  };

  const displayIcon = (visitor) => {
    if (!data) return '';
    let render = <CheckCircleIcon style={{ color: '#28a745' }} />;

    if (visitor.errors) {
      if (errorStatement === false) {
        setErrorStatement(true);
      }
      render = <ErrorIcon style={{ color: red.A400 }} />;
    }
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
                      { displayIcon(visitor) }
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
                              {`${VISITOR_INFOS[error.field]}:   `}
                            </Typography>
                            <Typography display="inline" variant="body2" color="error">
                              {ERROR_TYPE[error.kind]}
                            </Typography>
                            {'\n'}
                          </>
                        ))
                      ) : (
                        <>
                          <Typography display="inline" variant="body2" style={{ fontWeight: 'bold', color: '#28a745' }}>
                            {`${visitor.visitor.birthLastname} `}
                          </Typography>
                          <Typography display="inline" variant="body2" style={{ color: '#28a745' }}>
                            {`${visitor.visitor.firstname} a bien été importé(e).`}
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
            <Button type="submit" variant="contained" color="primary" disabled={formData.visitors.length <= 0 || errorStatement === true} onClick={handleNext}>
              Envoyer
            </Button>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}

InfosImport.propTypes = {
  formData: PropTypes.shape({
    id: PropTypes.string,
    object: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
    reason: PropTypes.string,
    places: PropTypes.arrayOf(),
    visitors: PropTypes.arrayOf(),
  }),
  setForm: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
};

InfosImport.defaultProps = {
  formData: {},
};

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Publish, GetApp } from '@material-ui/icons';
import SelectedBadge from '../../components/styled/common/TabBadge';
import RoundButton from '../styled/common/roundButton';

import red from '@material-ui/core/colors/red';

// Apollo
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
import { useSnackBar } from '../../lib/hooks/snackbar';

import { VISITOR_INFOS, ERROR_TYPE } from '../../utils/constants/enums';
import { makeStyles } from '@material-ui/core/styles';

export const GET_TEMPLATE_LINK = gql`
    query GetTemplateLink($campusId: String!) {
        campusId @client @export(as: "campusId")
        getCampus(id: $campusId) {
            id
            getVisitorsTemplate {
                link
            }
        }
    }
`;

const IMPORT_VISITOR = gql`
    mutation importFile(
        $file: Upload!
        $idRequest: String!
        $campusId: String!
        $as: ValidationPersonas!
    ) {
        campusId @client @export(as: "campusId")
        activeRoleCache @client @export(as: "as") {
            role: role
        }
        mutateCampus(id: $campusId) {
            mutateRequest(id: $idRequest) {
                createGroupVisitors(file: $file, as: $as) {
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

const useStyles = makeStyles((theme) => ({
    importInformations: {
        backgroundColor: theme.palette.background.table,
        padding: 15,
        borderRadius: 4
    },
    importSection: {
        paddingBottom: '0 !important'
    },
    successMessage: {
        marginLeft: 30,
        color: theme.palette.success.main
    },
    fieldTitle: {
        width: 210
    }
}));

export default function InfosImport({ formData, setForm, handleNext, handleBack }) {
    const { addAlert } = useSnackBar();
    const classes = useStyles();

    const [errorStatement, setErrorStatement] = useState(false);
    const [fileName, setFileName] = useState(null);

    const [getTemplate] = useLazyQuery(GET_TEMPLATE_LINK, {
        onCompleted: (d) => {
            const link = document.createElement('a');
            link.href = d.getCampus.getVisitorsTemplate.link;
            link.setAttribute('download', 'template.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        },
        fetchPolicy: 'no-cache'
    });

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
            } else {
                setErrorStatement(true);
            }
            setForm({ ...formData, visitors });
        },
        onError: () => {
            // Display good message
            addAlert({
                message: "Échec de l'import",
                severity: 'error'
            });
        }
    });

    useEffect(() => {
        // On Component creation, init visitors to empty array.
        setForm({ ...formData, visitors: [] });
    }, []);

    const handleChange = ({
        target: {
            validity,
            files: [file]
        }
    }) => {
        setErrorStatement(false);
        if (validity.valid) {
            setFileName(file.name);
            importFile({
                variables: {
                    idRequest: formData.id,
                    file
                }
            });
        }
    };

    const handleClickCancel = () => {
        if (formData.visitors.length > 0) handleNext();
        else handleBack();
    };

    const displayIcon = () => {
        if (!data) return '';
        let render = <CheckCircleIcon style={{ color: '#28a745' }} />;

        if (errorStatement) {
            render = <ErrorIcon style={{ color: red.A400 }} />;
        }
        return render;
    };

    return (
        <Grid container spacing={4}>
            <Grid container item justify="start">
                <Grid
                    container
                    item
                    justify="space-around"
                    alignItems="center"
                    className={classes.fieldTitle}>
                    <SelectedBadge>1</SelectedBadge>
                    <Typography variant="subtitle2">Remplir la fiche visiteur : </Typography>
                </Grid>
                <Grid item sm={2}>
                    <Button
                        variant="text"
                        color="primary"
                        style={{ textTransform: 'none' }}
                        onClick={getTemplate}>
                        <GetApp color="primary" style={{ marginRight: 8 }} />
                        Télécharger
                    </Button>
                </Grid>
            </Grid>
            <Grid container item justify="start" className={classes.importSection}>
                <Grid
                    container
                    item
                    justify="space-around"
                    alignItems="center"
                    className={classes.fieldTitle}>
                    <SelectedBadge>2</SelectedBadge>
                    <Typography variant="subtitle2">Charger la fiche visiteur : </Typography>
                </Grid>
                <Grid container item sm={2} alignItems="center">
                    <Button
                        variant="text"
                        color="primary"
                        style={{ textTransform: 'none' }}
                        component="label">
                        <Publish color="primary" style={{ marginRight: 8 }} />
                        Importer
                        <input
                            type="file"
                            accept=".xlsx"
                            onChange={(event) => {
                                handleChange(event || null);
                            }}
                            style={{ display: 'none' }}
                        />
                    </Button>
                </Grid>
                {data?.mutateCampus.mutateRequest.createGroupVisitors && (
                    <Grid
                        container
                        sm={12}
                        md={8}
                        justify="space-between"
                        className={classes.importInformations}>
                        <Grid container alignItems="center" xs={8}>
                            {displayIcon()}
                            <Typography style={{ marginLeft: 15 }}>{fileName}</Typography>
                        </Grid>
                    </Grid>
                )}
            </Grid>
            <Grid container justify="flex-end">
                <Grid container item spacing={0} sm={12} md={8}>
                    {data && !errorStatement && (
                        <Typography variant="subtitle2" className={classes.successMessage}>
                            Les visiteurs (
                            {data.mutateCampus.mutateRequest.createGroupVisitors.length}) ont été
                            importés avec succès.
                        </Typography>
                    )}
                    {data &&
                        errorStatement &&
                        data.mutateCampus.mutateRequest.createGroupVisitors.map(
                            (visitor) =>
                                visitor.errors &&
                                visitor.errors.length > 0 && (
                                    <>
                                        <Grid item sm={1} style={{ textAlign: 'center' }}>
                                            {/* display if first visitor */}
                                            {displayIcon()}
                                        </Grid>
                                        <Grid item sm={1}>
                                            <Typography
                                                display="inline"
                                                variant="body2"
                                                color="error"
                                                style={{ fontWeight: 'bold' }}>
                                                {visitor.errors &&
                                                    visitor.errors.length > 0 &&
                                                    `Ligne ${visitor.errors[0].lineNumber}:`}
                                            </Typography>
                                        </Grid>
                                        <Grid item sm={10}>
                                            {visitor.errors.map((error) => (
                                                <>
                                                    <Typography
                                                        display="inline"
                                                        variant="body2"
                                                        color="error"
                                                        style={{ fontWeight: 'bold' }}>
                                                        {`${VISITOR_INFOS[error.field]}:   `}
                                                    </Typography>
                                                    <Typography
                                                        display="inline"
                                                        variant="body2"
                                                        color="error">
                                                        {ERROR_TYPE[error.kind]}
                                                    </Typography>
                                                    {'\n'}
                                                </>
                                            ))}
                                        </Grid>
                                    </>
                                )
                        )}
                </Grid>
            </Grid>
            <Grid item sm={12}>
                <Grid container justify="flex-end">
                    <div>
                        <RoundButton
                            variant="outlined"
                            color="secondary"
                            style={{ marginRight: '5px' }}
                            onClick={handleClickCancel}>
                            Retour
                        </RoundButton>
                    </div>
                    <div>
                        <RoundButton
                            type="submit"
                            variant="contained"
                            color="secondary"
                            disabled={formData.visitors.length <= 0 || errorStatement === true}
                            onClick={handleNext}>
                            Valider
                        </RoundButton>
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
        places: PropTypes.arrayOf(PropTypes.object),
        visitors: PropTypes.arrayOf(PropTypes.object)
    }),
    setForm: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired
};

InfosImport.defaultProps = {
    formData: {}
};

import React from 'react';
import { useRouter } from 'next/router';

import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Apollo
import { gql, useMutation } from '@apollo/client';

import { format } from 'date-fns';

import ButtonsFooterContainer from '../styled/common/ButtonsFooterContainer';
import RoundButton from '../styled/common/roundButton';
import { useSnackBar } from '../../lib/hooks/snackbar';

import TabRecapRequest from '../tabs/tabRecapRequest';
import { STATE_REQUEST } from '../../utils/constants/enums';
import { makeStyles } from '@material-ui/core/styles';
import { LIST_MY_REQUESTS } from '../../lib/apollo/fragments';
import { campusIdVar } from '../../lib/apollo/cache';

const useStyles = makeStyles((theme) => ({
    requestTitle: {
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        marginBottom: 15
    },
    requestLabel: {
        fontWeight: 'bold'
    }
}));

const DELETE_VISITOR = gql`
    mutation deleteVisitor($idRequest: String!, $idVisitor: ObjectID!, $campusId: String!) {
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
    mutation shiftRequestMutation(
        $idRequest: String!
        $campusId: String!
        $transition: RequestTransition!
    ) {
        campusId @client @export(as: "campusId")
        mutateCampus(id: $campusId) {
            shiftRequest(id: $idRequest, transition: $transition) {
                id
                from
                to
                reason
                status
                places {
                    id
                    label
                }
                owner {
                    firstname
                    lastname
                    unit {
                        label
                    }
                }
            }
        }
    }
`;

export default function InfosFinalView({ formData, setForm, handleBack, setSelectVisitor, group }) {
    const router = useRouter();
    const classes = useStyles();
    const { addAlert } = useSnackBar();

    const [deleteVisitor] = useMutation(DELETE_VISITOR, {
        onCompleted: (data) => {
            const newVisitors = formData.visitors.filter(
                (visitor) => visitor.id !== data.mutateCampus.mutateRequest.deleteVisitor.id
            );
            if (newVisitors.length === 0) {
                return setForm({
                    visitors: []
                });
            }
            setForm({
                ...formData,
                visitors: newVisitors
            });
            return addAlert({
                message: 'Le visiteur a bien été supprimé de la demande',
                severity: 'success'
            });
        },
        onError: () => {
            //  @todo: Display good message
            addAlert({
                message: 'erreur graphQL',
                severity: 'error'
            });
        }
    });

    const [deleteRequest] = useMutation(DELETE_REQUEST, {
        onCompleted: () => {
            router.push('/');
            addAlert({
                message: 'La demande a bien été supprimée',
                severity: 'success'
            });
        },
        onError: () => {
            //  @todo: Display good message
            addAlert({
                message: 'erreur graphQL',
                severity: 'error'
            });
        }
    });

    const [createRequest] = useMutation(CREATE_REQUEST, {
        update: (cache, { data: { mutateCampus: shiftRequest } }) => {
            const campus = cache.readFragment({
                id: `Campus:${campusIdVar()}`,
                fragment: LIST_MY_REQUESTS,
                fragmentName: 'listMyRequests',
                variables: {
                    filters: { status: STATE_REQUEST.STATE_CREATED.state }
                }
            });

            const updatedList = {
                ...campus,
                listMyRequests: {
                    ...campus.listMyRequests,
                    list: [...campus.listMyRequests.list, shiftRequest],
                    meta: {
                        ...campus.listMyRequests.meta,
                        total: campus.listMyRequests.meta.total + 1
                    }
                }
            };

            cache.writeFragment({
                id: `Campus:${campusIdVar()}`,
                fragment: LIST_MY_REQUESTS,
                fragmentName: 'listMyRequests',
                variables: {
                    filters: { status: STATE_REQUEST.STATE_CREATED.state }
                },
                data: updatedList
            });
        },
        onCompleted: (data) => {
            if (data.mutateCampus.shiftRequest.status === STATE_REQUEST.STATE_CREATED.state) {
                router.push('/demandes');
                addAlert({
                    message: `La demande ${data.mutateCampus.shiftRequest.id} a bien été créée`,
                    severity: 'success'
                });
            }
        },
        onError: () => {
            addAlert({
                message: 'Erreur lors de la création de votre demande',
                severity: 'error'
            });
        }
    });

    return (
        <Grid container spacing={4}>
            <Grid item sm={11}>
                <Typography variant={'subtitle1'} className={classes.requestTitle}>
                    {formData.id}
                </Typography>
                <Typography variant="body1">
                    <span className={classes.requestLabel}>Visite du :</span>{' '}
                    {formData.from && format(new Date(formData.from), 'dd/MM/yyyy')} au{' '}
                    {formData.to && format(new Date(formData.to), 'dd/MM/yyyy')}
                </Typography>
                <Typography variant="body1">
                    <span className={classes.requestLabel}>Lieu(x) :</span>{' '}
                    {formData.places &&
                        formData.places.map((lieu, index) => {
                            if (index === formData.places.length - 1) return lieu.label;
                            return `${lieu.label}, `;
                        })}
                </Typography>
                <Typography variant="body1">
                    <span className={classes.requestLabel}>Motif :</span>{' '}
                    {formData.reason && formData.reason}
                </Typography>
            </Grid>
            <Grid item sm={12}>
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
            </Grid>

            <ButtonsFooterContainer>
                {group && (
                    <RoundButton variant="outlined" color="primary" onClick={handleBack}>
                        Retour
                    </RoundButton>
                )}
                <RoundButton
                    variant="contained"
                    color="primary"
                    onClick={() =>
                        createRequest({
                            variables: { idRequest: formData.id, transition: 'CREATE' }
                        })
                    }>
                    Valider
                </RoundButton>
            </ButtonsFooterContainer>
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
        places: PropTypes.arrayOf(PropTypes.object),
        visitors: PropTypes.arrayOf(PropTypes.object)
    }),
    setForm: PropTypes.func.isRequired,
    setSelectVisitor: PropTypes.func,
    handleBack: PropTypes.func.isRequired,
    group: PropTypes.bool
};

InfosFinalView.defaultProps = {
    formData: {},
    group: false,
    setSelectVisitor: () => {}
};

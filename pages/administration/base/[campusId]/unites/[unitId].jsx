import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../../../components/styled/common/pageTitle';
import { useSnackBar } from '../../../../../lib/hooks/snackbar';
import LoadingCircle from '../../../../../components/styled/animations/loadingCircle';
import { GET_CAMPUS, GET_UNIT } from '../../../../../lib/apollo/queries';
import HeaderPageBackBtn from '../../../../../components/styled/headerPageBackBtn';
import { UnitFormContainer, UnitRoleFormContainer } from '../../../../../containers';
import { UnitPlacesFormContainer } from '../../../../../containers';
import { mapEditUnit } from '../../../../../utils/mappers/adminMappers';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const DELETE_UNIT = gql`
    mutation deleteUnit($campusId: String!, $id: ObjectID!) {
        mutateCampus(id: $campusId) {
            deleteUnit(id: $id) {
                id
            }
        }
    }
`;

const EDIT_UNIT = gql`
    mutation editUnit($campusId: String!, $id: ObjectID!, $unit: UnitInput!) {
        mutateCampus(id: $campusId) {
            editUnit(id: $id, unit: $unit) {
                id
                label
                trigram
                workflow {
                    steps {
                        role
                        behavior
                    }
                }
            }
        }
    }
`;

const useStyles = makeStyles(() => ({
    manageUnitContainer: {
        padding: '20px 50px'
    }
}));

function EditUnit() {
    const { addAlert } = useSnackBar();
    const router = useRouter();
    const classes = useStyles();
    const { unitId: id, campusId } = router.query;
    const { data: unitData } = useQuery(GET_UNIT, {
        variables: {
            id,
            campusId
        }
    });

    const { data: campusData } = useQuery(GET_CAMPUS, { variables: { id: campusId } });

    const [deleteUnit] = useMutation(DELETE_UNIT, {
        variables: { campusId },
        onError: () =>
            addAlert({ message: 'Erreur lors de la supression unité', severity: 'error' })
    });
    const [editUnit] = useMutation(EDIT_UNIT, {
        variables: { campusId },
        onError: () =>
            addAlert({ message: 'Erreur lors de la modification unité', severity: 'error' })
    });

    const submitEditUnit = async (formData, editUnitData) => {
        try {
            editUnit({ variables: { id, unit: editUnitData } });
            addAlert({ message: "L'unité a bien été modifiée", severity: 'success' });
        } catch (e) {
            return addAlert({
                message: 'Une erreur est survenue lors de la modification',
                severity: 'error'
            });
        }
    };

    const submitDeleteUnit = async () => {
        try {
            deleteUnit({ variables: { id } });
            addAlert({ message: "L'unité a bien été supprimée", severity: 'success' });
            router.back();
        } catch (e) {
            return addAlert({
                message: 'Une erreur est survenue lors de la suppression',
                severity: 'error'
            });
        }
    };

    if (!unitData || !campusData) return <LoadingCircle />;
    return (
        <>
            <HeaderPageBackBtn>Retour administration de base</HeaderPageBackBtn>
            <PageTitle subtitles={['Unité', 'Editer unité']}>Administration</PageTitle>
            <Paper elevation={2} className={classes.manageUnitContainer}>
                <UnitFormContainer
                    submitUnitForm={submitEditUnit}
                    submitDeleteUnit={submitDeleteUnit}
                    defaultValues={mapEditUnit(unitData.getCampus.getUnit)}
                    campus={campusData.getCampus}
                />
                <UnitPlacesFormContainer
                    campus={campusData.getCampus}
                    unit={unitData.getCampus.getUnit}
                />
                <UnitRoleFormContainer
                    campus={campusData.getCampus}
                    unit={unitData.getCampus.getUnit}
                />
            </Paper>
        </>
    );
}

export default EditUnit;

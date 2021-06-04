import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../../../components/styled/common/pageTitle';
import { useSnackBar } from '../../../../../lib/hooks/snackbar';
import LoadingCircle from '../../../../../components/styled/animations/loadingCircle';
import { GET_CAMPUS, GET_UNIT } from '../../../../../lib/apollo/queries';
import HeaderPageBackBtn from '../../../../../components/styled/headerPageBackBtn';
import {
    UnitDetailContainer,
    UnitFormContainer,
    UnitRoleFormContainer
} from '../../../../../containers';
import { UnitPlacesFormContainer } from '../../../../../containers';
import { mapEditUnit } from '../../../../../utils/mappers/adminMappers';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import DeleteModal from '../../../../../components/styled/common/DeleteDialogs';

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

    const [editUnitSection, setEditUnit] = useState(false);
    const [toDelete, setToDelete] = useState(null);

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

    const submitEditUnit = async (unitId) => {
        try {
            editUnit({ variables: { id, unit: unitId } });
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
            await deleteUnit({ variables: { id } });
            addAlert({ message: "L'unité a bien été supprimée", severity: 'success' });
            router.back();
        } catch (e) {
            return addAlert({
                message: 'Une erreur est survenue lors de la suppression',
                severity: 'error'
            });
        }
    };

    const handleDeleteUnit = (label) => {
        setToDelete(label);
    };

    const toggleEditUnit = () => {
        setEditUnit(!editUnitSection);
    };

    if (!unitData || !campusData) return <LoadingCircle />;
    return (
        <>
            <HeaderPageBackBtn>Retour administration de base</HeaderPageBackBtn>
            <PageTitle subtitles={['Unité', 'Editer unité']}>Administration</PageTitle>
            <Paper elevation={2} className={classes.manageUnitContainer}>
                {editUnitSection ? (
                    <UnitFormContainer
                        submitUnitForm={submitEditUnit}
                        handleDeleteUnit={handleDeleteUnit}
                        defaultValues={mapEditUnit(unitData.getCampus.getUnit)}
                        campus={campusData.getCampus}
                        cancelEdit={toggleEditUnit}
                    />
                ) : (
                    <UnitDetailContainer
                        defaultValues={mapEditUnit(unitData.getCampus.getUnit)}
                        toggleEditUnit={toggleEditUnit}
                    />
                )}
                <UnitPlacesFormContainer
                    campus={campusData.getCampus}
                    unit={unitData.getCampus.getUnit}
                />
                <UnitRoleFormContainer
                    campus={campusData.getCampus}
                    unit={unitData.getCampus.getUnit}
                />
                <DeleteModal
                    isOpen={toDelete ? toDelete : null}
                    title="Supression Unité"
                    onClose={(confirm) => {
                        if (confirm) submitDeleteUnit();
                        setToDelete(null);
                    }}
                />
            </Paper>
        </>
    );
}

export default EditUnit;

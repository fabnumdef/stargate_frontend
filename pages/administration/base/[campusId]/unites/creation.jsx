import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../../../components/styled/common/pageTitle';
import { useSnackBar } from '../../../../../lib/hooks/snackbar';
import { GET_CAMPUS } from '../../../../../lib/apollo/queries';
import LoadingCircle from '../../../../../components/styled/animations/loadingCircle';
import { UnitFormContainer } from '../../../../../containers';
import { ADMIN_CAMPUS_UNITS_EDITION } from '../../../../../utils/constants/appUrls';
import { workflowCards } from '../../../../../utils/mappers/adminMappers';

const CREATE_UNIT = gql`
    mutation createUnit($campusId: String!, $unit: UnitInput!) {
        mutateCampus(id: $campusId) {
            createUnit(unit: $unit) {
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

function CreateUnit() {
    const { addAlert } = useSnackBar();
    const router = useRouter();
    const { campusId } = router.query;

    const { data: campusData } = useQuery(GET_CAMPUS, { variables: { id: campusId } });

    const [createUnitMutation] = useMutation(CREATE_UNIT, {
        variables: { campusId },
        onError: () =>
            addAlert({ message: "Erreur lors de la création de l'unité", severity: 'error' })
    });

    const submitUnitForm = async (formData, unitData) => {
        try {
            const {
                data: {
                    mutateCampus: { createUnit }
                }
            } = await createUnitMutation({ variables: { unit: unitData } });

            addAlert({ message: "L'unité a bien été créée", severity: 'success' });
            return router.push(ADMIN_CAMPUS_UNITS_EDITION(campusId, createUnit.id));
        } catch (e) {
            return addAlert({ message: 'Une erreur est survenue', severity: 'error' });
        }
    };

    const defaultValues = { name: '', trigram: '', cards: workflowCards };

    if (!campusData) return <LoadingCircle />;

    return (
        <>
            <PageTitle subtitles={['Unité', 'Nouvelle unité']}>Administration</PageTitle>
            <UnitFormContainer
                submitUnitForm={submitUnitForm}
                campus={campusData.getCampus}
                defaultValues={defaultValues}
                cancelEdit={router.back()}
            />
        </>
    );
}

export default CreateUnit;

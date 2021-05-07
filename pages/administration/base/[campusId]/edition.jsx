import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { CampusFormContainer } from '../../../../containers';
import { useSnackBar } from '../../../../lib/hooks/snackbar';
import { ADMIN_CAMPUS_MANAGEMENT } from '../../../../utils/constants/appUrls';

const GET_CAMPUS = gql`
    query getCampus($id: String!) {
        getCampus(id: $id) {
            id
            label
            trigram
        }
    }
`;

const EDIT_CAMPUS = gql`
    mutation editCampus($campus: EditCampusInput!, $id: String!) {
        editCampus(campus: $campus, id: $id) {
            id
            label
        }
    }
`;

function EditCampus() {
    const { addAlert } = useSnackBar();
    const router = useRouter();
    const { campusId: id } = router.query;
    const [editCampus] = useMutation(EDIT_CAMPUS);

    const { data: editCampusData, loading } = useQuery(GET_CAMPUS, {
        variables: { id },
        fetchPolicy: 'no-cache'
    });

    const submitEditCampus = async (data) => {
        try {
            await editCampus({
                variables: {
                    id,
                    campus: { label: data.label.trim(), trigram: data.trigram.trim() }
                }
            });
            addAlert({
                message: 'La modification a bien été effectuée',
                severity: 'success'
            });
            return router.push(ADMIN_CAMPUS_MANAGEMENT(id));
        } catch (e) {
            return addAlert({
                message: 'Erreur serveur, merci de réessayer',
                severity: 'warning'
            });
        }
    };

    return (
        <>
            {!loading && (
                <CampusFormContainer
                    onSubmit={submitEditCampus}
                    defaultValues={editCampusData.getCampus}
                    campusId={id}
                />
            )}
        </>
    );
}

export default EditCampus;

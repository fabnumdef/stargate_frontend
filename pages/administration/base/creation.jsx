import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { CampusFormContainer } from '../../../containers';
import { useSnackBar } from '../../../lib/hooks/snackbar';

const CREATE_CAMPUS = gql`
    mutation createCampus($campus: CampusInput!, $id: String!) {
        createCampus(id: $id, campus: $campus) {
            id
            label
            trigram
        }
    }
`;

function CreateCampus() {
    const { addAlert } = useSnackBar();
    const router = useRouter();
    const [createCampus] = useMutation(CREATE_CAMPUS);

    const submitCreateCampus = async (data) => {
        try {
            const {
                data: { createCampus: campusData }
            } = await createCampus({
                variables: {
                    id: data.id.trim(),
                    campus: { label: data.label.trim(), trigram: data.trigram.trim() }
                }
            });

            router.push(`${campusData.id}`);
            return addAlert({
                message: 'La base a bien été créée',
                severity: 'success'
            });
        } catch (e) {
            return addAlert({
                message: 'Erreur serveur, merci de réessayer',
                severity: 'warning'
            });
        }
    };

    return (
        <>
            <CampusFormContainer onSubmit={submitCreateCampus} />
        </>
    );
}

export default CreateCampus;

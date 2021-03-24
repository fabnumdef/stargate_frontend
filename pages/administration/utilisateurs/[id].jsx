import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../components/styled/common/pageTitle';
import Template from '../../../containers/template';
import UserForm from '../../../components/administrationForms/userForm';
import { useSnackBar } from '../../../lib/hooks/snackbar';
import { useLogin } from '../../../lib/loginContext';

const GET_USER = gql`
    query getUser($id: ObjectID!) {
        getUser(id: $id) {
            id
            firstname
            lastname
            email {
                original
            }
            roles {
                role
                campuses {
                    id
                    label
                }
                units {
                    id
                    label
                }
            }
        }
    }
`;

const EDIT_USER = gql`
    mutation editUser($user: UserInput!, $id: ObjectID!) {
        editUser(user: $user, id: $id) {
            id
            firstname
            lastname
            email {
                original
            }
            roles {
                role
                campuses {
                    id
                    label
                }
                units {
                    id
                    label
                }
            }
        }
    }
`;

function EditUser() {
    const { addAlert } = useSnackBar();
    const router = useRouter();
    const { id } = router.query;
    const { data: editUserData } = useQuery(GET_USER, { variables: { id } });
    const [editUser] = useMutation(EDIT_USER);
    const { activeRole } = useLogin();

    const [defaultValues, setDefaultValues] = useState(null);

    const submitEditUser = async (user) => {
        try {
            const {
                data: {
                    editUser: { id: userId }
                }
            } = await editUser({ variables: { user, id } });
            if (userId) {
                addAlert({ message: "L'utilisateur a bien été modifié", severity: 'success' });
                router.push('/index');
            }
            return null;
        } catch (e) {
            switch (true) {
                case e.message === 'GraphQL error: User already exists':
                    return addAlert({
                        message: 'Un utilisateur est déjà enregistré avec cet e-mail',
                        severity: 'error'
                    });
                case e.message.includes(
                    'User validation failed: email.original: queryMx ENOTFOUND'
                ):
                    return addAlert({
                        message: "Erreur, veuillez vérifier le domaine de l'adresse e-mail",
                        severity: 'warning'
                    });
                default:
                    return addAlert({
                        message: 'Erreur serveur, merci de réessayer',
                        severity: 'warning'
                    });
            }
        }
    };

    const mapEditUser = (data) => ({
        ...data,
        email: data.email.original,
        campus: data.roles[0] && data.roles[0].campuses[0] ? data.roles[0].campuses[0].id : null,
        unit: data.roles[0] && data.roles[0].units[0] ? data.roles[0].units[0].id : null,
        role: data.roles[0] ? data.roles[0].role : null
    });

    useEffect(() => {
        if (editUserData && editUserData.getUser) {
            setDefaultValues(mapEditUser(editUserData.getUser));
        }
    }, [editUserData]);

    return (
        <Template>
            <PageTitle title="Administration" subtitles={['Utilisateur', 'Modifier utilisateur']} />
            {defaultValues && (
                <UserForm
                    submitForm={submitEditUser}
                    defaultValues={defaultValues}
                    userRole={activeRole}
                    type="edit"
                />
            )}
        </Template>
    );
}

export default EditUser;

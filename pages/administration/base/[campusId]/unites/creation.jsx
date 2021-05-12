import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import PageTitle from '../../../../../components/styled/common/pageTitle';
import UnitForm from '../../../../../components/administrationForms/unitForm';
import { useSnackBar } from '../../../../../lib/hooks/snackbar';
import { useLogin } from '../../../../../lib/loginContext';
import { FORMS_LIST, ROLES } from '../../../../../utils/constants/enums';
import { GET_UNITS_LIST } from '../../../../../lib/apollo/queries';

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

const EDIT_USER = gql`
    mutation editUser($id: ObjectID!, $user: UserInput!) {
        editUser(id: $id, user: $user) {
            id
            firstname
            lastname
            roles {
                role
                userInCharge
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

const EDIT_PLACE = gql`
    mutation editPlace($campusId: String!, $id: ObjectID!, $place: PlaceInput!) {
        mutateCampus(id: $campusId) {
            editPlace(id: $id, place: $place) {
                id
                label
                unitInCharge {
                    id
                    label
                }
            }
        }
    }
`;

function CreateUnit() {
    const { addAlert } = useSnackBar();
    const router = useRouter();

    const { campusId } = router.query;

    const [createUnit] = useMutation(CREATE_UNIT, {
        variables: { campusId },
        update: (
            cache,
            {
                data: {
                    mutateCampus: { createUnit: createdUnit }
                }
            }
        ) => {
            const currentUnits = cache.readQuery({
                query: GET_UNITS_LIST,
                variables: {
                    cursor: { first: 10, offset: 0 },
                    search: null,
                    campusId
                }
            });
            const updatedTotal = currentUnits.getCampus.listUnits.meta.total + 1;
            const updatedUnits = {
                ...currentUnits,
                getCampus: {
                    ...currentUnits.getCampus,
                    listUnits: {
                        ...currentUnits.getCampus.listUnits,
                        ...(updatedTotal < 10 && {
                            list: [...currentUnits.getCampus.listUnits.list, createdUnit]
                        }),
                        meta: {
                            ...currentUnits.getCampus.listUnits.meta,
                            total: updatedTotal
                        }
                    }
                }
            };
            cache.writeQuery({
                query: GET_UNITS_LIST,
                variables: {
                    cursor: { first: 10, offset: 0 },
                    search: null,
                    campusId
                },
                data: updatedUnits
            });
        }
    });
    const [editUserReq] = useMutation(EDIT_USER);
    const [editPlaceReq] = useMutation(EDIT_PLACE, { variables: { campusId } });
    const { activeRole } = useLogin();

    const editUser = async (id, roles) => {
        try {
            await editUserReq({
                variables: {
                    id,
                    user: { roles }
                }
            });
        } catch (e) {
            addAlert({ message: 'Une erreur est survenue', severity: 'error' });
        }
        return true;
    };

    const submitCreateUnit = async (formData, unitData, assistantsList) => {
        try {
            const { data: unitResponse } = await createUnit({ variables: { unit: unitData } });
            const unitId = unitResponse.mutateCampus.createUnit.id;
            await editUser(formData.unitCorrespondent, {
                role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
                userInCharge: formData.unitCorrespondent,
                campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
                units: { id: unitId, label: unitData.label }
            });
            await Promise.all(
                formData.places.map(async (place) => {
                    await editPlaceReq({
                        variables: {
                            id: place.id,
                            place: { unitInCharge: { id: unitId } }
                        }
                    });
                })
            );
            if (assistantsList[FORMS_LIST.CORRES_ASSISTANTS].length) {
                await Promise.all(
                    assistantsList[FORMS_LIST.CORRES_ASSISTANTS].map(async (user) => {
                        if (user.toDelete) {
                            return user;
                        }
                        await editUser(user.id, {
                            role: ROLES.ROLE_UNIT_CORRESPONDENT.role,
                            userInCharge: formData.unitCorrespondent,
                            campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
                            units: { id: unitId, label: unitData.label }
                        });
                        return user;
                    })
                );
            }
            if (formData.unitOfficer) {
                await editUser(formData.unitOfficer, {
                    role: ROLES.ROLE_SECURITY_OFFICER.role,
                    userInCharge: formData.unitOfficer,
                    campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
                    units: { id: unitId, label: unitData.label }
                });
            }
            if (assistantsList[FORMS_LIST.OFFICER_ASSISTANTS].length) {
                await Promise.all(
                    assistantsList[FORMS_LIST.OFFICER_ASSISTANTS].map(async (user) => {
                        if (user.toDelete) {
                            return user;
                        }
                        await editUser(user.id, {
                            role: ROLES.ROLE_SECURITY_OFFICER.role,
                            userInCharge: formData.unitOfficer,
                            campuses: { id: 'NAVAL-BASE', label: 'Base Navale' },
                            units: { id: unitId, label: unitData.label }
                        });
                        return user;
                    })
                );
            }
            addAlert({ message: "L'unité a bien été créé", severity: 'success' });
            return router.push('/administration/unites');
        } catch (e) {
            return addAlert({ message: 'Une erreur est survenue', severity: 'error' });
        }
    };

    const defaultValues = {
        assistantsList: {
            [FORMS_LIST.CORRES_ASSISTANTS]: [],
            [FORMS_LIST.OFFICER_ASSISTANTS]: []
        },
        placesList: [],
        unitOfficer: {},
        unitCorrespondent: {}
    };

    return (
        <>
            <PageTitle subtitles={['Unité', 'Nouvelle unité']}>Administration</PageTitle>
            <UnitForm
                submitForm={submitCreateUnit}
                defaultValues={defaultValues}
                userRole={activeRole}
                type="create"
            />
        </>
    );
}

export default CreateUnit;

import React from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core';
import PageTitle from '../../../../../components/styled/common/pageTitle';
import AddPlace from '../../../../../components/administration/placesEdition/AddPlace';
import { GET_CAMPUS } from '../../../../../lib/apollo/queries';
import ListPlaces from '../../../../../components/administration/placesEdition/ListPlaces';
import HeaderPageBackBtn from '../../../../../components/styled/headerPageBackBtn';
import { ADMIN_CAMPUS_MANAGEMENT } from '../../../../../utils/constants/appUrls';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        '& div[role=link]': {
            zIndex: 9000
        },
        '& section > div': {
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '10px',
            '& >*:first-child': {
                marginRight: '10px'
            }
        },
        '& ul': {
            maxWidth: '440px',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            '& li:hover': {
                backgroundColor: 'rgba(0,0,0,0.02)'
            },
            '& li button:first-child': {
                marginRight: '4px'
            }
        }
    }
}));

function CreatePlace() {
    const classes = useStyles();
    const router = useRouter();

    const { campusId } = router.query;

    const { data, loading } = useQuery(GET_CAMPUS, {
        variables: { id: campusId },
        skip: !campusId
    });

    if (loading || !data) return '';

    return (
        <>
            <HeaderPageBackBtn to={ADMIN_CAMPUS_MANAGEMENT(campusId)}>
                Retour administration de base
            </HeaderPageBackBtn>
            <div className={classes.root}>
                <PageTitle subtitles={[data.getCampus.label, 'Lieux']}>Base</PageTitle>
                <section>
                    <AddPlace campusId={campusId} />
                </section>
                <ListPlaces campusId={campusId} />
            </div>
        </>
    );
}

export default CreatePlace;

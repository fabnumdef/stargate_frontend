import React from 'react';

import PageNotFoundLogo from '../components/styled/animations/pageNotFoundLogo';
import Typography from '@material-ui/core/Typography';
import RoundButton from '../components/styled/common/roundButton';
import { useRouter } from 'next/router';
export default function About() {
    const router = useRouter();
    return (
        <div style={{ textAlign: 'center' }}>
            <PageNotFoundLogo />
            <Typography variant="h4" color="initial">
                Désolé cette page n&apos;existe pas
            </Typography>
            <RoundButton onClick={() => router.push('/')}>Retour à l&apos;accueil</RoundButton>
        </div>
    );
}

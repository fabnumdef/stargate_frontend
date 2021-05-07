import React from 'react';

import UnderConstructionPage from '../components/styled/animations/underConstructionLogo';
import Typography from '@material-ui/core/Typography';

export default function underConstruction() {
    return (
        <div style={{ textAlign: 'center' }}>
            <UnderConstructionPage />
            <Typography variant="h4" color="initial">
                Page en construction
            </Typography>
        </div>
    );
}

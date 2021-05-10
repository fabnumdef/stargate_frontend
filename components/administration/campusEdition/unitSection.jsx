import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import {
    ADMIN_CAMPUS_UNITS_EDITION,
    ADMIN_CAMPUS_UNIT_CREATE
} from '../../../utils/constants/appUrls';
import ItemCard from '../../styled/itemCard';

import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    globalContainer: {
        paddingLeft: theme.spacing(4)
    },
    warningIcon: {
        width: 30
    },
    listUnits: {
        marginLeft: theme.spacing(8)
    }
}));

function UnitSection({ listUnits, campusId }) {
    const router = useRouter();
    const classes = useStyles();

    const handleEditUnit = (unitId) => {
        router.push(ADMIN_CAMPUS_UNITS_EDITION(campusId, unitId));
    };

    const handleCreateUnit = () => {
        router.push(ADMIN_CAMPUS_UNIT_CREATE(campusId));
    };

    return (
        <Grid container alignItems="center">
            <Grid container item className={classes.globalContainer}>
                <Grid item className={classes.warningIcon}>
                    {!listUnits.list.length && <WarningIcon />}
                </Grid>
                <Grid>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Unités ({listUnits.meta.total})
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item sm={12} md={12} className={classes.listUnits}>
                {listUnits.list.map((unit) => (
                    <Grid item key={unit.id} onClick={() => handleEditUnit(unit.id)}>
                        <ItemCard
                            style={{
                                cursor: 'pointer',
                                justifyContent: 'center',
                                opacity: 1
                            }}>
                            <Typography variant="body1">{unit.label}</Typography>
                        </ItemCard>
                    </Grid>
                ))}
                <Grid item onClick={handleCreateUnit}>
                    <ItemCard style={{ cursor: 'pointer', fontSize: 35 }}>+</ItemCard>
                </Grid>
            </Grid>
        </Grid>
    );
}

UnitSection.propTypes = {
    campusId: PropTypes.string.isRequired,
    listUnits: PropTypes.objectOf({
        meta: PropTypes.objectOf(PropTypes.string).isRequired,
        list: PropTypes.array.isRequired
    }).isRequired
};

export default UnitSection;

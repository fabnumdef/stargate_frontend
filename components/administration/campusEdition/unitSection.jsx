import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import AddIcon from '@material-ui/icons/Add';

import {
    ADMIN_CAMPUS_UNITS_EDITION,
    ADMIN_CAMPUS_UNIT_CREATE
} from '../../../utils/constants/appUrls';
import ItemCard from '../../styled/itemCard';

import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import SelectedBadge from '../../styled/common/TabBadge';

const useStyles = makeStyles((theme) => ({
    globalContainer: {
        padding: `20px 10px 23px 50px`,
        backgroundColor: theme.palette.background.layout,
        borderRadius: 4
    },
    warningIcon: {
        width: 30
    },
    addIcon: {
        height: '100%'
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
        <Grid container alignItems="center" className={classes.globalContainer}>
            <Grid container item>
                <Grid container>
                    {!listUnits.list.length && (
                        <Grid item className={classes.warningIcon}>
                            <WarningIcon />
                        </Grid>
                    )}
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        Unités
                    </Typography>
                    <SelectedBadge small>{listUnits.meta.total}</SelectedBadge>
                </Grid>
            </Grid>
            <Grid container item sm={12} md={12} className={classes.listUnits}>
                {listUnits.list.map((unit) => (
                    <Grid key={unit.id} onClick={() => handleEditUnit(unit.id)}>
                        <ItemCard clickable>
                            <Typography variant="body1">{unit.trigram}</Typography>
                        </ItemCard>
                    </Grid>
                ))}
                <Grid item onClick={handleCreateUnit}>
                    <ItemCard clickable style={{ width: 45 }}>
                        <AddIcon className={classes.addIcon} />
                    </ItemCard>
                </Grid>
            </Grid>
        </Grid>
    );
}

UnitSection.propTypes = {
    campusId: PropTypes.string.isRequired,
    listUnits: PropTypes.shape({
        meta: PropTypes.object.isRequired,
        list: PropTypes.array.isRequired
    }).isRequired
};

export default UnitSection;

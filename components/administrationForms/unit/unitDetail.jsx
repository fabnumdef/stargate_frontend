import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import RoundedIconButton, { ROUNDED_BUTTON_TYPE } from '../../styled/RoundedIconButton';
import ItemCard from '../../styled/itemCard';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    createUnitDetail: {
        width: '50%',
        padding: '20px 30px',
        marginBottom: 40
    },
    fieldTitle: {
        fontWeight: 'bold'
    },
    fieldData: {
        padding: theme.spacing(2)
    }
}));

const UnitDetail = ({ defaultValues, toggleEditUnit }) => {
    const classes = useStyles();

    return (
        <Paper className={classes.createUnitDetail}>
            <Grid container justify="space-between">
                <Grid sm={11}>
                    <Grid>
                        <Typography variant="body1" className={classes.fieldTitle}>
                            Unité
                        </Typography>
                        <Typography variant="body1" className={classes.fieldData}>
                            {defaultValues.name}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body1" className={classes.fieldTitle}>
                            Trigramme
                        </Typography>
                        <Typography variant="body1" className={classes.fieldData}>
                            {defaultValues.trigram}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body1" className={classes.fieldTitle}>
                            Parcours de validation
                        </Typography>
                        <Grid container>
                            {defaultValues.cards.map((card) => {
                                return <ItemCard key={card.role}>{card.text}</ItemCard>;
                            })}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid>
                    <RoundedIconButton
                        onClick={() => toggleEditUnit()}
                        type={ROUNDED_BUTTON_TYPE.EDIT}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

UnitDetail.propTypes = {
    defaultValues: PropTypes.objectOf({
        name: PropTypes.string.isRequired,
        trigram: PropTypes.string.isRequired,
        cards: PropTypes.array.isRequired
    }),
    toggleEditUnit: PropTypes.func.isRequired
};

export default UnitDetail;

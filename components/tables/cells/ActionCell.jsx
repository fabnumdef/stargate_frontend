import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';
import { useDecisions } from '../../../lib/hooks/useDecisions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    radio: {
        '&$checked': {
            color: theme.palette.success.main
        }
    },
    radioRejected: {
        '&$checked': {
            color: theme.palette.error.main
        }
    },
    radioWarning: {
        '&$checked': {
            color: theme.palette.warning.main
        }
    },
    checked: {},
    formControl: {
        display: 'block'
    },
    noLabel: {
        marginTop: '5px',
        marginLeft: '-15px',
        position: 'absolute',
        maxWidth: '155px'
    },
    liFontSize: {
        '& li': {
            fontSize: '0.75rem'
        }
    },
    divRelative: {
        position: 'relative',
        maxHeight: 32
    }
}));

const CustomInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3)
        }
    },
    input: {
        border: 'none',
        fontSize: '0.75rem'
    }
}))(InputBase);

// use to reset the choice
const initChoice = {
    label: '',
    validation: '',
    tags: []
};
export function ActionCell({ choices, decision }) {
    const classes = useStyles();

    const {
        decisions: { [`${decision.request.id}_${decision.id}`]: decisionQuery },
        addDecision
    } = useDecisions();

    const decisionChoice = React.useMemo(() => {
        if (!decisionQuery) return initChoice;

        const choice = choices.find((choice) => {
            if (choice.label === decisionQuery?.choice?.label) return true;

            if (choice.subChoices) {
                let exist = false;
                choice.subChoices.forEach((subChoice) => {
                    if (subChoice.label === decisionQuery?.choice?.label) exist = true;
                });
                return exist;
            }
        });

        if (!choice) return initChoice;
        return choice;
    }, [decisionQuery]);

    const [otherChoice, setOtherChoice] = useState(initChoice);

    /**
     * If the actual value of decisionChoice is equal to the value of
     * the clicked element => reset the choice (deselect).
     * If the clicked element is equal to
     * 'Autre choix' (select menu) => set choice to the value of otherChoice.
     * else set the decision to the values of the clicked element
     * @param {*} choice
     * @returns addDecision.
     */
    const handleRadioClick = (choice) => {
        let selectedChoice;
        if (decisionChoice === choice) {
            selectedChoice = initChoice;
        } else if (choice.label === 'Autre choix') {
            selectedChoice = otherChoice;
        } else {
            selectedChoice = choice;
        }
        return addDecision({
            choice: selectedChoice,
            request: { id: decision.request.id },
            id: decision.id
        });
    };

    /**
     * Management fo the select change.
     * If the actual value of decisionChoice is equal to the value of
     * the clicked element => reset the choice (deselect).
     * Else set the value of choice to the clicked element.
     */
    const handleChangeOtherChoice = (event, choice) => {
        if (choice === otherChoice) {
            addDecision({
                choice: initChoice,
                request: { id: decision.request.id },
                id: decision.id
            });
            return;
        }
        setOtherChoice(choice);
        addDecision({
            choice,
            request: { id: decision.request.id },
            id: decision.id
        });
    };

    return React.useMemo(
        () => (
            <TableCell>
                <Grid container style={{ width: '110px' }}>
                    {choices.map((choice) => {
                        if (choice.label === 'Autre choix') {
                            return (
                                <Grid
                                    item
                                    sm={12}
                                    className={classes.divRelative}
                                    key={choice.label}>
                                    <FormControlLabel
                                        label=""
                                        value={choice.label}
                                        control={
                                            <Radio
                                                classes={{
                                                    root: classes.radio,
                                                    checked: classes.checked
                                                }}
                                                disabled={otherChoice.label === ''}
                                                checked={choice.label === decisionChoice.label}
                                                onClick={() => handleRadioClick(choice)}
                                            />
                                        }
                                    />
                                    <FormControl className={classes.noLabel}>
                                        <Select
                                            displayEmpty
                                            labelId="select-label"
                                            id="select"
                                            MenuProps={{ classes: { paper: classes.liFontSize } }}
                                            value={otherChoice.label}
                                            input={<CustomInput />}>
                                            <MenuItem key="other choice" disabled value="">
                                                Autre choix
                                            </MenuItem>
                                            {choice.subChoices.map((ch) => (
                                                <MenuItem
                                                    onClick={(event) =>
                                                        handleChangeOtherChoice(event, ch)
                                                    }
                                                    key={ch.label}
                                                    value={ch.label}>
                                                    {ch.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            );
                        }
                        return (
                            <Grid item sm={12} key={choice.label} className={classes.divRelative}>
                                <FormControlLabel
                                    key={choice.label}
                                    label={
                                        <Typography variant="caption">{choice.label}</Typography>
                                    }
                                    value={choice.label}
                                    control={
                                        <Radio
                                            classes={{
                                                root:
                                                    choice.label !== 'REFUSER'
                                                        ? classes.radio
                                                        : classes.radioRejected,
                                                checked: classes.checked
                                            }}
                                            checked={choice.label === decisionChoice.label}
                                            onClick={() => handleRadioClick(choice)}
                                        />
                                    }
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </TableCell>
        ),
        [decisionQuery]
    );
}

export default ActionCell;

ActionCell.propTypes = {
    choices: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            validation: PropTypes.string,
            tags: PropTypes.arrayOf(PropTypes.string)
        })
    ).isRequired,
    decision: PropTypes.object.isRequired
};

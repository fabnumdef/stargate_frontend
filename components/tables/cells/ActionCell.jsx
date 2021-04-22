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

const useStyles = makeStyles((theme) => ({
    divGrid: {
        display: 'grid'
    },
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
    divRelative: {
        position: 'relative'
    }
}));

const CustomInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3)
        }
    },
    input: {
        border: 'none'
    }
}))(InputBase);

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

    const handleRadioClick = (choice) => {
        if (decisionChoice === choice) {
            addDecision({
                choice: initChoice,
                request: { id: decision.request.id },
                id: decision.id
            });
            return;
        }
        if (choice.label === 'Autre choix') {
            addDecision({
                choice: otherChoice,
                request: { id: decision.request.id },
                id: decision.id
            });
            return;
        }
        addDecision({
            choice,
            request: { id: decision.request.id },
            id: decision.id
        });
    };

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
                <div className={classes.divGrid}>
                    {choices.map((choice) => {
                        if (choice.label === 'Autre choix') {
                            return (
                                <div className={classes.divRelative} key={choice.label}>
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
                                </div>
                            );
                        }
                        return (
                            <FormControlLabel
                                key={choice.label}
                                label={choice.label}
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
                        );
                    })}
                </div>
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

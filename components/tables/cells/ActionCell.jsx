import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';

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

export default function ActionCell({ choices, updateAdd }) {
    const classes = useStyles();

    const [otherChoice, setOtherChoice] = useState({
        choice: {
            label: ''
        }
    });

    const [state, setState] = useState({
        choice: {
            label: ''
        }
    });

    const handleRadioClick = (choice) => {
        setState(
            state.choice.label === choice.label
                ? { ...state, choice: { label: '' } }
                : { ...state, choice }
        );
    };

    const handleChangeOtherChoice = (event, choice) => {
        setState({ choice: { label: 'Autre choix' } });
        setOtherChoice({ ...otherChoice, choice });
    };

    useEffect(() => {
        if (state.choice.label === '' && otherChoice.choice.label === '') return;

        if (state.choice.label === 'Autre choix') {
            updateAdd(otherChoice);
            return;
        }
        updateAdd(state);
    }, [state, otherChoice]);

    return (
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
                                            disabled={otherChoice.choice.label === ''}
                                            checked={choice.label === state.choice.label}
                                            onClick={() => handleRadioClick(choice)}
                                        />
                                    }
                                />
                                <FormControl className={classes.noLabel}>
                                    <Select
                                        displayEmpty
                                        labelId="select-label"
                                        id="select"
                                        value={otherChoice.choice.label}
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
                                    checked={choice.label === state.choice.label}
                                    onClick={() => handleRadioClick(choice)}
                                />
                            }
                        />
                    );
                })}
            </div>
        </TableCell>
    );
}

ActionCell.propTypes = {
    choices: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            validation: PropTypes.string,
            tags: PropTypes.arrayOf(PropTypes.string)
        })
    ).isRequired,
    updateAdd: PropTypes.func.isRequired
};

import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(14),
        fontWeight: theme.typography.fontWeightRegular,
        marginBottom: '5px'
    },
    root: {
        width: '100%',
        maxHeight: '35vh',
        overflow: 'auto'
    },
    listItem: {
        borderBottom: '0.25px solid rgba(0, 0, 0, 0.4)'
    }
}));

const AccordionStyled = withStyles(() => ({
    root: {
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0
        },
        '&:before': {
            display: 'none'
        },
        '&$expanded': {
            margin: 'auto'
        }
    },
    expanded: {}
}))(Accordion);

const AccordionSummaryStyled = withStyles(() => ({
    root: {
        border: `1px solid rgba(0, 0, 0, 0.2)`,
        borderRadius: '4px',
        marginBottom: -1,
        minHeight: 56,
        maxHeight: '250px',
        '&$expanded': {
            minHeight: 56,
            maxHeight: '250px'
        },
        '&:hover': {
            border: `1px solid rgba(0, 0, 0, 0.8)`
        }
    },
    content: {
        '&$expanded': {
            margin: '12px 0'
        }
    },
    expanded: {}
}))(AccordionSummary);

const ListStyled = withStyles(() => ({
    padding: {
        paddingTop: '0px',
        paddingBottom: '0px'
    }
}))(List);

export default function ListLieux({
    options,
    label,
    expanded,
    onChange,
    setExpanded,
    defaultChecked
}) {
    const [checked, setChecked] = React.useState(defaultChecked);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        onChange(newChecked.map((place) => place));
    };

    const handleChange = () => () => {
        setExpanded(!expanded);
    };

    const handleDelete = (index) => {
        const newChecked = [...checked];
        newChecked.splice(index, 1);
        setChecked(newChecked);
        onChange(newChecked.map((place) => place));
    };

    const classes = useStyles();

    return (
        <AccordionStyled expanded={expanded} onChange={handleChange()}>
            <AccordionSummaryStyled
                expandIcon={<ExpandMoreIcon />}
                IconButtonProps={{ 'data-testid': `expand-icon-${label}` }}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <div>
                    {!checked.length && (
                        <Typography className={classes.heading}>{label}</Typography>
                    )}
                    {checked.map((place, i) => (
                        <Chip
                            color="primary"
                            variant="outlined"
                            style={{ margin: '2px' }}
                            key={place.id}
                            label={place.label}
                            onDelete={() => handleDelete(i)}
                        />
                    ))}
                </div>
            </AccordionSummaryStyled>
            <AccordionDetails style={{ maxHeight: '220px' }}>
                <ListStyled className={classes.root}>
                    {options.map((place) => {
                        const labelId = `checkbox-list-label-${place.id}`;
                        return (
                            <>
                                <ListItem
                                    key={place.id}
                                    disableRipple
                                    button
                                    onClick={handleToggle(place)}
                                    data-testid={`listitem-${label}-${place.id}`}>
                                    <ListItemIcon>
                                        <Checkbox
                                            color="primary"
                                            edge="start"
                                            checked={checked.indexOf(place) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={place.id} primary={place.label} />
                                </ListItem>
                                <Divider light variant="middle" />
                            </>
                        );
                    })}
                </ListStyled>
            </AccordionDetails>
        </AccordionStyled>
    );
}

ListLieux.defaultProps = {
    defaultChecked: []
};

ListLieux.propTypes = {
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    label: PropTypes.string.isRequired,
    expanded: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    setExpanded: PropTypes.func.isRequired,
    defaultChecked: PropTypes.arrayOf(PropTypes.object)
};

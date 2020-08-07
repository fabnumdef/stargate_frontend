import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    marginBottom: '5px',
  },
  root: {
    width: '100%',
    maxHeight: '35vh',
    overflow: 'auto',
  },
  listItem: {
    backgroundColor: fade(theme.palette.primary.main, 0.02),
  },
}));

const ExpansionPanelStyled = withStyles(() => ({
  root: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
}))(ExpansionPanel);

const ExpansionPanelSummaryStyled = withStyles((theme) => ({
  root: {
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
}))(ExpansionPanelSummary);

const ListStyled = withStyles(() => ({
  padding: {
    paddingTop: '0px',
    paddingBottom: '0px',
  },
}))(List);

export default function ListLieux({
  options, label, expanded, onChange, setExpanded, defaultChecked,
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
    onChange(newChecked.map((place) => place.id));
  };

  const handleChange = () => () => {
    setExpanded(!expanded);
  };

  const handleDelete = (index) => {
    const newChecked = [...checked];
    newChecked.splice(index, 1);
    setChecked(newChecked);
    onChange(newChecked.map((place) => place.id));
  };

  const classes = useStyles();

  return (
    <ExpansionPanelStyled expanded={expanded} onChange={handleChange()}>
      <ExpansionPanelSummaryStyled
        expandIcon={<ExpandMoreIcon />}
        IconButtonProps={{ 'data-testid': `expand-icon-${label}` }}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div>
          <Typography className={classes.heading}>{label}</Typography>
          {checked.map((place) => (
            <Chip
              color="primary"
              style={{ margin: '2px' }}
              key={place.id}
              label={place.label}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </ExpansionPanelSummaryStyled>
      <ExpansionPanelDetails>
        <ListStyled className={classes.root}>
          {options.map((place) => {
            const labelId = `checkbox-list-label-${place.id}`;
            return (
              <ListItem
                className={classes.listItem}
                key={place.id}
                button
                onClick={handleToggle(place)}
                data-testid={`listitem-${label}-${place.id}`}
              >
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
            );
          })}
        </ListStyled>
      </ExpansionPanelDetails>
    </ExpansionPanelStyled>
  );
}

ListLieux.defaultProps = {
  defaultChecked: [],
};

ListLieux.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  setExpanded: PropTypes.func.isRequired,
  defaultChecked: PropTypes.arrayOf(PropTypes.object),
};

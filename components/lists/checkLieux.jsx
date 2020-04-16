// @flow
import React from 'react';

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
    maxHeight: '20vh',
    overflow: 'auto',
  },
  listItem: {
    backgroundColor: fade(theme.palette.primary.main, 0.02),
  },
}));

type ListLieuxProps = {
  lieux: Array<any>,
  label: string,
  name: string,
  expanded: any,
  setValue: any,
  setState: any
};

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

export default function ListLieux(props: ListLieuxProps) {
  const {
    options, label, expanded, onChange, setExpanded,
  } = props;

  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    onChange(newChecked);
  };

  const handleChange = (panel) => () => {
    setExpanded({ ...expanded, [panel]: !expanded[panel] });
  };

  const handleDelete = (index) => {
    const newChecked = [...checked];
    newChecked.splice(index, 1);
    setChecked(newChecked);
    onChange(newChecked);
  };

  const classes = useStyles();

  return (
    <ExpansionPanelStyled expanded={expanded[label]} onChange={handleChange(label)}>
      <ExpansionPanelSummaryStyled
        expandIcon={<ExpandMoreIcon />}
        IconButtonProps={{ 'data-testid': `expand-icon-${label}` }}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div>
          <Typography className={classes.heading}>{label}</Typography>
          {checked.map((lieu) => (
            <Chip
              color="primary"
              style={{ margin: '2px' }}
              key={lieu.value}
              label={lieu.value}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </ExpansionPanelSummaryStyled>
      <ExpansionPanelDetails>
        <ListStyled className={classes.root}>
          {options.map((lieu, index) => {
            const labelId = `checkbox-list-label-${index}`;
            return (
              <ListItem
                className={classes.listItem}
                key={lieu.value}
                button
                onClick={handleToggle(lieu)}
                data-testid={`listitem-${label}-${index}`}
              >
                <ListItemIcon>
                  <Checkbox
                    color="primary"
                    edge="start"
                    checked={checked.indexOf(lieu) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={index} primary={lieu.value} />
              </ListItem>
            );
          })}
        </ListStyled>
      </ExpansionPanelDetails>
    </ExpansionPanelStyled>
  );
}

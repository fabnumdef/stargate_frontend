import React from 'react';
import PropTypes from 'prop-types';
// Import Material
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Header } from '../components';

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: '15vh',
  },
}));

export default function Template({ children }) {
  const classes = useStyles();

  return (
    <div>
      <Header />
      <Box
        className={classes.container}
        mr={{ xs: 4, sm: 12, md: 24 }}
        ml={{ xs: 4, sm: 12, md: 24 }}
      >
        {children}
      </Box>
    </div>
  );
}

Template.propTypes = {
  children: PropTypes.node.isRequired,
};

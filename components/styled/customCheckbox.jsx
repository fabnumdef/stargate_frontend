import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

export default withStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    '&$checked': {
      color: theme.palette.primary.main,
    },
  },
  checked: {},
// eslint-disable-next-line react/jsx-props-no-spreading
}))((props) => <Checkbox color="default" {...props} />);

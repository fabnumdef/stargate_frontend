// @flow
import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

type TabPanelProps = {
  children: any,
  value: number,
  index: number,
  ...
};

export default function TabPanel(props: TabPanelProps) {
  const {
    children, value, index,
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

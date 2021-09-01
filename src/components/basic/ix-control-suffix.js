import React from 'react';
import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: theme.palette.text.secondary,
  },
}));

const IxControlSuffix = ({ control, suffix, controlClassName, suffixClassName }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box className={controlClassName}>{control}</Box>
      <Box className={suffixClassName}>{suffix}</Box>
    </div>
  );
};

export default IxControlSuffix;

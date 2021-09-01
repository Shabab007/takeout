import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexGrow: 1,
  },
  right: { flexGrow: 1 },
}));

const NxtElementSpaceBetween = ({ left, right, leftClassName, rightClassName }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={leftClassName || classes.left}>{left}</div>
      <div className={rightClassName || classes.right}>{right}</div>
    </div>
  );
};

export default NxtElementSpaceBetween;

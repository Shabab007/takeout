import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const NxtTxtApart = ({
  left,
  right,
  leftVariant = 'subtitle1',
  rightVariant = 'subtitle1',
  leftColor = 'textPrimary',
  rightColor = 'textPrimary',
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant={leftVariant} color={leftColor}>
        {left}
      </Typography>
      <Typography variant={rightVariant} color={rightColor}>
        {right}
      </Typography>
    </div>
  );
};

export default NxtTxtApart;

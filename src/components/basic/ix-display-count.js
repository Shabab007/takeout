import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
    marginRight: theme.spacing(1),
    '& .MuiTypography-root': {
      fontWeight: 500
    }
  },
  value: {
    display: 'inline',
  },
  unit: {
    display: 'inline',
  },
}));
const IxDisplayCount = ({ value, unit, itemCalorie }) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <Typography variant="subtitle1" color="textSecondary" className={itemCalorie ? itemCalorie : classes.value}>
        {value}{' '}
      </Typography>
      <Typography variant="subtitle2" color="textSecondary" className={itemCalorie ? itemCalorie : classes.unit}>
        {unit}
      </Typography>
    </div>
  );
};

export default IxDisplayCount;

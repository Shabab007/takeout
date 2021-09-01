import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    lineHeight: '1rem',
    height: '1rem',
    padding: '3px 5px',
    color: theme.palette.text.tag,
    fontWeight: 500,
    border: `1px solid ${theme.palette.text.tag}`,
    borderRadius: theme.shape.borderRadiusPrimary,
  },
}));
const IxTagBordered = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="subtitle1">{children}</Typography>
    </div>
  );
};

export default IxTagBordered;

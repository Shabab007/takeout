import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    lineHeight: '1rem',
    height: '1rem',
    padding: '3px 2.5em',
    color: theme.palette.border.successTag,
    fontWeight: 500,
    border: '1px solid' + theme.palette.border.successTag,
    borderRadius: '1em',
    background: theme.palette.background.successTag,
  },
}));
const ServedTag = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="subtitle1">{children}</Typography>
    </div>
  );
};

export default ServedTag;

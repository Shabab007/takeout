import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    lineHeight: '1rem',
    height: '1rem',
    padding: '2px 4px',
    borderRadius: '2px',
    backgroundColor: theme.palette.background.light,
    '& *': {
      fontSize: '1rem',
      padding: 0,
      margin: 0,
      lineHeight: '1rem',
      float: 'left',
      width: 'auto',
      height: '1rem',
    },
  },
}));

const IxTagVanilla = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="subtitle1" color="primary">
        {children}
      </Typography>
    </div>
  );
};

export default IxTagVanilla;

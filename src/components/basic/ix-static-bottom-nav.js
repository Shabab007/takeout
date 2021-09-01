import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    position: 'fixed',
    bottom: 0,
    width: '90%',
    marginBottom: '1em',
    background: theme.palette.background.default,
    zIndex: theme.zIndex.staticNav,
  },
  content: { flex: 1 },
}));

const StaticBottom = ({ children }) => {
  const classes = useStyles();

  return (
    <Grid container direction="row" className={classes.root}>
      {children}
    </Grid>
  );
};

export default StaticBottom;

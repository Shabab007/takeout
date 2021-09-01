import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    width: '100%',
    position: 'fixed',
    zIndex: theme.zIndex.staticNav,
    boxSizing: 'border-box',
    bottom: 0,
    left: 0,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
}));

const NxtStaticFooter = ({ children }) => {
  const classes = useStyles();
  return <footer className={classes.root}>{children} </footer>;
};

export default NxtStaticFooter;

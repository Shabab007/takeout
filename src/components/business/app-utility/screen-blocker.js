import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(255,255,255,.4)',
    zIndex: theme.zIndex.screenBlocker,
  },
}));

function ScreenBlocker() {
  const classes = useStyles();
  return <div className={classes.root}></div>;
}

export default ScreenBlocker;

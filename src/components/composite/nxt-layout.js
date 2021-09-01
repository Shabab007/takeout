import React from 'react';
import { makeStyles, AppBar, Toolbar, Box } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    width: '100%',
    minHeight: '100vh',
    minWidth: '100%',
    position: 'relative',
  },
  appbarRoot: {
    boxShadow: 'none',
  },
  bottomAppbarRoot: {
    boxShadow: 'none',
    top: 'auto',
    bottom: 0,
  },
  toolbarRoot: {
    backgroundColor: theme.palette.background.default,
  },
  children: {
    height: '100%',
    position: 'relative',
  },
  centeredChildren: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offset: { ...theme.mixins.toolbar, width: '100%' },
}));

const NxtLayout = ({ header, children, footer, childrenCentered = false }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {header && (
        <Box>
          <AppBar position="fixed" classes={{ root: classes.appbarRoot }}>
            <Toolbar classes={{ root: classes.toolbarRoot }}>{header}</Toolbar>
          </AppBar>
          {/* <div className={classes.offset} /> */}
        </Box>
      )}
      {children && (
        <Box className={clsx(classes.children, childrenCentered && classes.centeredChildren)}>
          {header && <div className={classes.offset} />}
          {children}
          {footer && <div className={classes.offset} />}
          {/* {footer && <AppBar></AppBar>} */}
        </Box>
      )}
      {footer && (
        <>
          <AppBar position="fixed" classes={{ root: classes.bottomAppbarRoot }}>
            <Toolbar classes={{ root: classes.toolbarRoot }}>{footer}</Toolbar>
          </AppBar>
          {/* <div className={classes.offset} /> */}
        </>
      )}
    </Box>
  );
};

export default NxtLayout;

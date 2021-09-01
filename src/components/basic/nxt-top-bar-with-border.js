import React from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import { Box, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    borderBottom: '1px solid #E0E0E0',
    display: 'flex',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    width: '101%',
    background: theme.palette.background.default,
    zIndex: theme.zIndex.staticNav,
  },
  content: { flex: 1 },
}));

const NxtTopBarWithBorder = ({ children }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box className={classes.root}>
      <IconButton onClick={() => history.goBack()}>
        <ArrowBackIcon />
      </IconButton>
      <Box className={classes.content}>{children}</Box>
    </Box>
  );
};

export default NxtTopBarWithBorder;

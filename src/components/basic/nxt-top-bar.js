import React from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import { Box, IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import {
  blackLikeBackground,
  yellowBaseColor
} from '../../constants/theme-colors';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    top: 0,
    width: '100%',
    background: theme.palette.background.default,
    zIndex: theme.zIndex.staticNav
  },
  topRowWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: yellowBaseColor
  },
  bottomRow: {
    paddingLeft: theme.spacing(2)
  },
  topRowContent: { flex: 1 },
  bottomBorder: {
    borderBottom: '1px solid #E0E0E0'
  },
  arrowColor: {
    color: blackLikeBackground
  }
}));

const NxtTopBar = ({ children, subTitle, bottomBorder = false }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box className={classes.root}>
      <Box className={classes.topRowWrapper}>
        <IconButton onClick={() => history.goBack()}>
          <ArrowBackIcon className={classes.arrowColor} />
        </IconButton>
        <Box className={classes.topRowContent}>{children}</Box>
      </Box>
      <Box className={classes.bottomRow}>{subTitle}</Box>
      {bottomBorder && <Box className={classes.bottomBorder}></Box>}
    </Box>
  );
};

export default NxtTopBar;

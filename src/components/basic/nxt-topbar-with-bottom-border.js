import React from 'react';
import NxtTopBarItems from '../composite/nxt-top-bar-items.js';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import { Box, IconButton, Grid } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory } from 'react-router-dom';
import NxtDrawer from '../business/drawer-menu/nxt-drawer';
import { redirectToSearch } from '../../services/utility.js';
import {yellowBaseColor} from '../../constants/theme-colors';

const useStyles = makeStyles((theme) => ({
  root: {
    //marginTop: '1em',
    paddingLeft: '1em',
    paddingRight: '1.5em',
    borderBottom: '1px solid #E0E0E0',
    display: 'flex',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    width: '101%',
    marginLeft: '-1em',
    background: yellowBaseColor,
    zIndex: '100',
    '& h6': {
      color: theme.palette.text.commonPrimaryColor,
      marginBottom: '0.5em',
    },
    '& .MuiSvgIcon-root': {
      alignItems: 'center',
      color: theme.palette.text.commonSecondary,
    },
  },
  content: {
    display: 'flex',
    flex: 1,
    marginRight: '2.2em',
    '& .MuiToolbar-root': {
      marginRight: '-0.6em',
    },
    '& .MuiToolbar-gutters': {
      paddingRight: '0',
    },
  },
}));

const OrderTopbarWithBorder = ({ children, isOnlyMenu = true, isBackAro = false }) => {
  const classes = useStyles();
  const history = useHistory();

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const handleDrawerChange = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };

  return (
    <Box className={classes.root}>
      {isBackAro === true ? (
        <IconButton onClick={() => history.goBack()}>
          <ArrowBackIcon />
        </IconButton>
      ) : null}

      {children}
      <Grid container justify="flex-end" className={classes.content}>
        {isOnlyMenu === true ? (
          <IconButton onClick={() => setIsDrawerOpen(true)}>
            <MenuIcon className={classes.menuBtn}></MenuIcon>
          </IconButton>
        ) : (
          <NxtTopBarItems handleSearchButton={() => redirectToSearch(history)}></NxtTopBarItems>
        )}
      </Grid>
      <NxtDrawer isOpen={isDrawerOpen} handleChange={handleDrawerChange}></NxtDrawer>
    </Box>
  );
};

export default OrderTopbarWithBorder;

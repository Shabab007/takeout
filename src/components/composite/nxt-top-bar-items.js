import React, { useState } from 'react';
import { IconButton, InputBase, Toolbar, Typography } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';

import { connect } from 'react-redux';

// import { setDisplayOrder } from '../../actions/cart';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
// import AccessTimeIcon from '@material-ui/icons/AccessTime';

import { withRouter } from 'react-router-dom';
import NxtDrawer from '../business/drawer-menu/nxt-drawer';
import { redirectToOrderHome } from '../../services/utility'; //redirectToPackageMenuTimer
import {blackLikeBackground} from '../../constants/theme-colors';
const useStyles = makeStyles((theme) => ({
  root: { display: 'flex' },
  title: { width: '100%' },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flexGrow: 1,
  },

  iconButtons: {
    color: theme.palette.text.secondary,
  },
  search: {
    flexGrow: 1,
    position: 'relative',
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadiusPrimary,
    marginLeft: 0,
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    right: 0,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: { float: 'right', color: 'inherit' },
  inputInput: {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadiusPrimary,
    // vertical padding + font size from searchIcon
    paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    backgroundColor: fade(theme.palette.background.light, 0),
    // width: '0ch',
    // '&:focus': {
    //   width: '100%',
    //   backgroundColor: fade(theme.palette.background.light, 0.15),
    // },
  },
  topbarIcon: {color: blackLikeBackground},
}));

const NxtTopBarItems = ({
  history,
  title,
  titleAlignment = 'center',
  handleMenu,
  handleSearchButton,
  handleSearch,
  // setDisplayOrder,
  // allYouCanEatTimer,
  // allYouCanDrinkTimer,
}) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerChange = (isOpen) => {
    setIsDrawerOpen(isOpen);
  };
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    handleSearch(event.target.value);
  };

  return (
    <Toolbar className={classes.root}>
      <div className={classes.title}>
        <Typography align={titleAlignment} variant="h6">
          {title}
        </Typography>
      </div>
      <div className={classes.actionButtons}>
        <IconButton
          edge="start"
          className={classes.iconButtons}
          aria-label="open drawer"
          onClick={() => setIsDrawerOpen(true)}
        >
          <MenuIcon className={classes.topbarIcon}/>
        </IconButton>

        <IconButton
          edge="start"
          className={classes.iconButtons}
          color="inherit"
          aria-label="currency icon button"
          onClick={() => redirectToOrderHome(history)}
        >
          <Typography className={classes.topbarIcon} variant="h5">
            ￥
          </Typography>
        </IconButton>

        {/* {(allYouCanEatTimer || allYouCanDrinkTimer) && (
          <IconButton
            edge="start"
            className={classes.iconButtons}
            color="inherit"
            aria-label="timer icon button"
            onClick={() => {
              redirectToPackageMenuTimer(history);
            }}
          >
            <AccessTimeIcon size="small" />
          </IconButton>
        )} */}

        {handleSearchButton ? (
          <IconButton
            edge="start"
            className={classes.iconButtons}
            color="inherit"
            aria-label="open drawer"
            onClick={handleSearchButton}
          >
            <SearchIcon className={classes.topbarIcon}/>
          </IconButton>
        ) : (
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={searchText}
              onChange={handleSearchChange}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        )}
      </div>
      <NxtDrawer
        isOpen={isDrawerOpen}
        handleChange={handleDrawerChange}
      ></NxtDrawer>
    </Toolbar>
  );
};

// const mapDispatchToProps = {
//   setDisplayOrder,
// };

// const mapStateToProps = (state) => {
//   const { allYouCanEatTimer, allYouCanDrinkTimer } = state.cart;
//   return { allYouCanEatTimer, allYouCanDrinkTimer };
// };

export default withRouter(connect(null, null)(NxtTopBarItems));

import React from 'react';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import { Avatar, withStyles, Menu, MenuItem } from '@material-ui/core';
import RestaurantOutlinedIcon from '@material-ui/icons/RestaurantOutlined';

import { fetchLanguages, selectLanguageCode } from '../language-selector/languagesSlice';
import { fetchMenus, fetchRecommendedFoodItems } from '../menu/menuSlice';
import { redirectToMenu, redirectToOrderHome } from '../../../services/utility';
import FlagIcons from '../../../assets/imgs/flags';
import { yellowBaseColor, blackLikeBackground } from '../../../constants/theme-colors';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: `${theme.zIndex.drawer} !important`,
  },
  styledMenu: { zIndex: `${theme.zIndex.menuOnDrawer} !important` },
  drawerContainer: {},
  itemsContainer: {
    width: '85vw',
    maxWidth: 300,
  },
  avatarWrapper: {
    backgroundColor: yellowBaseColor,
    color: blackLikeBackground,
    paddingTop: theme.spacing(3),
    borderBottom: '1px solid RGB(225,225,225)',
  },
  imageWrapper: {
    display: 'block',
  },
  avatar: {
    color: theme.palette.primary.main,
    backgroundColor: blackLikeBackground,
    width: '50px',
    height: '50px',
  },
  userName: {
    color: blackLikeBackground,
    fontSize: '16px',
  },
  userEmail: {
    color: 'rgb(255,190,190)',
  },
  languageTextRoot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageName: {
    fontWeight: 500,
  },
  langChangeLabel: {
    color: theme.palette.primary.main,
    fontSize: '12px',
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    zIndex: '9999 !important',
    width: 220,
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      // backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        // color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const NxtDrawer = ({ isOpen, handleChange, history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation(['common']);
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const languages = useSelector((state) => state.language.data);
  const selectedLanguageCode = useSelector((state) => state.language.code);

  const [langChangeMenuAnchorEl, setLangChangeMenuAnchorEl] = React.useState(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState(null);

  React.useEffect(() => {
    if (!languages.length) {
      dispatch(fetchLanguages());
    }
  }, [languages, dispatch]);

  React.useEffect(() => {
    if (languages && selectedLanguageCode) {
      // eslint-disable-next-line eqeqeq
      setSelectedLanguage(languages.find((language) => language.value == selectedLanguageCode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLanguageChangeBtnClick = (event) => {
    setLangChangeMenuAnchorEl(event.currentTarget);
  };

  const handleLangChangeMenuClose = () => {
    setLangChangeMenuAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    const langCode = language.value;
    i18n.changeLanguage(langCode);
    dispatch(selectLanguageCode(langCode));
    dispatch(fetchMenus())
    dispatch(fetchRecommendedFoodItems())
    handleLangChangeMenuClose();
  };

  const handleDrawerClose = (event) => {
    handleChange(false);
  };

  const generateItems = () => (
    <div className={clsx(classes.itemsContainer)} role="presentation">
      <List className={classes.avatarWrapper}>
        <ListItem>
          <ListItemIcon>
            <Avatar className={classes.avatar}>
              <PersonOutlineIcon style={{ fontSize: '1.5em' }} />
            </Avatar>
          </ListItemIcon>
        </ListItem>

        <ListItem>
          <ListItemText
            classes={{ primary: classes.userName, secondary: classes.userEmail }}
            primary={t('hamburgerGuestTitle')}
          />
        </ListItem>
        <div className="bottomStyle"></div>
      </List>

      <List>
        {/* language */}

        <ListItem
          button
          onClick={(event) => handleLanguageChangeBtnClick(event)}
          aria-controls="lang-change-menu"
          aria-haspopup="true"
        >
          <ListItemIcon>
            {selectedLanguage ? <img alt="" className={classes.iconImg} src={FlagIcons[selectedLanguage.icon]} /> : ''}
          </ListItemIcon>
          <ListItemText
            classes={{
              root: classes.languageTextRoot,
              primary: classes.languageName,
              //secondary: classes.langChangeLabel,
            }}
            primary={selectedLanguage ? t(selectedLanguage.name) : ''}
            secondary={t('mnChange')}
          />
        </ListItem>

        <StyledMenu
          id="lang-change-menu"
          anchorEl={langChangeMenuAnchorEl}
          // keepMounted
          open={Boolean(langChangeMenuAnchorEl)}
          onClose={handleLangChangeMenuClose}
          PopoverClasses={{ root: classes.styledMenu }}
        >
          {languages.map((language) => {
            return (
              <StyledMenuItem key={language.value} onClick={() => handleLanguageChange(language)}>
                <ListItemIcon>
                  <img alt="flag" className={classes.iconImg} src={language ? FlagIcons[language.icon] : ''} />
                </ListItemIcon>
                <ListItemText primary={t(language.name)} />
              </StyledMenuItem>
            );
          })}
        </StyledMenu>
      </List>

      <Divider />

      <List>
        <ListItem
          button
          onClick={() => {
            redirectToMenu(history);
          }}
        >
          <ListItemIcon>
            <RestaurantOutlinedIcon></RestaurantOutlinedIcon>
          </ListItemIcon>
          <ListItemText
            classes={{
              root: classes.languageTextRoot,
              primary: classes.languageName,
            }}
            primary={t('navBottomMenu')}
          />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            history.push(`/recommended`);
          }}
        >
          <ListItemIcon>
            <RestaurantOutlinedIcon></RestaurantOutlinedIcon>
          </ListItemIcon>
          <ListItemText
            classes={{
              root: classes.languageTextRoot,
              primary: classes.languageName,
            }}
            primary={t('Recommended Menu')}
          />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            redirectToOrderHome(history);
          }}
        >
          <ListItemIcon>
            <ListAltOutlinedIcon></ListAltOutlinedIcon>
          </ListItemIcon>
          <ListItemText
            classes={{
              root: classes.languageTextRoot,
              primary: classes.languageName,
            }}
            primary={t('navBottomOrder')}
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <SwipeableDrawer
        classes={{ root: classes.root, paper: classes.drawerContainer }}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        anchor={'right'}
        open={isOpen}
        onClose={(e) => handleDrawerClose(e)}
        onOpen={(e) => {
          handleChange(true);
        }}
      >
        {generateItems()}
      </SwipeableDrawer>
    </div>
  );
};

export default withRouter(NxtDrawer);

import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { blueColor, whiteBaseColor } from '../../constants/theme-colors';
import { smallFont } from '../../constants/theme-font-size';
import { Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  menusRoot: {
    '& .MuiDrawer-paperAnchorLeft': {
      backgroundColor: blueColor,
    },
  },
  ixDrawer: {
    '& .MuiPaper-root': {
      backgroundColor: blueColor,
    },
  },
  ixDrawerClose: {
    textAlign: 'right',
    marginRight: '0.5em',
  },

  list: {
    width: 280,
    color: whiteBaseColor,
    '& .MuiListItemIcon-root': {
      color: whiteBaseColor,
      paddingLeft: '0.5em',
    },
  },
  fullList: {
    width: 'auto',
  },
  listUserInfo: {
    marginTop: '1em',
  },
  avatar: {
    fontSize: '4em',
    marginTop: '2px',
  },
  username: {
    marginLeft: '1em',
    color: whiteBaseColor,
    '& .MuiTypography-root': {
      fontWeight: '500',
      fontSize: '1.2em',
      marginTop: '-1em',
    },
  },
  useremail: {
    '& .MuiTypography-root': {
      fontSize: smallFont,
      marginTop: '-3.5em',
      marginLeft: '3em',
    },
  },
  useremailbtn: {
    margin: '0',
    padding: '0',
  },
  menusLists: {
    '& .MuiListItem-root': {
      marginBottom: '0.5em',
    },
    '& .MuiTypography-root': {
      marginLeft: '-1.5em',
    },
    '& a': {
      color: whiteBaseColor,
      textDecoration: 'none',
      marginLeft: '-1.5em',
    },
  },
  languageRright: {
    textAlign: 'right',
    marginTop: '-3em',
    '& a': {
      marginLeft: '11em',
      fontSize: smallFont,
      paddingBottom: '0.5em',
      marginTop: '-0.5',
    },
  },
});

function IxMenuDrawer({ openText = 'Menus', userName = 'John Doe', userEmail = 'johndoe@gmail.com' }) {
  const classes = useStyles();
  const { t } = useTranslation(['common']);

  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
      <List className={classes.ixDrawerClose}>
        <Icon onClick={toggleDrawer(anchor, false)}>close</Icon>
      </List>

      <List className={classes.listUserInfo}>
        <ListItem button key={1}>
          <ListItemIcon>
            <AccountCircleIcon className={classes.avatar}></AccountCircleIcon>
          </ListItemIcon>
          <ListItemText className={classes.username} primary={userName} />
        </ListItem>
        <ListItem className={classes.useremailbtn} button key={2}>
          <ListItemIcon></ListItemIcon>
          <ListItemText className={classes.useremail} primary={userEmail} />
        </ListItem>
      </List>
      <Divider />
      <List className={classes.menusLists}>
        <ListItem button key={1}>
          <ListItemIcon>
            <Icon>flag</Icon>
          </ListItemIcon>
          <ListItemText primary={t('mnLanguage')} />
        </ListItem>

        <ListItem className={classes.languageRright} button key={2}>
          <ListItemIcon></ListItemIcon>
          <Link to="/">{t('mnChange')}</Link>
        </ListItem>
      </List>
      <Divider />
      <List className={classes.menusLists}>
        <ListItem>
          <ListItemIcon>
            <Icon>flag</Icon>
          </ListItemIcon>
          <Link to="/">{t('mnHome')}</Link>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Icon>flag</Icon>
          </ListItemIcon>
          <Link to="/">{t('mnMenu')}</Link>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Icon>flag</Icon>
          </ListItemIcon>
          <Link to="/">{t('mnUserInfo')}</Link>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Icon>flag</Icon>
          </ListItemIcon>
          <Link to="/">{t('mnStaffCall')}</Link>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Icon>flag</Icon>
          </ListItemIcon>
          <Link to="/">{t('mnOrders')}</Link>
        </ListItem>
      </List>
      <Divider />
      <List className={classes.menusLists}>
        <ListItem>
          <ListItemIcon>
            <Icon>flag</Icon>
          </ListItemIcon>
          <Link to="/">{t('mnSettings')}</Link>
        </ListItem>
      </List>
      <Divider />
      <List className={classes.menusLists}>
        <ListItem>
          <ListItemIcon>
            <Icon>flag</Icon>
          </ListItemIcon>
          <Link to="/">{t('mnCheckOut')}</Link>
        </ListItem>
      </List>
    </div>
  );
  return (
    <div className={classes.menusRoot}>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{openText}</Button>
          <SwipeableDrawer
            className={classes.ixDrawer}
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default IxMenuDrawer;

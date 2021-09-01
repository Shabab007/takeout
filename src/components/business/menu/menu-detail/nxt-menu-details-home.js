import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core';

import IxTxtBox from '../../../basic/ix-txt-box';
import NxtTopBarItems from '../../../composite/nxt-top-bar-items';
import IxBottomNav from '../../../basic/ix-bottom-nav';
import NxtTopBar from '../../../basic/nxt-top-bar.js';

import {
  formatTime,
  isOrderedPackageMenuExpired,
  redirectToMenu,
  redirectToSearch,
} from '../../../../services/utility';
import { IMAGE_URL } from '../../../../constants/ix-image-links';

import styles from './style.js';
import clsx from 'clsx';
import NxtMenuView from './nxt-menu-view.js';
import { useSnackbar } from 'notistack';
import snackbarTypes from '../../../../constants/snackbar-types';

function MenuDetailsHome(props) {
  const {
    appState,
    menuState,
    match,
    history,
    handleAddMenuIdToOrderState,
    setCategoryIndex,
    cart,
    language,
  } = props;
  const classes = styles();
  const { t } = useTranslation(['menus']);
  const { enqueueSnackbar } = useSnackbar();

  const { orderedPackageMenus } = cart;

  var companyId, companyConfigData, menus, prevSelectedCategoryId, languageCode;
  try {
    const { restaurantTable, companyConfig } = appState;
    const {
      menus: menuInState,
      prevSelectedCategoryId: categoryId,
    } = menuState;
    companyId = restaurantTable.data.company.id;
    prevSelectedCategoryId = categoryId;
    menus = menuInState.data;
    companyConfigData = companyConfig.data;
    languageCode = language.code;
  } catch (e) {
    console.warn(e);
  }

  useEffect(() => {
    if (!menus || !menus.length) {
      redirectToMenu(history);
    }
  }, [menus, match, history]);

  const menuId = match.params.id;

  if (!menuId) {
    redirectToMenu(history);
  }

  const handleDisplayOrderedPackageMenuExpiredNotification = (name) => {
    const menuName = name
      ? typeof name === 'string'
        ? name
        : name[languageCode]
      : '';
    enqueueSnackbar(
      {
        title: t('menus:LastTimeToOrderPassedMessage', { name: menuName }),
        message: '',
        variant: 'outlined',
        severity: snackbarTypes.error,
      },
      {
        persist: true,
        // autoHideDuration: 6000,
      },
    );
  };

  const menu = menus ? menus.find((menu) => menu.id === parseInt(menuId)) : {};

  if (!menu) {
    redirectToMenu(history);
    return '';
  }

  if (isOrderedPackageMenuExpired(menu.id, orderedPackageMenus)) {
    handleDisplayOrderedPackageMenuExpiredNotification(menu.name);
    redirectToMenu(history);
  }

  const {
    name: menuName,
    photo,
    optSlotTimeStart,
    optSlotTimeEnd,
    isPackage,
    // subMenus,
    isPackageMenuOrdered,
  } = menu;
  const menuImageSrc = photo
    ? IMAGE_URL + companyId + '/images/' + photo
    : null;

  return (
    <div
      className={clsx(
        classes.root,
        isPackage && !isPackageMenuOrdered && classes.packageMenuPreOrderStyle,
      )}
    >
      {/* Header  */}

      <Grid container className={classes.headerItem}>
        <div className={classes.topBarIconButtons}>
          <NxtTopBar>
            <NxtTopBarItems
              handleSearchButton={() => redirectToSearch(history)}
            ></NxtTopBarItems>
          </NxtTopBar>
        </div>

        <Grid container direction="row">
          <Grid container item xs={3}>
            <Avatar src={menuImageSrc} alt={t('common:menuImageAlt')} />
          </Grid>
          <Grid
            className={classes.menuTitleRight}
            container
            justify="flex-start"
            item
            xs={5}
          >
            <IxTxtBox
              primary={menuName || ''}
              secondary={`${formatTime(optSlotTimeStart)} ${t(
                'to',
              )} ${formatTime(optSlotTimeEnd)}`}
              primaryVariant="h6"
              secondaryVariant="caption"
              align="left"
            ></IxTxtBox>
          </Grid>
        </Grid>
      </Grid>

      {/* Body */}

      <Box className={classes.bodyCat}>
        <NxtMenuView
          menu={menu}
          prevSelectedCategoryId={prevSelectedCategoryId}
          handleAddMenuIdToOrderState={handleAddMenuIdToOrderState}
          setCategoryIndex={setCategoryIndex}
          companyConfigData={companyConfigData}
        ></NxtMenuView>
      </Box>

      {/* Bottom Nav */}
      {/* {isPackage && subMenus && <NxtPackageSubMenuOverlay />} */}

      <Box className={classes.bottomNav}>
        <IxBottomNav props={props} className={classes.bottomNav}></IxBottomNav>
      </Box>
    </div>
  );
}

export default MenuDetailsHome;

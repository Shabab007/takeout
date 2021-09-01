import React, { useState } from 'react';
import { connect,useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { chunk } from 'lodash';
import SwipeableViews from 'react-swipeable-views';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core';
import { Button, Typography } from '@material-ui/core';

import IxTxtBox from '../../basic/ix-txt-box';
import IxTabMenu from '../../basic/ix-tab-menu';

import { IMAGE_URL } from '../../../constants/ix-image-links';
import nxtMenuTypes from '../../../constants/nxt-menu-types';

import { setFoodItem } from '../../../actions/food-detail-actions';

import NxtMenuItemCard from './nxt-card-menu-item';
import NxtItemCard from './nxt-card-item';

import {
  getNameInUserSelectedLanguage,
  redirectToFoodDetail,
  redirectToMenu,
  isOrderedPackageMenuExpired
} from '../../../services/utility.js';

import styles from './style.js';
import companyConfigEnum from '../../../constants/company-config-enum';
import { setTabMenuSelectedCategory, setSelectedTabMenu } from './menuSlice';
import snackbarTypes from '../../../constants/snackbar-types';
import apiRequestStatusEnum from '../../../constants/api-request-status-enum';

const mapDispatchToProps = dispatch => {
  return {
    setTabMenuSelectedCategory: index => {
      dispatch(setTabMenuSelectedCategory(index));
    },
    setSelectedTabMenu: index => {
      dispatch(setSelectedTabMenu(index));
    }
  };
}; // of food detail store

function TabMenusView(props) {
  const classes = styles();
  const { t } = useTranslation(['menus']);
  const { enqueueSnackbar } = useSnackbar();

  const { history, setTabMenuSelectedCategory, setSelectedTabMenu } = props;

  let restaurantTableData, companyConfigData, companyId, menuList, languageCode;
  let { order, orderedPackageMenus } = props.props;
  let menuRearrangeStatus;
  let menuTabs = [];
  const prevSelectedTabMenu = useSelector((state) => state.menuState.prevSelectedTabMenu);

  const handleDisplayOrderedPackageMenuExpiredNotification = name => {
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
        severity: snackbarTypes.error
      },
      {
        persist: true
        // autoHideDuration: 6000,
      }
    );
  };

  const handleViewAllMenuItems = (menuId, index) => {
    setTabMenuSelectedCategory(index);
    props.props.handleAddMenuIdToOrderState(menuId);
    redirectToMenu(history, menuId);
  };

  const renderSubMenuContent = menu => {
    return (
      <div className={classes.menuCard}>
        <Grid className={classes.menuCardWrapper} container direction='row'>
          {menu.subMenus && menu.subMenus.length ? (
            menu.subMenus.map((subMenu, key) => {
              const { photo, foodCategories } = subMenu;
              let foodItemCount = 0;
              if (foodCategories.length !== 0) {
                foodCategories.map(category => {
                  let notPkgItems = category?.foodItems?.filter(
                    e =>
                      e.itemCode !==
                      nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE
                  );
                  foodItemCount += notPkgItems.length;
                });
              }

              const imageSrc = photo
                ? IMAGE_URL + companyId + '/images/' + photo
                : null;
              return (
                <Grid
                  onClick={() =>
                    isOrderedPackageMenuExpired(menu.id, orderedPackageMenus)
                      ? handleDisplayOrderedPackageMenuExpiredNotification(
                        menu.name
                      )
                      : handleViewAllMenuItems(menu.id, key)
                  }
                  key={key}
                  className={classes.menuCardItem}
                  container
                  item
                  xs={6}
                >
                  <NxtMenuItemCard
                    size={12}
                    img={imageSrc}
                    imgAlt={t('common:menuImageAlt')}
                    menuCaption
                    subtitle1={
                      subMenu.name && subMenu.name.length > 10
                        ? subMenu.name.substring(0, 10) + '..'
                        : subMenu.name
                    }
                    foodItemCount={foodItemCount}
                  ></NxtMenuItemCard>
                </Grid>
              );
            })
          ) : (
            <Grid container alignItems='center'>
              {t('menus:NoMenuToShow')}
            </Grid>
          )}
        </Grid>
      </div>
    );
  };

  const renderMenuCategoryContent = menu => {
    return (
      <div className={classes.menuCard}>
        <Grid className={classes.menuCardWrapper} container direction='row'>
          {menu.foodCategories && menu.foodCategories.length ? (
            menu.foodCategories.map((foodCategory, key) => {
              if (foodCategory.isPackageDefault == true) return;
              const { photo } = foodCategory;
              const imageSrc = photo
                ? IMAGE_URL + companyId + '/images/' + photo
                : null;
              return (
                <Grid
                  onClick={() =>
                    isOrderedPackageMenuExpired(menu.id, orderedPackageMenus)
                      ? handleDisplayOrderedPackageMenuExpiredNotification(
                        menu.name
                      )
                      : handleViewAllMenuItems(menu.id, key)
                  }
                  key={key}
                  className={classes.menuCardItem}
                  container
                  item
                  xs={6}
                >
                  <NxtMenuItemCard
                    size={12}
                    img={imageSrc}
                    imgAlt={t('common:menuImageAlt')}
                    subtitle1={
                      foodCategory.name && foodCategory.name.length > 10
                        ? foodCategory.name.substring(0, 10) + '..'
                        : foodCategory.name ? foodCategory.name : ""
                    }
                    menuCaption
                    foodItemCount={foodCategory?.foodItems?.length}
                  ></NxtMenuItemCard>
                </Grid>
              );
            })
          ) : (
            <Grid container alignItems='center'>
              {t('menus:NoMenuToShow')}
            </Grid>
          )}
        </Grid>
      </div>
    );
  };

  try {
    const { appState, menuState, language } = props.props;
    restaurantTableData = appState.restaurantTable.data;
    companyConfigData = appState.companyConfig.data;
    companyId =
      restaurantTableData &&
      restaurantTableData.company &&
      restaurantTableData.company.id;

    menuList = menuState.menus.data;

    menuList.map(menu => {
      const label = menu.name;
      let content =
        menu.subMenus && menu.subMenus.length > 0
          ? renderSubMenuContent(menu)
          : renderMenuCategoryContent(menu);
      menuTabs.push({ label, content });
    });

    menuRearrangeStatus = menuState.menuRearrangeStatus;
    languageCode = language.code;
  } catch (e) {
    console.warn(e);
  }

  // React.useEffect(() => {
  //   let index = categoryIndex;
  // },[categoryIndex])

  if (
    !(
      menuRearrangeStatus === apiRequestStatusEnum.succeeded ||
      menuRearrangeStatus === apiRequestStatusEnum.loadedFromCache
    )
  ) {
    return (
      <Grid container alignItems='center'>
        {t('common:loading-text')}
      </Grid>
    );
  }

  return (
    <div className={classes.menuCard}>
      {menuTabs && (
        <IxTabMenu
          itemList={menuTabs}
          initialOpenTab={prevSelectedTabMenu}
          setCategoryIndex={setSelectedTabMenu}
          resetCategoryIndex={false}
        ></IxTabMenu>
      )}
    </div>
  );
}

export default withRouter(connect(null, mapDispatchToProps)(TabMenusView));

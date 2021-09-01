import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { chunk } from 'lodash';
import SwipeableViews from 'react-swipeable-views';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core';
import { Button, Typography } from '@material-ui/core';

import IxTxtBox from '../../basic/ix-txt-box';
import { IMAGE_URL } from '../../../constants/ix-image-links';

import { setFoodItem } from '../../../actions/food-detail-actions';

import NxtMenuItemCard from './nxt-card-menu-item';
import NxtItemCard from './nxt-card-item';

import {
  getNameInUserSelectedLanguage,
  redirectToFoodDetail,
  redirectToMenu,
  isOrderedPackageMenuExpired,
} from '../../../services/utility.js';

import styles from './style.js';
import companyConfigEnum from '../../../constants/company-config-enum';
import { setSelectedCategory } from './menuSlice';
import nxtMenuTypes from '../../../constants/nxt-menu-types';
import snackbarTypes from '../../../constants/snackbar-types';
import apiRequestStatusEnum from '../../../constants/api-request-status-enum';

const mapDispatchToProps = { setFoodItem, setSelectedCategory }; // of food detail store

function MultipleMenusView(props) {
  const classes = styles();
  const { t } = useTranslation(['menus']);
  const { enqueueSnackbar } = useSnackbar();

  const { history, setFoodItem, setSelectedCategory } = props;

  const foodItemsCountToDisplay = 15;
  const foodItemsCountInGroup = 3;

  let restaurantTableData, companyConfigData, companyId, menuList, languageCode;
  let { order, orderedPackageMenus } = props.props;
  let menuRearrangeStatus;
  try {
    const { appState, menuState, language } = props.props;
    restaurantTableData = appState.restaurantTable.data;
    companyConfigData = appState.companyConfig.data;
    companyId =
      restaurantTableData &&
      restaurantTableData.company &&
      restaurantTableData.company.id;

    menuList = menuState.menus.data;
    menuRearrangeStatus = menuState.menuRearrangeStatus;
    languageCode = language.code;
  } catch (e) {
    console.warn(e);
  }

  const getPreviousOrderedItems = () => {
    let orderedItems = [],
      previousOrderedItemOriginals = [];
    if (order && order.orderMenus) {
      order.orderMenus.map((menu) => {
        const modifiedOrderItems = menu.orderItems.map((item) => {
          return {
            ...item,
            menuId: menu.id,
            isPackage: menu.isPackage,
            packagePrice: menu.packagePrice,
            menuName: menu.name || item.menuName,
          };
        });
        orderedItems = [...orderedItems, ...modifiedOrderItems];
        return menu;
      });
    }

    orderedItems.filter(
      (item) =>
        item.itemCode !== nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE,
    );

    let originalFoodItemList = [];
    menuList.map((menu) => {
      let foodCategories = menu['foodCategories'];
      if (foodCategories && foodCategories.length) {
        foodCategories
          .filter((category) => !category.isPackageDefault)
          .map((category) => {
            if (category.foodItems.length > 0) {
              category.foodItems.map((item) => {
                originalFoodItemList.push(item);
                return item;
              });
            }
            return category;
          });
      }
      return menu;
    });

    orderedItems.map((orderedItem) => {
      const item = originalFoodItemList.find(
        (originalItem) => orderedItem.foodItemId === originalItem.id,
      );
      if (item) {
        previousOrderedItemOriginals.push(item);
      }
      return orderedItem;
    });

    previousOrderedItemOriginals = previousOrderedItemOriginals.filter(
      (foodItem) =>
        !isOrderedPackageMenuExpired(foodItem.menuId, orderedPackageMenus),
    );

    return previousOrderedItemOriginals;
  };

  let previousOrderedItems = getPreviousOrderedItems();

  const handleViewAllMenuItems = (menuId) => {
    setSelectedCategory(0);
    props.props.handleAddMenuIdToOrderState(menuId);
    redirectToMenu(history, menuId);
  };

  const handleFoodItemClick = (item, menuId) => {
    setFoodItem(item);
    props.props.handleAddMenuIdToOrderState(menuId);
    redirectToFoodDetail(history);
  };

  const menuListExcludedPackageAndWithChild = menuList.filter(
    (menu) => !menu.isPackage && !menu.subMenus,
  );

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

  const foodItemListView = menuListExcludedPackageAndWithChild.length ? (
    <div className={classes.catCard}>
      {menuListExcludedPackageAndWithChild.map((menu, key) => {
        let foodCategories = menu['foodCategories'];
        // while(foodCategories.subFoodCategories){
        //   foodCategories = foodCategories.subFoodCategories;
        // }
        let dataFoodItems = [];

        function findFoodItems(foodCategories) {
          foodCategories.map((category) => {
            if (category.subFoodCategories) {
              // food item can be mapped with only leaf level menus
              findFoodItems(category.subFoodCategories);
            } else if (category.foodItems && category.foodItems.length) {
              dataFoodItems = [...dataFoodItems, ...category.foodItems];
            }
            return category;
          });
        }

        if (foodCategories && foodCategories.length) {
          const categories = foodCategories.filter(
            (category) => !category.isPackageDefault,
          );

          findFoodItems(categories);
        }

        // if (foodCategories && foodCategories.length) {
        //   foodCategories
        //     .filter((category) => !category.isPackageDefault)
        //     .map((category) => {
        //       if (category.subCategories)
        //         if (category.foodItems && category.foodItems.length) {
        //           category.foodItems.map((item) => {
        //             dataFoodItems.push(item);
        //             return item;
        //           });
        //         }
        //       return category;
        //     });
        // }

        let groupedFoodItems = [];
        if (dataFoodItems.length) {
          let displayFoodItems = dataFoodItems.slice(
            0,
            foodItemsCountToDisplay,
          );
          if (displayFoodItems.length) {
            displayFoodItems[displayFoodItems.length] = { viewAll: true };
          }
          groupedFoodItems = chunk(displayFoodItems, foodItemsCountInGroup);
        }

        return (
          <Box key={menu.id}>
            <Grid container direction="row" alignItems="center">
              <Grid className={classes.menuTitleGd} container item xs={6}>
                <IxTxtBox
                  primary={menu.name}
                  primaryVariant="h5"
                  align="left"
                  reversed={false}
                ></IxTxtBox>
              </Grid>
              <Grid justify="flex-end" container item xs={6}>
                <div className={classes.links}>
                  <Button
                    onClick={() =>
                      isOrderedPackageMenuExpired(menu.id, orderedPackageMenus)
                        ? handleDisplayOrderedPackageMenuExpiredNotification(
                            menu.name,
                          )
                        : handleViewAllMenuItems(menu.id)
                    }
                  >
                    {t('viewAll')}
                  </Button>
                </div>
              </Grid>
            </Grid>
            <Grid
              className={classes.foodItemListWrapper}
              justify="flex-start"
              container
              direction="row"
            >
              <SwipeableViews enableMouseEvents resistance>
                {groupedFoodItems.map((groupedItem, index) => {
                  return (
                    <div key={index} className={classes.swipableViewRow}>
                      {groupedItem.map((foodItem, index) => {
                        const { photo } = foodItem;
                        const imageSrc = photo
                          ? IMAGE_URL + companyId + '/images/' + photo
                          : null;
                        const foodItemCard = foodItem.viewAll ? (
                          <Grid
                            key={index}
                            container
                            item
                            xs={4}
                            className={classes.itemCardWrapper}
                          >
                            <div className="view-all-wrapper">
                              <div
                                className="view-all"
                                onClick={() =>
                                  isOrderedPackageMenuExpired(
                                    menu.id,
                                    orderedPackageMenus,
                                  )
                                    ? handleDisplayOrderedPackageMenuExpiredNotification(
                                        menu.name,
                                      )
                                    : handleViewAllMenuItems(menu.id)
                                }
                              >
                                <Typography>{t('viewAll')}</Typography>
                              </div>
                            </div>
                          </Grid>
                        ) : (
                          <Grid
                            key={index}
                            className={classes.itemCardWrapper}
                            container
                            item
                            xs={4}
                            onClick={() =>
                              isOrderedPackageMenuExpired(
                                menu.id,
                                orderedPackageMenus,
                              ) || foodItem.isSoldOut
                                ? handleDisplayOrderedPackageMenuExpiredNotification(
                                    menu.name,
                                  )
                                : handleFoodItemClick(foodItem, menu.id)
                            }
                          >
                            <NxtItemCard
                              size={12}
                              img={imageSrc}
                              imgAlt="top menu"
                              captionAlign="center"
                              captionVariant="subtitle2"
                              subtitle1={
                                foodItem.name && foodItem.name.length > 10
                                  ? foodItem.name.substring(0, 10) + '..'
                                  : foodItem.name
                              }
                              tags={foodItem.prepareDuration + t('menus:Mins')}
                              isPackage={foodItem.isPackage}
                              price={foodItem.price}
                              priceIncludingTax={foodItem.priceIncludingTax}
                              priceDisplayOption={
                                companyConfigData[
                                  companyConfigEnum.PRICE_DISPLAY_OPTION
                                ]
                              }
                              isSoldOut={foodItem.isSoldOut}
                            ></NxtItemCard>
                          </Grid>
                        );
                        return foodItemCard;
                      })}
                    </div>
                  );
                })}
              </SwipeableViews>
            </Grid>
          </Box>
        );
      })}
    </div>
  ) : (
    ''
  );

  const menuView = menuList.length ? (
    menuList.map((menu, key) => {
      const { photo } = menu;
      const imageSrc = photo
        ? IMAGE_URL + companyId + '/images/' + photo
        : null;
      return (
        <Grid
          onClick={() =>
            isOrderedPackageMenuExpired(menu.id, orderedPackageMenus)
              ? handleDisplayOrderedPackageMenuExpiredNotification(menu.name)
              : handleViewAllMenuItems(menu.id)
          }
          key={key}
          className={classes.menuCardItem}
          container
          item
          xs={3}
        >
          <NxtMenuItemCard
            size={12}
            img={imageSrc}
            imgAlt={t('common:menuImageAlt')}
            captionAlign="center"
            subtitle1={
              menu.name.length > 10
                ? menu.name.substring(0, 10) + '..'
                : menu.name
            }
          ></NxtMenuItemCard>
        </Grid>
      );
    })
  ) : (
    <Grid container alignItems="center">
      {t('menus:NoMenuToShow')}
    </Grid>
  );

  const previouslyOrderedItemsView = function () {
    let groupedFoodItems = chunk(previousOrderedItems, foodItemsCountInGroup);

    if (previousOrderedItems && previousOrderedItems.length) {
      return (
        <div className={classes.catCard}>
          <Grid container direction="row">
            <Grid className={classes.menuTitleGd} container item xs={6}>
              <IxTxtBox
                primary={t('menus:PreviouslyOrderedCategoryTitle')}
                primaryClassName={classes.previouslyOrderedTitle}
                primaryVariant="h5"
                align="left"
                reversed={false}
              ></IxTxtBox>
            </Grid>
          </Grid>
          <Grid
            className={classes.foodItemListWrapper}
            justify="flex-start"
            container
            direction="row"
          >
            <SwipeableViews enableMouseEvents resistance>
              {groupedFoodItems.map((groupedItem, index) => {
                return (
                  <div key={index} className={classes.swipableViewRow}>
                    {groupedItem.map((foodItem, index) => {
                      const { photo } = foodItem;
                      const imageSrc = photo
                        ? IMAGE_URL + companyId + '/images/' + photo
                        : null;
                      let foodItemName = getNameInUserSelectedLanguage(
                        foodItem.name,
                      );
                      const foodItemCard = (
                        <Grid
                          key={index}
                          className={classes.itemCardWrapper}
                          container
                          item
                          xs={4}
                          onClick={() =>
                            isOrderedPackageMenuExpired(
                              foodItem.menuId,
                              orderedPackageMenus,
                            ) || foodItem.isSoldOut
                              ? isOrderedPackageMenuExpired(
                                  foodItem.menuId,
                                  orderedPackageMenus,
                                )
                                ? handleDisplayOrderedPackageMenuExpiredNotification(
                                    foodItem.menuName,
                                  )
                                : {}
                              : handleFoodItemClick(foodItem, foodItem.menuId)
                          }
                        >
                          <NxtItemCard
                            size={12}
                            img={imageSrc}
                            imgAlt="ordered food"
                            captionAlign="center"
                            captionVariant="subtitle2"
                            subtitle1={
                              foodItemName && foodItemName.length > 10
                                ? foodItemName.substring(0, 10) + '..'
                                : foodItemName
                            }
                            tags={foodItem.prepareDuration + t('menus:Mins')}
                            isPackage={foodItem.isPackage}
                            price={foodItem.price}
                            priceIncludingTax={foodItem.priceIncludingTax}
                            priceDisplayOption={
                              companyConfigData[
                                companyConfigEnum.PRICE_DISPLAY_OPTION
                              ]
                            }
                            isSoldOut={foodItem.isSoldOut}
                          ></NxtItemCard>
                        </Grid>
                      );
                      return foodItemCard;
                    })}
                  </div>
                );
              })}
            </SwipeableViews>
          </Grid>
        </div>
      );
    }
    return '';
  };

  if (
    !(
      menuRearrangeStatus === apiRequestStatusEnum.succeeded ||
      menuRearrangeStatus === apiRequestStatusEnum.loadedFromCache
    )
  ) {
    return (
      <Grid container alignItems="center">
        {t('common:loading-text')}
      </Grid>
    );
  }

  return (
    <div className={classes.menuCard}>
      <Grid className={classes.menuCardWrapper} container direction="row">
        {menuList.length ? (
          menuList.map((menu, key) => {
            const { photo } = menu;
            const imageSrc = photo
              ? IMAGE_URL + companyId + '/images/' + photo
              : null;
            return (
              <Grid
                onClick={() =>
                  isOrderedPackageMenuExpired(menu.id, orderedPackageMenus)
                    ? handleDisplayOrderedPackageMenuExpiredNotification(
                        menu.name,
                      )
                    : handleViewAllMenuItems(menu.id)
                }
                key={key}
                className={classes.menuCardItem}
                container
                item
                xs={3}
              >
                <NxtMenuItemCard
                  size={12}
                  img={imageSrc}
                  imgAlt={t('common:menuImageAlt')}
                  captionAlign="center"
                  subtitle1={
                    menu.name.length > 10
                      ? menu.name.substring(0, 10) + '..'
                      : menu.name
                  }
                ></NxtMenuItemCard>
              </Grid>
            );
          })
        ) : (
          <Grid container alignItems="center">
            {t('menus:NoMenuToShow')}
          </Grid>
        )}
      </Grid>
      <Grid container direction="row">
        {previouslyOrderedItemsView()}
      </Grid>
      {foodItemListView}
    </div>
  );
}

export default withRouter(connect(null, mapDispatchToProps)(MultipleMenusView));

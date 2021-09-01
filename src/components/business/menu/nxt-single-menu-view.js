import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SwipeableViews from 'react-swipeable-views';
import { chunk } from 'lodash';
import Grid from '@material-ui/core/Grid';
import { Button, Typography } from '@material-ui/core';
import { Box } from '@material-ui/core';

import IxTxtBox from '../../basic/ix-txt-box';
import NxtMenuItemCard from './nxt-card-menu-item';
import NxtItemCard from './nxt-card-item';
import { IMAGE_URL } from '../../../constants/ix-image-links';
import {
  isOrderedPackageMenuExpired,
  redirectToFoodDetail,
  redirectToMenu,
} from '../../../services/utility.js';

import { setFoodItem } from '../../../actions/food-detail-actions';

import styles from './style.js';
import companyConfigEnum from '../../../constants/company-config-enum';
import { setSelectedCategory } from './menuSlice';
import { useSnackbar } from 'notistack';
import snackbarTypes from '../../../constants/snackbar-types';
import apiRequestStatusEnum from '../../../constants/api-request-status-enum';
const mapDispatchToProps = { setFoodItem, setSelectedCategory };

function NxtSingleMenu(props) {
  const classes = styles();
  const { t } = useTranslation(['menus']);
  const { enqueueSnackbar } = useSnackbar();
  const { history, setSelectedCategory, setFoodItem } = props;

  const foodItemsCountToDisplay = 15;
  const foodItemsCountInGroup = 3;

  let restaurantTableData,
    companyConfigData,
    companyId,
    languageCode,
    menuData,
    menuId,
    foodCategories;
  let { orderedPackageMenus } = props.props;
  let menuRearrangeStatus;
  try {
    const { appState, menuState, language } = props.props;
    menuData = menuState.menus.data[0];
    menuRearrangeStatus = menuState.menuRearrangeStatus;
    menuId = menuData && menuData.id;
    restaurantTableData = appState.restaurantTable.data;
    companyConfigData = appState.companyConfig.data;
    companyId =
      restaurantTableData &&
      restaurantTableData.company &&
      restaurantTableData.company.id;

    foodCategories = menuData && menuData['foodCategories'];
    languageCode = language.code;
  } catch (e) {
    console.warn(e);
  }

  const handleMoreClick = (menuId, categoryId) => {
    setSelectedCategory(categoryId);
    props.props.handleAddMenuIdToOrderState(menuId);
    redirectToMenu(history, menuId);
  };

  const handleItemClick = (item, menuId) => {
    setFoodItem(item);
    props.props.handleAddMenuIdToOrderState(menuId);
    redirectToFoodDetail(history);
  };

  const handleViewAllMenuItems = (menuId) => {
    setSelectedCategory(0);
    props.props.handleAddMenuIdToOrderState(menuId);
    redirectToMenu(history, menuId);
  };

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

  const categoryListView =
    foodCategories && foodCategories.length ? (
      foodCategories
        .filter((category) => !category.isPackageDefault)
        .map((category, index) => {
          const { photo, id } = category;
          const imageSrc = photo
            ? IMAGE_URL + companyId + '/images/' + photo
            : null;
          return (
            <Grid
              key={id}
              // className={classes.itemCardWrapper}
              className={classes.menuCardItem}
              container
              item
              xs={3}
              onClick={() => handleMoreClick(menuId, index)}
            >
              <NxtMenuItemCard
                size={12}
                img={imageSrc}
                imgAlt={t('common:menuImageAlt')}
                captionAlign="center"
                subtitle1={
                  category.name && category.name.length > 10
                    ? category.name.substring(0, 10) + '..'
                    : category.name
                }
              ></NxtMenuItemCard>
            </Grid>
          );
        })
    ) : (
      <Typography>{t('common:noItemsDisplayMessage')}</Typography>
    );

  const foodItemsListView =
    foodCategories && foodCategories.length
      ? foodCategories
          .filter((category) => !category.isPackageDefault)
          .map((category, index) => {
            let dataFoodItems = []; // category['foodItems'];

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

            findFoodItems([category]);

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

            const { id: categoryId } = category;

            if (dataFoodItems.length > 3) {
              dataFoodItems = dataFoodItems.slice(0, 3);
            }

            return (
              <Box key={categoryId}>
                <Grid container direction="row" alignItems="center">
                  <Grid className={classes.menuTitleGd} container item xs={6}>
                    <IxTxtBox
                      primary={category.name}
                      primaryVariant="h6"
                      align="left"
                      reversed={false}
                    ></IxTxtBox>
                  </Grid>
                  <Grid justify="flex-end" container item xs={6}>
                    <div className={classes.links}>
                      <Button
                        onClick={() => {
                          handleMoreClick(menuId, index);
                        }}
                      >
                        {t('menus:viewAll')}
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
                            const { photo, id: foodItemId } = foodItem;
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
                                    onClick={() => {
                                      handleMoreClick(menuId, category.id);
                                    }}
                                  >
                                    <Typography>
                                      {t('menus:viewAll')}
                                    </Typography>
                                  </div>
                                </div>
                              </Grid>
                            ) : (
                              <Grid
                                onClick={() =>
                                  !foodItem.isSoldOut
                                    ? handleItemClick(foodItem, menuId)
                                    : {}
                                }
                                key={foodItemId}
                                className={classes.itemCardWrapper}
                                container
                                item
                                xs={4}
                              >
                                <NxtItemCard
                                  size={12}
                                  img={imageSrc}
                                  imgAlt={t('common:menuImageAlt')}
                                  captionAlign="center"
                                  captionVariant="subtitle2"
                                  subtitle1={
                                    foodItem.name && foodItem.name.length > 10
                                      ? foodItem.name.substring(0, 10) + '..'
                                      : foodItem.name
                                  }
                                  tags={
                                    foodItem.prepareDuration + t('menus:Mins')
                                  }
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
          })
      : '';
  // <Typography>{t('common:noItemsDisplayMessage')}</Typography>

  let menuWithSubMenusView;
  if (menuData && menuData.subMenus) {
    const { name, photo, id } = menuData;
    const imageSrc = photo ? IMAGE_URL + companyId + '/images/' + photo : null;
    menuWithSubMenusView = (
      <Grid
        onClick={() =>
          isOrderedPackageMenuExpired(id, orderedPackageMenus)
            ? handleDisplayOrderedPackageMenuExpiredNotification(menuData.name)
            : handleViewAllMenuItems(id)
        }
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
            name && name.length > 10 ? name.substring(0, 10) + '..' : name
          }
        ></NxtMenuItemCard>
      </Grid>
    );
  }

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
  } else if (!menuData) {
    return (
      <Grid container alignItems="center">
        {t('menus:NoMenuToShow')}
      </Grid>
    );
  }

  return (
    <div className={classes.menuCard}>
      {menuData.subMenus ? (
        menuWithSubMenusView
      ) : (
        <>
          <Grid container direction="row" className={classes.menuCardWrapper}>
            {categoryListView}
          </Grid>
          <div className={classes.catCard}>{foodItemsListView}</div>
        </>
      )}
    </div>
  );
}

export default withRouter(connect(null, mapDispatchToProps)(NxtSingleMenu));

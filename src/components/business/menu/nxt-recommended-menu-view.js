import React from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { chunk } from 'lodash';
import clsx from 'clsx';
import SwipeableViews from 'react-swipeable-views';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core';

import IxTxtBox from '../../basic/ix-txt-box';
import { IMAGE_URL } from '../../../constants/ix-image-links';
import NxtTopBar from '../../basic/nxt-top-bar.js';
import NxtTopBarItems from '../../composite/nxt-top-bar-items.js';
import { redirectToSearch } from '../../../services/utility.js';

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
import { fetchMenus, fetchRecommendedFoodItems } from './menuSlice.js';
import nxtMenuTypes from '../../../constants/nxt-menu-types';
import snackbarTypes from '../../../constants/snackbar-types';
import apiRequestStatusEnum from '../../../constants/api-request-status-enum';
import BasicBottomLinks from '../../basic/nxt-basic-bottom-links.js';

const RecommendedMenusView = props => {
  const classes = styles();
  const { t } = useTranslation(['menus']);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { history } = props;

  let restaurantTableData,
    recommendedMenuStatus,
    menuStatus,
    companyConfigData,
    companyId,
    menuList,
    languageCode;
  let { order, orderedPackageMenus } = props;
  try {
    const { appState, menuState, language } = props;
    restaurantTableData = appState.restaurantTable.data;
    const { menus, recommendedFoodItems } = menuState;
    const { data, status } = menus;
    menuStatus = status;
    recommendedMenuStatus = recommendedFoodItems.status;
    companyConfigData = appState.companyConfig.data;
    companyId =
      restaurantTableData &&
      restaurantTableData.company &&
      restaurantTableData.company.id;
    menuList = menuState.recommendedFoodItems.data;
    languageCode = language.code;
  } catch (e) {
    console.warn(e);
  }

  React.useEffect(() => {
    if (menuStatus === apiRequestStatusEnum.idle) {
      dispatch(fetchMenus());
    }
    if (recommendedMenuStatus === apiRequestStatusEnum.idle) {
      dispatch(fetchRecommendedFoodItems());
    }
  }, []);

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

  const handleFoodItemClick = (menu) => {
    //setSelectedCategory(0);
    dispatch(setFoodItem(menu))
    props.handleAddMenuIdToOrderState(menu?.menuId);
    redirectToFoodDetail(history);
  };

  return (
    <div>
      <Grid container direction='row'>
        <Grid container item xs={12}>
          <NxtTopBar bottomBorder={true}>
            <NxtTopBarItems
              title={
                restaurantTableData &&
                restaurantTableData.branch &&
                restaurantTableData.branch.name
              }
              handleSearchButton={() => redirectToSearch(history)}
            ></NxtTopBarItems>
          </NxtTopBar>
        </Grid>
      </Grid>
      <div className={clsx(classes.menuCard, classes.recommendedCard)}>
        <b className={classes.recommendedTitle}>{t('Recommended Items')}</b>
        <Grid
          className={classes.recommendedMenuCardWrapper}
          container
          direction='row'
        >
          {menuList && menuList.length ? (
            menuList.map((menu, key) => {
              const { photo, prepareDuration, priceIncludingTax } = menu;
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
                      : handleFoodItemClick(menu)
                  }
                  key={key}
                  className={classes.menuCardItem}
                  container
                  item
                  xs={4}
                >
                  <NxtMenuItemCard
                    size={12}
                    img={imageSrc}
                    imgAlt={t('common:menuImageAlt')}
                    captionAlign='center'
                    subtitle1={
                      menu.name.length > 10
                        ? menu.name.substring(0, 10) + '..'
                        : menu.name
                    }
                    recommended
                    prepareDuration={prepareDuration}
                    priceIncludingTax={priceIncludingTax}
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
      <Grid style={{ width: '100%' }} container direction='row'>
        <BasicBottomLinks
          history={history}
          rightChildText={'Continue'}
          rightChildLink={'/menus'}
        ></BasicBottomLinks>
      </Grid>
    </div>
  );
};
export default RecommendedMenusView;

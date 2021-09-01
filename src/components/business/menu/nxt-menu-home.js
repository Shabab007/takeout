import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core';

import NxtTopBarItems from '../../composite/nxt-top-bar-items.js';
import IxTxtBox from '../../basic/ix-txt-box';
import IxBottomNav from '../../basic/ix-bottom-nav';
import NxtFallback from '../../basic/nxt-fallback.js';
import NxtTopBar from '../../basic/nxt-top-bar.js';
import { redirectToSearch } from '../../../services/utility.js';
import styles from './style.js';
import apiRequestStatusEnum from '../../../constants/api-request-status-enum.js';
import NextPackageMenuTimer from '../order/nxt-order-timer/next-package-menu-timer.js';
import { fetchMenus, fetchRecommendedFoodItems } from './menuSlice.js';
import { useDispatch } from 'react-redux';

const TabMenusView = lazy(() => import('./nxt-tab-menu-view'));
// const SingleMenuView = lazy(() => import('./nxt-single-menu-view'));

const MenuHome = props => {
  const classes = styles();
  const { t } = useTranslation(['menus']);
  const dispatch = useDispatch();
  const { appState, menuState, history } = props;
  let restaurantTableData, menuList, menuStatus, recommendedMenuStatus;

  try {
    restaurantTableData = appState.restaurantTable.data;
    const { menus, recommendedFoodItems } = menuState;

    const { data, status } = menus;
    menuStatus = status;

    recommendedMenuStatus = recommendedFoodItems.status;
    menuList = data;
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
  }, [menuStatus, dispatch]);

  return (
    <div>
      <Box className={classes.bottomNav} component='span'>
        <IxBottomNav props={props}></IxBottomNav>
      </Box>

      <Grid container direction='row'>
        <Grid container item xs={12}>
          <NxtTopBar bottomBorder={false}>
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

      <Grid className={classes.titleGd} container direction='row'>
        {/* <IxTxtBox
          className={classes.menuHomePageTitle}
          primary={t('menuHomePageTitle')}
          primaryVariant='h6'
          align='left'
        ></IxTxtBox> */}

        <NextPackageMenuTimer></NextPackageMenuTimer>
      </Grid>

      <Suspense fallback={<NxtFallback />}>
        {menuList && menuList.length >= 1 && (
          <TabMenusView props={props} />
        )}
      </Suspense>
    </div>
  );
};

// export default withTranslation()(MenuHome);
export default MenuHome;

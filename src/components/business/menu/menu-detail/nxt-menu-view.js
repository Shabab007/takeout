// Renders menus and sub menus
import React, { useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';
import IxTab from '../../../basic/ix-tab';
import { useSelector } from 'react-redux';
import NxtCategoriesView from './nxt-categories-view.js';
import PackageMenuOrderView from './package-menu-order.js';

import styles from './style.js';

function NxtMenuView(props) {
  const {
    menu,
    prevSelectedCategoryId,
    handleAddMenuIdToOrderState,
    setCategoryIndex,
    companyConfigData,
  } = props;
  const classes = styles();
  const [catIndex, setCatIndex] = useState(0)

  const { subMenus, isPackage, isPackageMenuOrdered } = menu;

  const prevTabMenuSelectedCategoryId = useSelector((state) => state.menuState.prevTabMenuSelectedCategoryId);
  
  let menuTabs = [];

  if (subMenus) {
    subMenus.map((menu) => {
      const label = menu.name;
      const content = (
        <NxtMenuView
          menu={menu}
          prevSelectedCategoryId={prevSelectedCategoryId}
          handleAddMenuIdToOrderState={handleAddMenuIdToOrderState}
          setCategoryIndex={setCategoryIndex}
          companyConfigData={companyConfigData}
        ></NxtMenuView>
      );
      menuTabs.push({ label, content });
      return menu;
    });
  }

  return (
    <div className={classes.menuView}>
      {/* Order the subMenu which itself does not contain any subMenu */}
      {subMenus && subMenus.length ? (
        <IxTab
          itemList={menuTabs}
          initialOpenTab={prevTabMenuSelectedCategoryId}
          setCategoryIndex={setCategoryIndex}
          resetCategoryIndex={true}
        ></IxTab>
      ) : (
        <Grid justify="flex-start" container item xs={12}>
          {isPackage && !isPackageMenuOrdered && (
            <PackageMenuOrderView
              companyConfigData={companyConfigData}
              // order={(cart && cart.order) || null}
              menu={menu}
            ></PackageMenuOrderView>
          )}

          <NxtCategoriesView
            menuId={menu.id}
            disablePackageMenuFoodItemBeforeOrder={
              isPackage && !isPackageMenuOrdered
            }
            foodCategories={menu.foodCategories}
            handleAddMenuIdToOrderState={handleAddMenuIdToOrderState}
            setCategoryIndex={setCategoryIndex}
            prevSelectedCategoryId={prevTabMenuSelectedCategoryId}
          ></NxtCategoriesView>
        </Grid>
      )}
    </div>
  );
}

export default NxtMenuView;

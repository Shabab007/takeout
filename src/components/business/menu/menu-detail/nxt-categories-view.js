// Renders categories
import { Grid, Icon } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IxFilter from '../../../basic/ix-filter.js';
import IxTab from '../../../basic/ix-tab.js';
import IxTitle from '../../../basic/ix-title.js';
import CatFoodItems from './nxt-food-items.js';

import styles from './style.js';

const isHalal = 'isHalal';
const isVeg = 'isVeg';
const isKidItem = 'isKidItem';
const isAlcoholAdded = 'isAlcoholAdded';

function NxtCategoriesView({
  menuId,
  foodCategories,
  handleAddMenuIdToOrderState,
  prevSelectedCategoryId,
  setCategoryIndex,
  disablePackageMenuFoodItemBeforeOrder,
}) {
  const { t } = useTranslation(['menus']);
  const classes = styles();

  const [selectedFilterItem, setSelectedFilterItem] = useState();
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filters] = useState([
    {
      label: t('Halal'),
      value: isHalal,
    },
    {
      label: 'BBBBBB',
      value: isVeg,
    },
    {
      label: t('isKidItem'),
      value: isKidItem,
    },
    {
      label: t('isAlcoholAdded'),
      value: isAlcoholAdded,
    },
  ]);

  useEffect(() => {
    if (foodCategories) {
      setFilteredCategories(
        foodCategories.filter((category) => !category.isPackageDefault),
      );
    }
  }, [foodCategories]);

  const handleFilterChange = (filterValue) => {
    setSelectedFilterItem(filterValue);
    if (!foodCategories) {
      return;
    }
    if (filterValue) {
      const categories = foodCategories.map((category) => {
        const foodItems =
          category.foodItems &&
          category.foodItems.filter((foodItem) => foodItem[filterValue]);
        return { ...category, foodItems };
      });
      setFilteredCategories(
        categories.filter((category) => !category.isPackageDefault),
      );
    } else {
      setFilteredCategories(
        foodCategories.filter((category) => !category.isPackageDefault),
      );
    }
  };

  let foodItemFilterView = (
    <Grid container direction="row">
      <Grid
        className={classes.filterTitle}
        justify="flex-start"
        container
        item
        xs={2}
      >
        <IxTitle text={t('Filters')} variant="subtitle1"></IxTitle>
      </Grid>
      <Grid justify="flex-start" container item xs={8} className={classes.filterItems}>
        <IxFilter
          filterItems={filters}
          selectedFilterItem={selectedFilterItem}
          handleFilterChange={handleFilterChange}
        ></IxFilter>
      </Grid>

      <Grid
        className={classes.filterModal}
        justify="flex-end"
        container
        item
        xs={2}
      >
        <Icon
          style={{ cursor: 'pointer' }}
          color={selectedFilterItem ? 'primary' : 'inherit'}
          onClick={() => handleFilterChange(null)}
        >
          filter_list
        </Icon>
      </Grid>
    </Grid>
  );

  let categoryTabs = [];

  filteredCategories &&
    filteredCategories.length &&
    filteredCategories.map((category, index) => {
      const label = category.name;
      let { subFoodCategories } = category;
      const content = subFoodCategories ? (
        <NxtCategoriesView
          menuId={menuId}
          disablePackageMenuFoodItemBeforeOrder={
            disablePackageMenuFoodItemBeforeOrder
          }
          foodCategories={subFoodCategories}
          handleAddMenuIdToOrderState={handleAddMenuIdToOrderState}
          setCategoryIndex={setCategoryIndex}
          initialOpenTab={prevSelectedCategoryId}
        ></NxtCategoriesView>
      ) : (
        <CatFoodItems
          key={index}
          category={category}
          handleAddMenuIdToOrderState={handleAddMenuIdToOrderState}
          menuId={menuId}
          disablePackageMenuFoodItemBeforeOrder={
            disablePackageMenuFoodItemBeforeOrder
          }
        ></CatFoodItems>
      );
      categoryTabs.push({
        label,
        content,
        allowContentBetweenTabAndPanel: subFoodCategories ? false : true,
      });
      return content;
    });

  return (
    <IxTab
      itemList={categoryTabs}
      initialOpenTab={prevSelectedCategoryId > categoryTabs.length ? 0 : prevSelectedCategoryId}
      contentBetweenTabAndPanel={foodItemFilterView}
      setCategoryIndex={setCategoryIndex}
      categoryView={true}
    ></IxTab>
  );
}

export default NxtCategoriesView;

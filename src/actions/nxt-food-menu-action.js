import axios from '../utils/axios';
import {
  GET_TOP_MENU,
  GET_FOOD_CATEGORY,
  GET_FOOD_ITEMS,
  GET_FOOD_ITEM,
  SET_FOOD_ITEM,
  SET_CATEGORY_INDEX,
} from '../action-types/nxt-food-menu-type';
import { SET_MENU_LIST } from '../action-types/food-detail-types';
import { getAllStockInfo } from '../services/guest';

export const getTopMenu = (data, menuLength) => ({
  type: GET_TOP_MENU,
  payload: {
    data: data,
    menuLength: menuLength,
  },
});

export const setMenuList = (data) => {
  return { type: SET_MENU_LIST, payLoad: data };
};

export const getTopMenus = () => async (dispatch, getState) => {
  let url = '',
    menuList;

  const { appState, language } = getState();

  const languageCode = language.code;
  const restaurantTableData = appState.restaurantTable.data;

  if (!restaurantTableData || !languageCode) {
    console.warn('restaurantTable data is not loaded');
    return;
  }
  const { company, branch } = restaurantTableData;
  const { id: branchId } = branch;
  const { id: companyId } = company;
  const currentTime = new Date();

  function padWithInitialZero(num) {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }

  let currentHours = padWithInitialZero(currentTime.getHours());
  let currentMinutes = padWithInitialZero(currentTime.getMinutes());

  const currentTimeString = currentHours + ':' + currentMinutes;
  url = `/user/companies/${companyId}/branches/${branchId}/menus?languageCode=${languageCode}&depth=4&currentTime=${currentTimeString}`;
  const res = await axios.get(url);
  // await axios
  //   .get(url)
  //   .then((res) => {
  //     menuList = res.data.data;
  //     dispatch(getTopMenu(menuList, menuList.length));
  //     dispatch(setMenuList(menuList));
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  if (res && res.data && res.data.success) {
    menuList = res.data.data;
    // dispatch(getTopMenu(menuList, menuList.length));
    // dispatch(setMenuList(menuList));
  }

  if (menuList) {
    const stockInfoResponse = await getAllStockInfo(companyId, branchId);
    if (stockInfoResponse && stockInfoResponse.success) {
      const menuListWithStockInfo = menuList.map((menu) => {
        menu.foodCategories &&
          menu.foodCategories.map((category) => {
            category.foodItems &&
              category.foodItems.map((foodItem) => {
                const stockItem = stockInfoResponse.data.find(
                  (foodItemStock) => foodItemStock.foodItemId === foodItem.id,
                );
                if (stockItem) {
                  foodItem.isSoldOut = stockItem.currentStock ? false : true;
                  return foodItem;
                }

                return foodItem;
              });
            return category;
          });
        return menu;
      });

      let sortedMenuListWithStockInfo = menuListWithStockInfo.sort((a, b) =>
        a.displayOrder > b.displayOrder ? 1 : -1,
      );

      dispatch(
        getTopMenu(
          sortedMenuListWithStockInfo,
          sortedMenuListWithStockInfo.length,
        ),
      );
      dispatch(setMenuList(sortedMenuListWithStockInfo));
    }
  }
};
export const downloadImage = (companyId, imageId) => async (
  dispatch,
  getState,
) => {
  let data = [];
  let url = `common/companies/${companyId}/images/${imageId}`;
  await axios
    .get(url)
    .then((res) => {
      data = res;
    })
    .catch((err) => {
      console.log(err);
      data = err.response;
    });
  return data;
};

export const getFoodCategoryDispatch = (data) => ({
  type: GET_FOOD_CATEGORY,
  payload: {
    data: data,
  },
});

export const getFoodCategory = (routepara) => async (dispatch, getState) => {
  const url = `/user/companies/${routepara.companyId}/branches/${routepara.branchId}/menus/${routepara.menuId}/food-categories`;
  await axios
    .get(url)
    .then((res) => {
      dispatch(getFoodCategoryDispatch(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getFoodItemsDispatch = (data) => ({
  type: GET_FOOD_ITEMS,
  payload: {
    data: data,
  },
});

export const getFoodItems = (routepara) => async (dispatch, getState) => {
  const url = `/user/companies/${routepara.companyId}/branches/${routepara.branchId}/menus/${routepara.menuId}/food-categories/${routepara.categoryId}/food-items`;
  await axios
    .get(url)
    .then((res) => {
      dispatch(getFoodItemsDispatch(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getFoodItemByIdDispatch = (data) => ({
  type: GET_FOOD_ITEM,
  payload: {
    data: data,
  },
});

export const getFoodItemById = (routepara) => async (dispatch, getState) => {
  const url = `/user/companies/${routepara.companyId}/branches/${routepara.branchId}/menus/${routepara.menuId}/food-categories/${routepara.categoryId}/food-items/${routepara.id}`;
  await axios
    .get(url)
    .then((res) => {
      dispatch(getFoodItemByIdDispatch(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const setCartFoodItemDispatch = (foodItem) => ({
  type: SET_FOOD_ITEM,
  payload: {
    data: foodItem,
  },
});

export const setCartFoodItem = (foodItem) => async (dispatch, getState) => {
  dispatch(setCartFoodItemDispatch(foodItem));
};

// export const setCategoryIndex = (index) => ({
//   type: SET_CATEGORY_INDEX,
//   payload: {
//     index,
//   },
// });

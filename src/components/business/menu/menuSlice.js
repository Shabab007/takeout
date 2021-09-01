import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import statusEnum from '../../../constants/api-request-status-enum';
import {
  setMenusToSessionStorage,
  getMenusFromSessionStorage,
  setOriginalMenusToSessionStorage,
  getOriginalMenusFromSessionStorage,
} from '../../../actions/nxt-local-storage';
import { setMenuList } from '../../../actions/nxt-food-menu-action';

const initialState = {
  menus: {
    status: getMenusFromSessionStorage()
      ? statusEnum.loadedFromCache
      : statusEnum.idle,
    data: getMenusFromSessionStorage() || [],
    originalData: getOriginalMenusFromSessionStorage() || [],
    error: null,
  },
  recommendedFoodItems: {
    status: statusEnum.idle,
    data: null,
    error: null,
  },
  stock: {
    status: statusEnum.idle,
    data: null,
    error: null,
  },
  menuRearrangeStatus: getMenusFromSessionStorage()
    ? statusEnum.loadedFromCache
    : statusEnum.idle,

  prevSelectedCategoryId: 0,
  prevTabMenuSelectedCategoryId: 0,
  prevSelectedTabMenu: 0
};

const getFormattedTimeString = () => {
  const currentTime = new Date();
  function padWithInitialZero(num) {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }

  let currentHours = padWithInitialZero(currentTime.getHours());
  let currentMinutes = padWithInitialZero(currentTime.getMinutes());

  return currentHours + ':' + currentMinutes;
};

export const fetchRecommendedFoodItems = () => async (dispatch, getState) => {
  dispatch(setRecommendedFoodItemsStatus(statusEnum.loading));
  const currentTimeString = getFormattedTimeString();
  const depth = '4';
  let languageCode, companyId, branchId;

  try {
    const { appState, language } = getState();
    languageCode = language.code;

    const restaurantTableData = appState.restaurantTable.data;

    const { company, branch } = restaurantTableData;
    companyId = company.id;
    branchId = branch.id;
  } catch (e) {
    console.warn(e);
  }

  const url = `/user/companies/${companyId}/branches/${branchId}/recommended-food-items?languageCode=${languageCode}&currentTime=${currentTimeString}`;

  var response = null;
  try {
    response = await axios.get(url);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setRecommendedFoodItemsData(response.data.data));
      dispatch(setRecommendedFoodItemsStatus(statusEnum.succeeded));
    } else {
      dispatch(setRecommendedFoodItemsStatus(statusEnum.failed));
      dispatch(setRecommendedFoodItemsError(response.data.exceptions));
    }
  } else {
    dispatch(setRecommendedFoodItemsStatus(statusEnum.failed));
    dispatch(setRecommendedFoodItemsError(response.data.exceptions));
  }
};

export const fetchMenus = () => async (dispatch, getState) => {
  dispatch(setMenusStatus(statusEnum.loading));
  const currentTimeString = getFormattedTimeString();
  const depth = '4';
  let languageCode, companyId, branchId;

  try {
    const { appState, language } = getState();
    languageCode = language.code;

    const restaurantTableData = appState.restaurantTable.data;

    const { company, branch } = restaurantTableData;
    companyId = company.id;
    branchId = branch.id;
  } catch (e) {
    console.warn(e);
  }

  const getMenusUrl = `/user/companies/${companyId}/branches/${branchId}/menus?languageCode=${languageCode}&depth=${depth}&currentTime=${currentTimeString}`;

  var response = null;
  try {
    response = await axios.get(getMenusUrl);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(fetchAllStockInfo(response.data.data));
      dispatch(setMenusStatus(statusEnum.succeeded));
    } else {
      dispatch(setMenusStatus(statusEnum.failed));
      dispatch(setMenusError(response.data.exceptions));
    }
  } else {
    dispatch(setMenusStatus(statusEnum.failed));
    dispatch(setMenusError(response));
  }
};

export const fetchAllStockInfo = (menuList) => async (dispatch, getState) => {
  dispatch(setStockStatus(statusEnum.loading));

  let companyId, branchId;
  try {
    const { appState, menuState } = getState();
    const restaurantTableData = appState.restaurantTable.data;
    const { company, branch } = restaurantTableData;
    companyId = company.id;
    branchId = branch.id;

    if (!menuList) {
      menuList = menuState.menus.data;
    }
  } catch (e) {
    console.warn(e);
  }

  const stockInfoUrl = `/common/companies/${companyId}/branches/${branchId}/current-stock`;
  var response = null;
  try {
    response = await axios.get(stockInfoUrl);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      const stockInfoResponse = response.data.data;
      const menuListWithStockInfo = menuList.map((menu) => {
        // TODO: map submenus and subcategories
        menu.foodCategories &&
          menu.foodCategories.map((category) => {
            category.foodItems &&
              category.foodItems.map((foodItem) => {
                const stockItem = stockInfoResponse.find(
                  (foodItemStock) => foodItemStock.foodItemId === foodItem.id,
                );
                if (stockItem) {
                  return {
                    ...foodItem,
                    isSoldOut: stockItem.currentStock ? false : true,
                  };
                }

                return foodItem;
              });
            return category;
          });
        return menu;
      });

      dispatch(setStockData(stockInfoResponse));
      // dispatch(setMenusData(menuListWithStockInfo));
      // setMenusToSessionStorage(menuListWithStockInfo);
      // todo: refactor.
      // setting menu list to food detail state
      // dispatch(setMenuList(menuListWithStockInfo));
      dispatch(rearrangeMenuWithOrderedMenu(menuListWithStockInfo));
      dispatch(setStockStatus(statusEnum.succeeded));
    } else {
      dispatch(setStockStatus(statusEnum.failed));
      dispatch(setStockError(response.data.exceptions));
      // fetching stock info failed. if we got menu list, set that at least
      if (menuList) {
        // dispatch(setMenusData(menuList));
        // setMenusToSessionStorage(menuList);
        // todo: refactor.
        // setting menu list to food detail state
        // dispatch(setMenuList(menuList));
        dispatch(rearrangeMenuWithOrderedMenu(menuList));
      }
    }
  } else {
    dispatch(setStockStatus(statusEnum.failed));
    dispatch(setStockError(response));
  }
};

export const rearrangeMenuWithOrderedMenu = (menuList) => async (
  dispatch,
  getState,
) => {
  let orderPackageMenus = [],
    modifiedMenuList;
  try {
    const { menuState, cart } = getState();
    if (!menuList) {
      menuList =
        menuState.menus.status === statusEnum.idle
          ? null
          : menuState.menus.originalData;
    }
    orderPackageMenus =
      cart &&
      cart.order &&
      cart.order.orderMenus &&
      cart.order.orderMenus.map((orderMenu) => {
        const { isPackage, id, parentId, rootParentId } = orderMenu;
        if (isPackage) {
          return { id, parentId, rootParentId };
        }
        return null;
      });

    orderPackageMenus =
      orderPackageMenus &&
      orderPackageMenus.filter((orderPackageMenus) => orderPackageMenus);
  } catch (e) {
    console.warn(e);
  }

  if (!menuList) {
    return;
  }
  modifiedMenuList = [...menuList];

  // checking for package menu in order, and replace menuFamily with subMenu
  function findMenu(menuList, menuId, foundMenuList = []) {
    menuList.forEach((menu) => {
      if (menu.subMenus) {
        // food item can be mapped with only leaf level menus
        return findMenu(menu.subMenus, menuId, foundMenuList);
      } else if (menu.id === menuId) {
        foundMenuList.push(menu);
      }
    });
    return foundMenuList;
  }

  if (orderPackageMenus && orderPackageMenus.length) {
    orderPackageMenus.map((orderedPackageMenu) => {
      const { id: orderedPackageMenuId } = orderedPackageMenu;

      let foundMenuList = findMenu(menuList, orderedPackageMenuId);
      let foundOrderedPackageMenu =
        foundMenuList && foundMenuList.length && foundMenuList[0];

      if (foundOrderedPackageMenu) {
        let menuToBeReplacedIndex = -1;
        if (foundOrderedPackageMenu.rootParentId) {
          menuToBeReplacedIndex = menuList.findIndex(
            (menu) => menu.id === foundOrderedPackageMenu.rootParentId,
          );
        } else {
          menuToBeReplacedIndex = menuList.findIndex(
            (menu) => menu.id === foundOrderedPackageMenu.id,
          );
        }

        if (menuToBeReplacedIndex !== -1) {
          modifiedMenuList.splice(menuToBeReplacedIndex, 1, {
            ...foundOrderedPackageMenu,
            isPackageMenuOrdered: true,
          });
        }
      }

      return null;
    });
  }

  dispatch(setOriginalMenusData(menuList));
  setOriginalMenusToSessionStorage(menuList);

  dispatch(setMenuList(modifiedMenuList));
  dispatch(setMenusData(modifiedMenuList));
  setMenusToSessionStorage(modifiedMenuList);
  dispatch(setMenuRearrangeStatus(statusEnum.succeeded));
  // checking for package menu in order, and replace menuFamily with subMenu end
};

const menuSlice = createSlice({
  name: 'nxt-menu',
  initialState,
  reducers: {
    // menus
    setMenusStatus(state, { payload }) {
      state.menus.status = payload;
    },
    setRecommendedFoodItemsStatus(state, { payload }) {
      state.recommendedFoodItems.status = payload;
    },
    setOriginalMenusData(state, { payload }) {
      state.menus.originalData = payload;
    },
    setMenusData(state, { payload }) {
      state.menus.data = payload;
    },
    setRecommendedFoodItemsData(state, { payload }) {
      state.recommendedFoodItems.data = payload;
    },
    setRecommendedFoodItemsError(state, { payload }) {
      state.recommendedFoodItems.error = payload;
    },
    setMenusError(state, { payload }) {
      state.menus.error = payload;
    },
    // stock
    setStockStatus(state, { payload }) {
      state.stock.status = payload;
    },
    setStockData(state, { payload }) {
      state.stock.data = payload;
    },
    setStockError(state, { payload }) {
      state.stock.error = payload;
    },
    // menu rearrange
    setMenuRearrangeStatus(state, { payload }) {
      state.menuRearrangeStatus = payload;
    },
    setSelectedCategory(state, { payload }) {
      state.prevSelectedCategoryId = payload;
    },
    setTabMenuSelectedCategory(state, { payload }) {
      state.prevTabMenuSelectedCategoryId = payload;
    },
    setSelectedTabMenu(state, { payload }) {
      state.prevSelectedTabMenu = payload;
    }
  },
});

export const {
  setMenusStatus,
  setMenusData,
  setRecommendedFoodItemsStatus,
  setRecommendedFoodItemsData,
  setOriginalMenusData,
  setMenusError,
  setRecommendedFoodItemsError,
  setStockStatus,
  setStockData,
  setStockError,
  setMenuRearrangeStatus,
  setSelectedCategory,
  setTabMenuSelectedCategory,
  setSelectedTabMenu,
} = menuSlice.actions;
export default menuSlice.reducer;

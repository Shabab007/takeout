import {
  getLanguageCodeFromLocalStorage,
  getLastTimeToOrderForAllYouCanDrinkFromSessionStorage,
  getLastTimeToOrderForAllYouCanEatFromSessionStorage,
} from '../actions/nxt-local-storage';
import { resetAppState } from '../components/business/home/appStateSlice';
import nxtMenuTypes from '../constants/nxt-menu-types';
import { MALE, FEMALE, KIDS, OTHERS } from '../constants/order-status';
import i18n from '../i18n';
const languageCode = getLanguageCodeFromLocalStorage();

export const operatorSubtract = '-';
export const operatorAddition = '+';

export function getNameInUserSelectedLanguage(name) {
  if (typeof name == 'object') {
    return name[languageCode];
  } else if (typeof name == 'string') {
    return name;
  }
}

// export const makeOrderMenus = (menuList, items) => {
//   let orderMenus = menuList.map((menu) => {
//     let foodItemsSelectedFromCurrentMenu = items.map((cartItem) => {
//       const {
//         menuId,
//         name: cartItemName,
//         menuName: cartItemMenuName,
//       } = cartItem;

//       if (menuId === menu.id) {
//         let name = {};
//         let menuName = {};
//         if (cartItemName && typeof cartItemName === 'string') {
//           name[languageCode] = cartItemName;
//         } else {
//           name = cartItemName;
//         }

//         if (cartItemMenuName && typeof cartItemMenuName === 'string') {
//           menuName[languageCode] = cartItemMenuName;
//         } else {
//           menuName = cartItemMenuName;
//         }

//         return { ...cartItem, name, menuName };
//       } else {
//         return null;
//       }
//     });

//     foodItemsSelectedFromCurrentMenu = foodItemsSelectedFromCurrentMenu.filter(
//       (item) => item,
//     );

//     if (foodItemsSelectedFromCurrentMenu.length) {
//       return { ...menu, orderItems: foodItemsSelectedFromCurrentMenu };
//     } else {
//       return null;
//     }
//   });

//   orderMenus = orderMenus.filter((menu) => menu);
//   return orderMenus;
// };

export const makeOrderMenus = (items) => {
  items = items.map((cartItem) => {
    const { name: cartItemName, menuName: cartItemMenuName } = cartItem;

    let name = {};
    let menuName = {};
    if (cartItemName && typeof cartItemName === 'string') {
      name[languageCode] = cartItemName; // todo: current languageCode. user may have changed the language after querying the menu
    } else {
      name = cartItemName;
    }

    if (cartItemMenuName && typeof cartItemMenuName === 'string') {
      menuName[languageCode] = cartItemMenuName;
    } else {
      menuName = cartItemMenuName;
    }

    return { ...cartItem, name, menuName };
  });
  const groupedCartItems = groupBy(items, 'menuId');
  let orderMenus = [];
  groupedCartItems &&
    groupedCartItems.map((group) => {
      if (group.length) {
        const {
          menuId,
          isPackage,
          packagePrice,
          isTimeBound,
          timeBoundDuration,
          menuType,
        } = group[0];
        orderMenus = [
          ...orderMenus,
          {
            menuId,
            isPackage,
            packagePrice,
            isTimeBound,
            timeBoundDuration,
            menuType,
            orderItems: group,
          },
        ];
      }
      return null;
    });
  return orderMenus;
};

export const mapMenuProperties = (menus) => {
  return menus.map((menu) => {
    const {
      id,
      name,
      foodCategoryId,
      keyName,
      companyId,
      branchId,
      isPackage,
      packagePrice,
      isTimeBound,
      timeBoundDuration,
      packageDiscountPercentage,
      isPublished,
      menuType,
      isActive,
      prepareDuration,
      subMenus,
      parentId,
      rootParentId,
      taxDecimal,
    } = menu;
    return {
      id,
      name,
      foodCategoryId,
      keyName,
      companyId,
      branchId,
      isPackage,
      packagePrice,
      isTimeBound,
      timeBoundDuration,
      packageDiscountPercentage,
      isPublished,
      menuType,
      isActive,
      prepareDuration,
      subMenus,
      parentId,
      rootParentId,
      taxDecimal,
    };
  });
};

export const parseGuestConfig = (guestConfig) => {
  let male = 0,
    female = 0,
    kid = 0,
    others = 0;
  guestConfig.map((guest) => {
    if (guest.guestCategory === MALE) {
      male = guest.noOfPerson;
    }
    if (guest.guestCategory === FEMALE) {
      female = guest.noOfPerson;
    }
    if (guest.guestCategory === KIDS) {
      kid = guest.noOfPerson;
    }
    if (guest.guestCategory === OTHERS) {
      others = guest.noOfPerson;
    }
    return guest;
  });

  return { male, female, kid, others };
};

export const minuteToMilliSecond = (min) => (min ? min : 0) * 60 * 1000;
export const miliSecondToMinute = (ms) => (ms ? ms : 0) / 60 / 1000;

export const formatTime = (timeStringSeparatedByColon = '00:00') => {
  let [hours, minutes] = timeStringSeparatedByColon.split(':');

  var isAM = hours >= 12 ? false : true;
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  // minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes;
  return isAM
    ? i18n.t('common:timePeriod_AM', { time: strTime })
    : i18n.t('common:timePeriod_PM', { time: strTime });
};

export const redirectToHomeForTableBook = (history) => {
  history.push('/home/for-table-book/');
};

export const redirectToTableBookErrorPage = (history) => {
  history.push('/home/table/error');
};

export const redirectToLanguageSelection = (history) => {
  history.push('/language-selection');
};

export const redirectToGuide = (history) => {
  history.push('/guide');
};

export const redirectToTempScan = (history) => {
  history.replace('/scan-qr-code');
};

export const redirectToGuestConfig = (history) => {
  history.push('/guest-configuration');
};

export const redirectToMenu = (history, id) => {
  if (id) {
    history.push(`/menus/${id}`);
  } else {
    history.push('/menus');
  }
};

export const redirectToSearch = (history) => {
  history.push('/menu/search');
};

export const redirectToCart = (history) => {
  history.push('/cart');
};

export const redirectToRestaurantHome = (history) => {
  history.push('/restaurant-home');
};

export const redirectToOrderHome = (history) => {
  history.push('/order-home');
};

export const redirectToOrderDetail = (history) => {
  history.push('/order-detail');
};

export const redirectToFoodDetail = (history) => {
  history.push('/food-item-details');
};

export const redirectToPackageMenuTimer = (history) => {
  history.push('/menu-remaining-time');
};

export const redirectToTipHome = (history) => {
  history.push('/order/tips');
};

export const redirectToPaymentHome = (history) => {
  history.push('/order/payment');
};

export const redirectToCreditCardDetails = (history) => {
  history.push('/order/payment/credit-card-detail');
};

export const redirectToPaymentConfirm = (history) => {
  history.push(`/confirm-payment`);
};

export const isOrderedPackageMenuExpired = (menuId, orderedPackageMenuList) => {
  let isExpired = false;
  const orderedMenu =
    orderedPackageMenuList &&
    orderedPackageMenuList.find((orderedMenu) => orderedMenu.id === menuId);
  if (orderedMenu) {
    const { packageStartTime, lastTimeToOrder } = orderedMenu; // timeBoundDuration
    const nowTimeStamp = new Date().getTime();
    isExpired =
      packageStartTime + minuteToMilliSecond(lastTimeToOrder) - nowTimeStamp >=
      0
        ? false
        : true;
  }
  return isExpired;
};

// thunk function to clear redux store/session storage
export const unAuthenticateApp = () => async (dispatch, getState) => {
  sessionStorage.clear();
  dispatch(resetAppState());
};

export const findMenuInMenuList = (menuList, menuId, foundMenuList = []) => {
  menuList.forEach((menu) => {
    if (menu.subMenus) {
      // food item can be mapped with only leaf level menus
      return findMenuInMenuList(menu.subMenus, menuId, foundMenuList);
    } else if (menu.id === menuId) {
      foundMenuList.push(menu);
    }
  });

  return foundMenuList;
};

export const findFoodItemInMenu = (menuList, foodItem) => {
  if (menuList) {
    let foodItemsList = [];
    // const selectedMenu = menuList.find((menu) => menu.id === foodItem.menuId);

    // let foundMenuList = [];
    let foundMenuList = findMenuInMenuList(menuList, foodItem.menuId);
    let selectedMenu =
      foundMenuList && foundMenuList.length && foundMenuList[0];

    function findFoodItems(foodCategories) {
      foodCategories.map((category) => {
        if (category.subFoodCategories) {
          // food item can be mapped with only leaf level menus
          findFoodItems(category.subFoodCategories);
        } else {
          foodItemsList = [...foodItemsList, ...category.foodItems];
        }
        return category;
      });
    }

    if (selectedMenu && selectedMenu.foodCategories) {
      findFoodItems(selectedMenu.foodCategories);
    }

    const menuFoodItem = foodItemsList.find(
      (menuFoodItem) =>
        menuFoodItem.id ===
        (foodItem.orderItemChoices ? foodItem.foodItemId : foodItem.id),
    );
    if (menuFoodItem) {
      const { id, rootParentId } = selectedMenu;

      return { ...menuFoodItem, rootParentId, menuId: id };
    }
    return false;
  }
};

export const getFoodItemListFromMenuList = (menuList) => {
  if (menuList && menuList.length) {
    let foodItemsList = [],
      leafLevelMenuList = [];

    function findLeafLevelMenu(menuList) {
      menuList.forEach((menu) => {
        if (menu.subMenus) {
          // food item can be mapped with only leaf level menus
          return findLeafLevelMenu(menu.subMenus);
        } else {
          leafLevelMenuList.push(menu);
        }
      });
    }

    function findFoodItems(foodCategories) {
      foodCategories.map((category) => {
        if (category.subFoodCategories) {
          // food item can be mapped with only leaf level menus
          findFoodItems(category.subFoodCategories);
        } else if (category.foodItems && category.foodItems.length) {
          foodItemsList = [...foodItemsList, ...category.foodItems];
        }
        return category;
      });
    }

    findLeafLevelMenu(menuList);
    leafLevelMenuList.map((menu) => findFoodItems(menu.foodCategories));

    return foodItemsList;
  }
};

export const formatDateTime = (timestamp) => {
  const dateObj = new Date(timestamp);

  var dateOfMonth = dateObj.getDate();
  var month = dateObj.getMonth() + 1; // having to add 1 cause javascript starts indexing months from 0
  var year = dateObj.getFullYear();
  var hours = dateObj.getHours();
  var minutes = dateObj.getMinutes();

  var isAM = hours >= 12 ? false : true;

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  // var strDate = dateOfMonth + '/' + month + '/' + year + ' ';
  var strDate = year + '/' + month + '/' + dateOfMonth + ' ';
  var time = hours + ':' + minutes;
  var timeWithPeriodNotion = isAM
    ? i18n.t('common:timePeriod_AM', { time })
    : i18n.t('common:timePeriod_PM', { time });
  return strDate + ' ' + timeWithPeriodNotion;
};

export const getPriceIncludingTax = (priceWithTax, price, tax) => {
  return priceWithTax ? priceWithTax : price + tax;
};

export const getNumber = (value) => (!value || isNaN(value) ? 0 : value);

export const groupBy = (arr, prop) => {
  const map = new Map(Array.from(arr, (obj) => [obj[prop], []]));
  arr.forEach((obj) => map.get(obj[prop]).push(obj));
  return Array.from(map.values());
};

function addDays(date, days) {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
}

export const getTimeStampFromTimeString = (
  timeString,
  shouldPadAMinute,
  isFollowingDay,
) => {
  let [hours = 0, minutes = 0] = timeString.split(':');

  let dateTime = new Date(),
    seconds = 0,
    milliSeconds = 0;

  if (isFollowingDay) {
    dateTime = addDays(dateTime, 1);
  }

  if (shouldPadAMinute) {
    minutes = +minutes + 1;
  }

  dateTime.setHours(+hours, +minutes, +seconds, +milliSeconds);

  return dateTime.getTime();
};

import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  REMOVE_MENU_FROM_CART,
  INCREMENT_CART_ITEM_COUNT,
  DECREMENT_CART_ITEM_COUNT,
  SET_CART,
  SET_ORDER,
  INCREMENT_ORDERED_ITEM_COUNT,
  DECREMENT_ORDERED_ITEM_COUNT,
  REORDER_SAME_ITEMS,
  REMOVE_FROM_ORDERED_ITEM,
  SET_DISPLAY_ORDER,
} from '../action-types/cart';

import { CANCEL_ORDER } from '../action-types/nxt-order-type';
import {
  setGuestConfigToSessionStorage,
  setCartToSessionStorage,
  setLastTimeToOrderForAllYouCanEatInSessionStorage,
  setLastTimeToOrderForAllYouCanDrinkInSessionStorage,
  // getLastTimeToOrderForAllYouCanDrinkFromSessionStorage,
  // getLastTimeToOrderForAllYouCanEatFromSessionStorage,
  removeLastTimeToOrderForAllYouCanDrinkFromSessionStorage,
  removeLastTimeToOrderForAllYouCanEatFromSessionStorage,
  getCartFromSessionStorage,
  setOrderToSessionStorage,
} from '../actions/nxt-local-storage';
import {
  parseGuestConfig,
  minuteToMilliSecond,
  // checkIfAllYouCanEatMenuDisabled,
  // checkIfAllYouCanDrinkMenuDisabled,
  isOrderedPackageMenuExpired,
} from '../services/utility';
import { ALL_YOU_CAN_EAT, ALL_YOU_CAN_DRINK } from '../constants/order-status';
import nxtMenuTypes from '../constants/nxt-menu-types';

const minimumCartItemQuantity = 1;
// const minimumOrderedItemQuantity = 1;

const initialState = {
  items: getCartFromSessionStorage(), // cart items
  itemsIndex: 0, // cart items index
  order: null, // order object
  editOrderedItems: [], // copy of orderItems from order obj. when we edit an order we update this list instead of order
  showOrder: false,
  allYouCanEatTimer: false,
  allYouCanDrinkTimer: false,
  orderedPackageMenus: [],
};

const cartReducer = (state = initialState, action) => {
  const { type, payLoad } = action;

  switch (type) {
    case ADD_TO_CART: {
      let { items, editOrderedItems, itemsIndex } = state;

      let modifiedStateItems = [...items];
      let modifiedStateEditOrderedItems = [...editOrderedItems];
      let modifiedStateItemsIndex = itemsIndex;

      // special logic for package menu
      if (
        payLoad.itemCode === nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE
      ) {
        const existingPackageMenuDefaultItems = items.filter(
          (item) => item.isPackage,
        );
        // const { menuType: payLoadMenuType } = payLoad;

        if (payLoad.rootParentId && existingPackageMenuDefaultItems.length) {
          let cartItemIndex = existingPackageMenuDefaultItems.findIndex(
            (item) => item.rootParentId && item.menuType === payLoad.menuType,
          );
          // cartItemIndex = cartItemIndex >= 0 ? cartItemIndex : 0;
          // modifiedStateItems.splice(cartItemIndex, 1, payLoad);

          if (cartItemIndex !== -1) {
            modifiedStateItems.splice(cartItemIndex, 1, payLoad);
          } else {
            modifiedStateItems = [...modifiedStateItems, payLoad];
          }
        } else {
          modifiedStateItems = [...modifiedStateItems, payLoad];
        }

        // cartItemIndex = modifiedStateItems.findIndex(
        //   (item) =>
        //     item.itemCode ===
        //       nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE &&
        //     item.menuId === payLoad.menuId,
        // );
      } else {
        // special logic for package menu ends

        if (payLoad.orderId) {
          // we updated an already ordered item and adding back to cart
          const orderedItemIndex = modifiedStateEditOrderedItems.findIndex(
            (item) => item.id === payLoad.id,
          );
          modifiedStateEditOrderedItems.splice(orderedItemIndex, 1, payLoad);
        } else if (payLoad.index) {
          // we updated a cart item and adding back to cart
          const cartItemIndex = modifiedStateItems.findIndex(
            (item) => item.index === payLoad.index,
          );
          modifiedStateItems.splice(cartItemIndex, 1, payLoad);
        } else {
          modifiedStateItemsIndex++;
          modifiedStateItems = [
            ...modifiedStateItems,
            { ...payLoad, index: modifiedStateItemsIndex },
          ];
        }
      }

      setCartToSessionStorage(modifiedStateItems);
      return {
        ...state,
        items: modifiedStateItems,
        editOrderedItems: modifiedStateEditOrderedItems,
        itemsIndex: modifiedStateItemsIndex,
      };
    }

    case REMOVE_FROM_CART: {
      const index = payLoad;
      const newItems = state.items.filter((item) => item.index !== index);
      setCartToSessionStorage(newItems);
      return {
        ...state,
        items: newItems,
      };
    }

    case REMOVE_MENU_FROM_CART: {
      const menuId = payLoad;
      const newItems = state.items.filter((item) => item.menuId !== menuId);
      setCartToSessionStorage(newItems);
      return {
        ...state,
        items: newItems,
      };
    }

    case SET_CART: {
      const items = payLoad ? payLoad : [];
      setCartToSessionStorage(items);
      return {
        ...state,
        items,
      };
    }

    case SET_ORDER: {
      let items = [],
        orderedPackageMenus = [];
      let orderObj = null;
      let allYouCanEatTimer = false,
        allYouCanDrinkTimer = false;
      setOrderToSessionStorage(payLoad);
      if (
        payLoad &&
        payLoad.data &&
        payLoad.success &&
        payLoad.data.orderMenus
      ) {
        orderObj = payLoad.data;
        // let allYouCanEatTimer= false,  allYouCanDrinkTimer= false;

        setGuestConfigToSessionStorage(
          parseGuestConfig(payLoad.data.orderGuests),
        );
        payLoad.data.orderMenus.map((menu) => {
          const {
            id,
            name,
            menuType,
            parentMenu,
            rootParentId,
            isPackage,
            packagePrice,
            packagePriceTax,
            packagePriceIncludingTax,
            isTimeBound,
            timeBoundDuration,
            lastTimeToOrder,
            reminderTime,
            taxDecimal,
            packageStartTime,
          } = menu;
          if (isPackage) {
            orderedPackageMenus = [
              ...orderedPackageMenus,
              {
                id,
                name,
                menuType,
                parentMenu,
                rootParentId,
                packagePrice,
                packagePriceTax,
                packagePriceIncludingTax,
                isTimeBound,
                timeBoundDuration,
                lastTimeToOrder,
                reminderTime,
                taxDecimal,
                packageStartTime,
              },
            ];
          }

          const modifiedOrderItems = menu.orderItems.map((item) => {
            return {
              ...item,
              menuId: id,
              rootParentId: rootParentId,
              isPackage: isPackage,
              packagePrice: packagePrice,
              taxDecimal,
              packagePriceTax: packagePriceTax,
              packagePriceIncludingTax: packagePriceIncludingTax,
              menuName: name || menu.menuName,
            };
          });
          items = [...items, ...modifiedOrderItems];

          if (menu.menuType === ALL_YOU_CAN_EAT) {
            allYouCanEatTimer = true;
            setLastTimeToOrderForAllYouCanEatInSessionStorage(
              orderObj.packageStartTime +
                minuteToMilliSecond(menu.lastTimeToOrder),
            );
          }
          if (menu.menuType === ALL_YOU_CAN_DRINK) {
            allYouCanDrinkTimer = true;
            setLastTimeToOrderForAllYouCanDrinkInSessionStorage(
              orderObj.packageStartTime +
                minuteToMilliSecond(menu.lastTimeToOrder),
            );
          }

          return menu;
        });

        if (!allYouCanEatTimer) {
          removeLastTimeToOrderForAllYouCanEatFromSessionStorage();
        }

        if (!allYouCanDrinkTimer) {
          removeLastTimeToOrderForAllYouCanDrinkFromSessionStorage();
        }
      } else {
        removeLastTimeToOrderForAllYouCanEatFromSessionStorage();
        removeLastTimeToOrderForAllYouCanDrinkFromSessionStorage();
      }
      return {
        ...state,
        order: orderObj,
        editOrderedItems: items,
        allYouCanEatTimer,
        allYouCanDrinkTimer,
        orderedPackageMenus,
      };
    }

    case INCREMENT_CART_ITEM_COUNT: {
      const index = payLoad;
      const newItems = state.items.map((item) => {
        if (item.index === index) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      setCartToSessionStorage(newItems);
      return {
        ...state,
        items: newItems,
      };
    }

    case DECREMENT_CART_ITEM_COUNT: {
      const index = payLoad;
      const newItems = state.items.map((item) => {
        if (item.index === index && item.quantity > minimumCartItemQuantity) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });

      setCartToSessionStorage(newItems);
      return {
        ...state,
        items: newItems,
      };
    }

    case INCREMENT_ORDERED_ITEM_COUNT: {
      const id = payLoad;
      const newItems = state.editOrderedItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      return {
        ...state,
        editOrderedItems: newItems,
      };
    }

    case DECREMENT_ORDERED_ITEM_COUNT: {
      const id = payLoad;
      const newItems = state.editOrderedItems.map((item) => {
        if (item.id === id && item.quantity > minimumCartItemQuantity) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });

      return {
        ...state,
        editOrderedItems: newItems,
      };
    }

    case REMOVE_FROM_ORDERED_ITEM: {
      const id = payLoad;
      const newItems = state.editOrderedItems.map((item) => {
        if (item.id === id) {
          return { ...item, isRemoved: true };
        } else {
          return item;
        }
      });

      return {
        ...state,
        editOrderedItems: newItems,
      };
    }

    case REORDER_SAME_ITEMS: {
      let { items, order, itemsIndex, orderedPackageMenus } = state;
      let modifiedOrderItems,
        newCartItems = [...items];
      if (order) {
        order.orderMenus.map((menu) => {
          modifiedOrderItems = menu.orderItems.map((item) => {
            return {
              ...item,
              index: ++itemsIndex,
              menuId: menu.id,
              isPackage: menu.isPackage,
              packagePrice: menu.packagePrice,
              packagePriceTax: menu.packagePriceTax,
              packagePriceIncludingTax: menu.packagePriceIncludingTax,
              menuName: menu.name || item.menuName,
            };
          });
          modifiedOrderItems = modifiedOrderItems.filter(
            (foodItem) =>
              !isOrderedPackageMenuExpired(
                foodItem.menuId,
                orderedPackageMenus,
              ) &&
              foodItem.itemCode !==
                nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE,
          );

          if (modifiedOrderItems.length) {
            newCartItems = [...newCartItems, ...modifiedOrderItems];
          }

          // items = [...items, ...modifiedOrderItems];
          return menu;
        });
      }

      if (newCartItems.length > items.length) {
        setCartToSessionStorage(items);
        return {
          ...state,
          items: newCartItems,
          itemsIndex,
        };
      } else {
        return state;
      }
    }

    case CANCEL_ORDER: {
      return {
        ...state,
        order: null,
        items: [],
        editOrderedItems: [],
      };
    }

    case SET_DISPLAY_ORDER: {
      return {
        ...state,
        showOrder: payLoad,
      };
    }

    default:
      return state;
  }
};

export default cartReducer;

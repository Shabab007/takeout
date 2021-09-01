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

export const addToCart = (payLoad) => {
  return { type: ADD_TO_CART, payLoad: payLoad };
};

export const removeFromCart = (cartItemId) => {
  return { type: REMOVE_FROM_CART, payLoad: cartItemId };
};

export const removePackageMenuFromCart = (menuId) => {
  return { type: REMOVE_MENU_FROM_CART, payLoad: menuId };
};

export const removeFromOrderedItem = (orderItemId) => {
  return { type: REMOVE_FROM_ORDERED_ITEM, payLoad: orderItemId };
};

export const incrementCartItemCount = (cartItemId) => {
  return { type: INCREMENT_CART_ITEM_COUNT, payLoad: cartItemId };
};

export const decrementCartItemCount = (cartItemId) => {
  return { type: DECREMENT_CART_ITEM_COUNT, payLoad: cartItemId };
};

export const setCart = (cart) => {
  return { type: SET_CART, payLoad: cart };
};

export const setOrder = (order) => {
  return { type: SET_ORDER, payLoad: order };
};

export const incrementOrderedItemCount = (cartItemId) => {
  return { type: INCREMENT_ORDERED_ITEM_COUNT, payLoad: cartItemId };
};

export const decrementOrderedItemCount = (cartItemId) => {
  return { type: DECREMENT_ORDERED_ITEM_COUNT, payLoad: cartItemId };
};

export const reorderSameItems = () => {
  return { type: REORDER_SAME_ITEMS };
};

export const setDisplayOrder = (show) => {
  return { type: SET_DISPLAY_ORDER, payLoad: show };
};

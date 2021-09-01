import { connect } from 'react-redux';
import NxtCart from './nxt-cart';

import {
  removeFromCart,
  removePackageMenuFromCart,
  incrementCartItemCount,
  decrementCartItemCount,
  setOrder,
  setCart,
  incrementOrderedItemCount,
  decrementOrderedItemCount,
  removeFromOrderedItem,
  setDisplayOrder,
} from '../../../actions/cart';

// import { getTopMenus } from '../../../actions/nxt-food-menu-action';
import { cancelOrderToProps } from '../../../actions/nxt-order-action';
import { fetchMenus } from '../menu/menuSlice';

const mapDispatchToProps = {
  removeFromCart,
  removePackageMenuFromCart,
  incrementCartItemCount,
  decrementCartItemCount,
  setOrder,
  setCart,
  incrementOrderedItemCount,
  decrementOrderedItemCount,
  cancelOrderToProps,
  // getTopMenus,
  removeFromOrderedItem,
  setDisplayOrder,
  fetchMenus,
};

const mapStateToProps = (state) => {
  const { appState, cart, order } = state;
  const {
    orderedPackageMenus,
    removedOrderedItems,
    editOrderedItems,
    showOrder,
    items: cartItems,
  } = cart;
  return {
    appState,
    cartItems,
    order: cart.order,
    showOrder,
    editOrderedItems,
    removedOrderedItems,
    orderedPackageMenus,
    guests: order.guests,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NxtCart);

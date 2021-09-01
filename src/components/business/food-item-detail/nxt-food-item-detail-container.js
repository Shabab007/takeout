import { connect } from 'react-redux';
import {
  setChoiceCategories,
  incrementFoodPackageCount,
  decrementFoodPackageCount,
  setIsTakeOut,
} from '../../../actions/food-detail-actions';

import {
  addToCart,
  setOrder,
  setCart,
  incrementCartItemCount,
  incrementOrderedItemCount,
  setDisplayOrder,
} from '../../../actions/cart';

// import { getTopMenus } from '../../../actions/nxt-food-menu-action';
import NxtFoodItemDetail from './nxt-food-item-detail';
import { fetchMenus } from '../menu/menuSlice';

const mapDispatchToProps = {
  setChoiceCategories,
  incrementFoodPackageCount,
  decrementFoodPackageCount,
  addToCart,
  setOrder,
  setCart,
  incrementCartItemCount,
  incrementOrderedItemCount,
  setDisplayOrder,
  // getTopMenus,
  fetchMenus,
  setIsTakeOut,
};

const mapStateToProps = (state) => {
  const { appState, foodDetail, cart, order } = state;
  const {
    foodItem,
    bundlePrice,
    toppingPrice,
    toppingPriceIncludingTax,
    bundleCount,
    specialInstruction,
    toppingList,
    isRequiredToppingAdded,
  } = foodDetail;

  const { orderedPackageMenus } = cart;
  return {
    appState,
    foodItem,
    bundlePrice,
    toppingPrice,
    toppingPriceIncludingTax,
    bundleCount,
    specialInstruction,
    toppingList,
    isRequiredToppingAdded,
    cartItems: cart,
    order: cart.order,
    editOrderedItems: cart.editOrderedItems,
    orderedPackageMenus,
    menuId: order.menuId,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NxtFoodItemDetail);

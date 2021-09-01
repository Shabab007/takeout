import { connect } from 'react-redux';
import MenuDetailsHome from './nxt-menu-details-home';
import { addMenuIdToOrderState } from '../../../../actions/nxt-order-action';
import { setSelectedCategory } from '../menuSlice';

const mapDispatchToProps = (dispatch) => {
  return {
    // handleFoodItemSelect: (foodItem) => {
    //   dispatch(setFoodItem(foodItem));
    // },
    // handleCartFoodItems: (foodItem) => {
    //   dispatch(setCartFoodItem(foodItem));
    // },
    // handleStaffCall: (inputParams) => {
    //   dispatch(addStaffCall(inputParams));
    // },
    // handleCancelStaffCall: (id) => {
    //   dispatch(cancelStaffCall(id));
    // },
    handleAddMenuIdToOrderState: (menuId) => {
      dispatch(addMenuIdToOrderState(menuId));
    },
    setCategoryIndex: (index) => {
      dispatch(setSelectedCategory(index));
    },
  };
};

const mapStateToProps = (state) => {
  const { appState, cart, menuState, language } = state;
  return {
    appState,
    menuState,
    cart,
    language,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuDetailsHome);

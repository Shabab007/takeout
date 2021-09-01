import { connect } from 'react-redux';
import {
  getTopMenus,
  getFoodCategory,
  getFoodItems,
  getFoodItemById,
  downloadImage,
} from '../../../actions/nxt-food-menu-action';

import {
  addStaffCall,
  cancelStaffCall,
  addMenuIdToOrderState,
} from '../../../actions/nxt-order-action';
import { fetchAllStockInfo, fetchMenus } from './menuSlice';
import NxtMenuHome from './nxt-menu-home';

const mapDispatchToProps = (dispatch) => {
  return {
    handleFetchMenus: () => {
      dispatch(fetchMenus());
    },
    handleFetchStock: () => {
      dispatch(fetchAllStockInfo());
    },
    //
    handleTopMenuFetch: () => {
      dispatch(getTopMenus());
    },
    handleFoodCategoryFetch: (routepara) => {
      dispatch(getFoodCategory(routepara));
    },
    handleFoodItemsFetch: (routepara) => {
      dispatch(getFoodItems(routepara));
    },
    handleFoodItemByIdFetch: (routepara) => {
      dispatch(getFoodItemById(routepara));
    },
    handleStaffCall: (inputParams) => {
      dispatch(addStaffCall(inputParams));
    },
    handleCancelStaffCall: (id) => {
      dispatch(cancelStaffCall(id));
    },
    handleAddMenuIdToOrderState: (menuId) => {
      dispatch(addMenuIdToOrderState(menuId));
    },
    handleDownloadImage: (companyId, imageId) => {
      dispatch(downloadImage(companyId, imageId));
    },
  };
};

const mapStateToProps = ({ appState, cart, menuState, language }) => {
  const { order, orderedPackageMenus } = cart;
  return {
    appState,
    order,
    orderedPackageMenus,
    menuState,
    language,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NxtMenuHome);

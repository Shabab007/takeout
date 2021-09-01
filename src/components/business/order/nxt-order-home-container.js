import { connect } from 'react-redux';
import OrderHome from './nxt-order-home.js';
import { reorderSameItems } from '../../../actions/cart';

import {
  getTipConfigs
} from '../payment/paymentSlice'

import {
  addStaffCall,
  cancelStaffCall,
} from '../../../actions/nxt-order-action';

const mapDispatchToProps = (dispatch) => {
  return {
    reorderSameItems: () => {
      dispatch(reorderSameItems());
    },
    handleGetTipConfigs: async (companyId, branchId) => {
      let response = dispatch(getTipConfigs(companyId, branchId));
      return response;
    },
    handleStaffCall: (inputParams) => {
      dispatch(addStaffCall(inputParams));
    },
    handleCancelStaffCall: (id) => {
      dispatch(cancelStaffCall(id));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    editOrderedItems: state.cart.editOrderedItems,
    orderPayment: state.order,
    order: state.cart.order,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderHome);

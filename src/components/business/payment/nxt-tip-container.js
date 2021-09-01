import { connect } from 'react-redux';
import TipHome from './nxt-tip-home';
import {
  getTipConfigs
} from '../payment/paymentSlice';
import {getStaffConfigs} from '../../business/staff-call/staff-call-slice';

const mapDispatchToProps = (dispatch) => {
  return {
    handleGetTipConfigs: async (companyId, branchId) => {
      let response = dispatch(getTipConfigs(companyId, branchId));
      return response;
    },
    handleGetStaffConfigs: async (companyId, branchId) => {
      let response = dispatch(getStaffConfigs(companyId, branchId));
      return response;
    },
  };
};

const mapStateToProps = ({ appState, cart, order, paymentState }) => {
  return {
    appState,
    order: cart.order,
    orderPayment: order,
    payslip: order.payslip,
    paymentState,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TipHome);

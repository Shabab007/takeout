import { connect } from 'react-redux';
import { fetchPayment, fetchPaymentMethods, resetPaymentState, setSelectedPaymentMethod } from './paymentSlice';
import { setOrder } from '../../../actions/cart';

import PaymentHome from './nxt-payment-home';
import { resetAppState } from '../home/appStateSlice';

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPaymentMethods: () => {
      dispatch(fetchPaymentMethods());
    },
    setSelectedPaymentMethod: (paymentMethod) => {
      dispatch(setSelectedPaymentMethod(paymentMethod));
    },
    resetPaymentState: () => {
      dispatch(resetPaymentState());
    },
    fetchPayment: () => {
      dispatch(fetchPayment());
    },

    setOrder: (order) => {
      dispatch(setOrder(order));
    },
    resetAppState: () => {
      dispatch(resetAppState());
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentHome);

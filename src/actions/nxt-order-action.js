import axios from '../utils/axios';
import {
  SET_ORDER_GUEST_CONFIGURATION,
  SET_ORDER_RESPONSE,
  PAY_THE_ORDER_PAYMENT,
  CANCEL_ORDER,
  ADD_MENU_ID_TO_PROPS,
  ADD_INVOICE,
  RESET_PAYMENTS,
  SET_TIP_CONFIG
} from '../action-types/nxt-order-type';

import { setStaffCallId } from '../actions/nxt-local-storage';
// import { setError } from './error-actions';
// import { PAYMENT_UNSUCCESSFUL } from '../constants/error-code-enum';
import staffCallStatusEnum from '../constants/staff-call-status-enum';
// import { setError } from './error-actions';
// import { PAYMENT_UNSUCCESSFUL } from '../constants/error-code-enum';

export const setOrderGuests = (guests) => ({
  type: SET_ORDER_GUEST_CONFIGURATION,
  payload: {
    guests,
  },
});

export const addOrderGuests = (guests) => {
  return (dispatch, getState) => {
    dispatch(setOrderGuests(guests));
  };
};

export const setOrderResponse = (payload) => {
  return {
    type: SET_ORDER_RESPONSE,
    payload: payload,
  };
};

export const addStaffCall = (inputParams) => async (dispatch, getState) => {
  const url = '/user/staff-calls';
  await axios
    .post(url, inputParams)
    .then((res) => {
      setStaffCallId(res.data.data.id);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const cancelStaffCall = (id) => async (dispatch, getState) => {
  const url = '/user/staff-calls/' + id;
  await axios
    .patch(url, {
      id: id,
      status: staffCallStatusEnum.DROPPED,
    })
    .then((res) => {
      //console.log(res.data);
      //dispatch(cancelStaffCallToProps(res.data.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const setOrderPaymentToProps = (data) => ({
  type: PAY_THE_ORDER_PAYMENT,
  payload: {
    data,
  },
});
export const resetPayments = () => ({
  type: RESET_PAYMENTS,
});

// export const payOrderPayment = (data) => async (dispatch, getState) => {
//   const url = '/user/orders/' + data.orderId + '/payments';
//   await axios
//     .post(url, data)
//     .then((res) => {
//       dispatch(setOrderPaymentToProps(res.data.data));
//     })
//     .catch((err) => {
//       dispatch(setError(PAYMENT_UNSUCCESSFUL));
//       console.log(err);
//     });
// };

// export const getPaymentsByOrderId = (orderId) => async (dispatch, getState) => {
//   const url = '/user/orders/' + orderId + '/payments';
//   await axios
//     .get(url, {
//       orderId,
//     })
//     .then((res) => {
//       dispatch(setOrderPaymentToProps(res.data.data));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

export const setOrderEmptyToProps = () => ({
  type: CANCEL_ORDER,
  payload: {},
});

export const cancelOrderToProps = () => async (dispatch, getState) => {
  dispatch(setOrderEmptyToProps());
};

export const setMenuIdToOrderProps = (menuId) => ({
  type: ADD_MENU_ID_TO_PROPS,
  payload: {
    menuId,
  },
});

export const addMenuIdToOrderState = (menuId) => {
  return (dispatch, getState) => {
    dispatch(setMenuIdToOrderProps(menuId));
  };
};

export const setInvoice = (data) => ({
  type: ADD_INVOICE,
  payload: {
    data,
  },
});

export const setTipConfig = (data) => ({
  type: SET_TIP_CONFIG,
  payload: {
    data,
  },
});

// export const getInvoiceForAnOrder = (orderId) => async (dispatch, getState) => {
//   const url = '/user/orders/' + orderId + '/invoice';
//   let data = null;
//   await axios
//     .get(url, {
//       orderId,
//     })
//     .then((res) => {
//       data = res;
//       dispatch(setInvoice(res.data.data));
//     })
//     .catch((err) => {
//       console.log(err);
//       data = err.response;
//     });
//   return data;
// };

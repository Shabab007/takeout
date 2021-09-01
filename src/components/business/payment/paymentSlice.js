import { createSlice } from '@reduxjs/toolkit';
import {
  getInvoiceFromSessionStorage,
  getPaymentMethodsFromSessionStorage,
  setPaymentMethodsToSessionStorage,
  setPaymentDataToSessionStorage,
  getPaymentDataFromSessionStorage,
  getTipSettingsSessionStorage,
  setTipSettingsSessionStorage,
  removePaymentStateFromSessionStorage,
  setInvoiceToSessionStorage,
} from '../../../actions/nxt-local-storage';
import apiRequestStatusEnum from '../../../constants/api-request-status-enum';
import axios from '../../../utils/axios';

const initialState = {
  paymentMethods: {
    status: getPaymentMethodsFromSessionStorage()
      ? apiRequestStatusEnum.loadedFromCache
      : apiRequestStatusEnum.idle,
    data: getPaymentMethodsFromSessionStorage(),
    error: null,
  },
  invoice: {
    status: getInvoiceFromSessionStorage()
      ? apiRequestStatusEnum.loadedFromCache
      : apiRequestStatusEnum.idle,
    data: getInvoiceFromSessionStorage(),
    error: null,
  },
  selectedPaymentMethod: null,
  payment: {
    status: getPaymentDataFromSessionStorage()
      ? apiRequestStatusEnum.loadedFromCache
      : apiRequestStatusEnum.idle,
    data: getPaymentDataFromSessionStorage(),
    error: null,
  },
  tipSettings: {
    data: getTipSettingsSessionStorage(),
  }
};

export const fetchPaymentMethods = () => async (dispatch, getState) => {
  var companyId, branchId;
  try {
    const restaurantTableData = getState().appState.restaurantTable.data;
    companyId = restaurantTableData.company.id;
    branchId = restaurantTableData.branch.id;
  } catch (e) {
    console.warn('Error getting companyId');
    return;
  }

  const paymentMethodsUrl = `/common/companies/${companyId}/branches/${branchId}/payment-methods`;
  dispatch(setFetchPaymentMethodsStatus(apiRequestStatusEnum.loading));

  var response = null;
  try {
    response = await axios.get(paymentMethodsUrl);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setFetchPaymentMethodsStatus(apiRequestStatusEnum.succeeded));
      dispatch(setPaymentMethodsData(response.data.data));
    } else {
      dispatch(setFetchPaymentMethodsStatus(apiRequestStatusEnum.failed));
      dispatch(setPaymentMethodsError(response.data.exceptions));
    }
  } else {
    // network error
    dispatch(setFetchPaymentMethodsStatus(apiRequestStatusEnum.failed));
    dispatch(setPaymentMethodsError(response));
  }
};

export const fetchInvoice = () => async (dispatch, getState) => {
  let orderId, languageCode;
  try {
    const { cart, language } = getState();
    orderId = cart.order.id;
    languageCode = language.code;
  } catch (e) {
    console.warn(e);
  }

  if (!orderId) {
    return;
  }
  const fetchInvoiceUrl = `/user/orders/${orderId}/invoice?languageCode=${languageCode}`;
  dispatch(setFetchInvoiceStatus(apiRequestStatusEnum.loading));

  var response = null;
  try {
    response = await axios.get(fetchInvoiceUrl);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setFetchInvoiceStatus(apiRequestStatusEnum.succeeded));
      dispatch(setInvoiceData(response.data.data));
    } else {
      dispatch(setFetchInvoiceStatus(apiRequestStatusEnum.failed));
      dispatch(setInvoiceError(response.data.exceptions));
    }
  } else {
    // network error
    dispatch(setFetchInvoiceStatus(apiRequestStatusEnum.failed));
    dispatch(setInvoiceError(response));
  }
};

export const makePayment = (payload) => async (dispatch) => {
  const paymentUrl = `/user/orders/${payload.orderId}/payments`;
  dispatch(setPaymentStatus(apiRequestStatusEnum.loading));

  var response = null;
  try {
    response = await axios.post(paymentUrl, payload);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setPaymentStatus(apiRequestStatusEnum.succeeded));
      dispatch(setPaymentData(response.data.data));

      dispatch(fetchInvoice());
    } else {
      dispatch(setPaymentStatus(apiRequestStatusEnum.failed));
      dispatch(setPaymentError(response.data.exceptions));
    }
  } else {
    // network error
    dispatch(setPaymentStatus(apiRequestStatusEnum.failed));
    dispatch(setPaymentError(response));
  }
};

export const fetchPayment = () => async (dispatch, getState) => {
  let orderId;
  try {
    orderId = getState().cart.order.id;
  } catch (e) {
    console.warn(e);
  }

  if (!orderId) {
    return;
  }
  const fetchPaymentUrl = `/user/orders/${orderId}/payments`;
  dispatch(setFetchInvoiceStatus(apiRequestStatusEnum.loading));

  var response = null;
  try {
    response = await axios.get(fetchPaymentUrl);
  } catch (error) {
    response = error.response || error;
  }

  // if (response && response.data) {
  //   if (response.data.success) {
  //     dispatch(setFetchInvoiceStatus(apiRequestStatusEnum.succeeded));
  //     dispatch(setInvoiceData(response.data.data));
  //   } else {
  //     dispatch(setFetchInvoiceStatus(apiRequestStatusEnum.failed));
  //     dispatch(setInvoiceError(response.data.exceptions));
  //   }
  // } else {
  //   // network error
  //   dispatch(setFetchInvoiceStatus(apiRequestStatusEnum.failed));
  //   dispatch(setInvoiceError(response));
  // }
};

export const getTipConfigs = (companyId, branchId) => async (dispatch) => {
  const url = `/admin/companies/${companyId}/tip-configs?branchId=${branchId}`;
  var response = null;
  try {
    response = await axios.get(url);
    dispatch(setTipSettingsData(response.data.data));
  } catch (error) {
    response = error.response || error;
  }

  return response;
};

const paymentSlice = createSlice({
  name: 'paymentState',
  initialState,
  reducers: {
    // reset
    resetPaymentState: (state) => {
      // todo: reset session storages
      removePaymentStateFromSessionStorage();
      return initialState;
    },

    // paymentMethods
    setFetchPaymentMethodsStatus(state, { payload }) {
      state.paymentMethods.status = payload;
    },
    setPaymentMethodsData(state, { payload }) {
      state.paymentMethods.data = payload;
      setPaymentMethodsToSessionStorage(payload);
    },
    setPaymentMethodsError(state, { payload }) {
      state.paymentMethods.error = payload;
    },

    // selectedPaymentMethod
    setSelectedPaymentMethod(state, { payload }) {
      state.selectedPaymentMethod = payload;
    },

    // invoice
    setFetchInvoiceStatus(state, { payload }) {
      state.invoice.status = payload;
    },
    setInvoiceData(state, { payload }) {
      state.invoice.data = payload;
      setInvoiceToSessionStorage(payload);
    },
    setInvoiceError(state, { payload }) {
      state.invoice.error = payload;
    },

    // payment
    setPaymentStatus(state, { payload }) {
      state.payment.status = payload;
    },
    setPaymentData(state, { payload }) {
      state.payment.data = payload;
      setPaymentDataToSessionStorage(payload);
    },
    setPaymentError(state, { payload }) {
      state.payment.error = payload;
    },

    // Tip settings
    setTipSettingsData(state, { payload }) {
      state.tipSettings.data = payload;
      setTipSettingsSessionStorage(payload);
    },
  },
});

export const {
  // reset
  resetPaymentState,

  // paymentMethods
  setFetchPaymentMethodsStatus,
  setPaymentMethodsData,
  setPaymentMethodsError,
  setSelectedPaymentMethod,

  // invoice
  setFetchInvoiceStatus,
  setInvoiceData,
  setInvoiceError,

  // payment
  setPaymentStatus,
  setPaymentData,
  setPaymentError,

  // tip settings
  setTipSettingsData
} = paymentSlice.actions;

export default paymentSlice.reducer;

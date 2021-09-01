import { createSlice } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';
import statusEnum from '../../../constants/api-request-status-enum';
import {
  getCompanyConfigDataFromSessionStorage,
  getIsOrderMergedAndMovedFromSessionStorage,
  getIsMenuStaleBecauseOfPublishFromSessionStorage,
  setIsMenuStaleBecauseOfPublishToSessionStorage,
  getIsOrderTransferredFromSessionStorage,
  getScreenBlockerStatusFromSessionStorage,
  setScreenBlockerStatusToSessionStorage,
  getQRCodeFromSessionStorage,
  getRestaurantTableDataFromSessionStorage,
  getSessionDataFromSessionStorage,
  setCompanyConfigDataToSessionStorage,
  setIsOrderMergedAndMovedToSessionStorage,
  setIsOrderTransferredToSessionStorage,
  setQRCodeToSessionStorage,
  setRestaurantTableDataToSessionStorage,
  setSessionDataToSessionStorage,
} from '../../../actions/nxt-local-storage';

const initialState = {
  // status: statusEnum.idle,
  session: {
    status: statusEnum.idle,
    data: getSessionDataFromSessionStorage(),
    error: null,
  },
  restaurantTable: {
    status: statusEnum.idle,
    data: getRestaurantTableDataFromSessionStorage(),
    error: null,
  },
  companyConfig: {
    status: statusEnum.idle,
    data: getCompanyConfigDataFromSessionStorage(),
    error: null,
  },
  securityCode: {
    status: statusEnum.idle,
    data: getQRCodeFromSessionStorage() || { tableBookingNbr: '123' }, // todo for testing only. remove
    error: null,
  },
  fetchRestaurantTableLiveStatus: {
    status: statusEnum.idle,
    // data: null,
    error: null,
  },
  orderTransferred: getIsOrderTransferredFromSessionStorage(),
  orderMergedAndMoved: getIsOrderMergedAndMovedFromSessionStorage(),
  menuStaleBecauseOfPublish: getIsMenuStaleBecauseOfPublishFromSessionStorage(),
  screenBlocker: getScreenBlockerStatusFromSessionStorage(),
};

export const fetchRestaurantTableSession = (tableCode) => async (
  dispatch,
  getState,
) => {
  if (!tableCode) {
    console.warn('Did not receive required value tableCode');
    return;
  }

  const tableSessionUrl = '/auth/tables/sessions';
  dispatch(setSessionStatus(statusEnum.loading));

  var response = null;
  try {
    response = await axios.post(tableSessionUrl, tableCode);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setSessionStatus(statusEnum.succeeded));
      dispatch(setSessionData(response.data.data));
    } else {
      dispatch(setSessionStatus(statusEnum.failed));
      dispatch(setSessionError(response.data.exceptions));
    }
  } else {
    // network error
    dispatch(setSessionStatus(statusEnum.failed));
    dispatch(setSessionError(response));
  }
};

export const bookRestaurantTable = () => async (dispatch, getState) => {
  var tableCode;
  try {
    tableCode = getState().appState.session.data.tableCode;
  } catch (e) {
    console.warn('Error getting table code');
    return;
  }

  const bookTableUrl = `/user/restaurant-tables/${tableCode}`;
  dispatch(setRestaurantTableStatus(statusEnum.loading));

  var response = null;
  try {
    response = await axios.post(bookTableUrl, { tableCode });
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setRestaurantTableStatus(statusEnum.succeeded));
      dispatch(setRestaurantTableData(response.data.data));
    } else {
      dispatch(setRestaurantTableStatus(statusEnum.failed));
      dispatch(setRestaurantTableError(response.data.exceptions));
    }
  } else {
    //network error
    dispatch(setRestaurantTableStatus(statusEnum.failed));
    dispatch(setRestaurantTableError(response));
  }
};

export const fetchCompanyConfig = () => async (dispatch, getState) => {
  var companyId, branchId;
  try {
    const restaurantTableData = getState().appState.restaurantTable.data;
    companyId = restaurantTableData.company.id;
    branchId = restaurantTableData.branch.id;
  } catch (e) {
    console.warn('Error getting companyId');
    return;
  }

  const companyConfigUrl = `/common/companies/${companyId}/company-configs?branchId=${branchId}`;
  dispatch(setCompanyConfigStatus(statusEnum.loading));

  var response = null;
  try {
    response = await axios.get(companyConfigUrl);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setCompanyConfigStatus(statusEnum.succeeded));
      let companyConfig = {};
      response.data.data.map(({ configName, configValue }) => {
        companyConfig[configName] = configValue;
        return null;
      });
      dispatch(setCompanyConfigData(companyConfig));
    } else {
      dispatch(setCompanyConfigStatus(statusEnum.failed));
      dispatch(setCompanyConfigError(response.data.exceptions));
    }
  } else {
    //network error
    dispatch(setCompanyConfigStatus(statusEnum.failed));
    dispatch(setCompanyConfigError(response));
  }
};

export const verifyQRcodeValidity = (qrCode) => async (dispatch, getState) => {
  var tableId;
  try {
    tableId = getState().appState.restaurantTable.data.id;
  } catch (e) {
    console.warn('Error getting tableId');
    return;
  }

  const verifySecurityCodeUrl = `/common/restaurant-tables/${tableId}/valid-qr-code/${qrCode}`;
  dispatch(setSecurityCodeStatus(statusEnum.loading));

  var response = null;
  try {
    response = await axios.get(verifySecurityCodeUrl);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setSecurityCodeStatus(statusEnum.succeeded));

      dispatch(setSecurityCodeData(response.data.data));
    } else {
      dispatch(setSecurityCodeStatus(statusEnum.failed));
      dispatch(setSecurityCodeError(response.data.exceptions));
    }
  } else {
    //network error
    dispatch(setSecurityCodeStatus(statusEnum.failed));
    dispatch(setSecurityCodeError(response));
  }
};

export const fetchLiveRestaurantTableStatus = () => async (
  dispatch,
  getState,
) => {
  var tableCode; //companyId, branchId,
  try {
    const { appState } = getState();
    const { session } = appState; // restaurantTable

    // companyId = restaurantTable.data.company.id;
    // branchId = restaurantTable.data.branch.id;
    tableCode = session.data.tableCode;
  } catch (e) {
    console.warn('Error getting companyId');
    return;
  }

  if (!tableCode) {
    // || !companyId || !branchId
    console.warn('Required parameter null');
    return;
  }

  const liveTableStatusUrl = `/user/restaurant-tables/table-code/${tableCode}`;
  dispatch(setFetchLiveRestaurantTableStatus(statusEnum.loading));

  var response = null;
  try {
    response = await axios.get(liveTableStatusUrl);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setFetchLiveRestaurantTableStatus(statusEnum.succeeded));
    } else {
      dispatch(setFetchLiveRestaurantTableStatus(statusEnum.failed));
      dispatch(
        setFetchLiveRestaurantTableStatusError(response.data.exceptions),
      );
    }
  } else {
    // network error
    dispatch(setFetchLiveRestaurantTableStatus(statusEnum.failed));
    dispatch(setFetchLiveRestaurantTableStatusError(response));
  }

  return response;
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    // reset
    resetAppState: (state) => initialState,

    // session
    setSessionStatus(state, { payload }) {
      state.session.status = payload;
    },
    setSessionData(state, { payload }) {
      state.session.data = payload;
      payload && setSessionDataToSessionStorage(payload);
    },
    setSessionError(state, { payload }) {
      state.session.error = payload;
    },

    // restaurantTable
    setRestaurantTableStatus(state, { payload }) {
      state.restaurantTable.status = payload;
    },
    setRestaurantTableData(state, { payload }) {
      state.restaurantTable.data = payload;
      payload && setRestaurantTableDataToSessionStorage(payload);
    },
    setRestaurantTableError(state, { payload }) {
      state.restaurantTable.error = payload;
    },

    // companyConfig
    setCompanyConfigStatus(state, { payload }) {
      state.companyConfig.status = payload;
    },
    setCompanyConfigData(state, { payload }) {
      state.companyConfig.data = payload;
      payload && setCompanyConfigDataToSessionStorage(payload);
    },
    setCompanyConfigError(state, { payload }) {
      state.companyConfig.error = payload;
    },

    // security code
    setSecurityCodeStatus(state, { payload }) {
      state.securityCode.status = payload;
    },
    setSecurityCodeData(state, { payload }) {
      state.securityCode.data = payload;
      payload && setQRCodeToSessionStorage(payload);
    },
    setSecurityCodeError(state, { payload }) {
      state.securityCode.error = payload;
    },

    // order transfer
    setOrderTransferred(state, { payload }) {
      state.orderTransferred = payload;
      setIsOrderTransferredToSessionStorage(payload);
    },
    setOrderMergedAndMoved(state, { payload }) {
      state.orderMergedAndMoved = payload;
      setIsOrderMergedAndMovedToSessionStorage(payload);
    },

    // menuStaleForPublishReason
    setMenuStaleBecauseOfPublish(state, { payload }) {
      state.menuStaleBecauseOfPublish = payload;
      setIsMenuStaleBecauseOfPublishToSessionStorage(payload);
    },

    setScreenBlocker(state, { payload }) {
      state.screenBlocker = payload;
      setScreenBlockerStatusToSessionStorage(payload);
    },

    // liveRestaurantTableStatus_Status
    setFetchLiveRestaurantTableStatus(state, { payload }) {
      state.fetchRestaurantTableLiveStatus.status = payload;
    },
    setFetchLiveRestaurantTableStatusError(state, { payload }) {
      state.fetchRestaurantTableLiveStatus.error = payload;
    },
  },
});

export const {
  // session
  setSessionStatus,
  setSessionData,
  setSessionError,

  // restaurantTable
  setRestaurantTableStatus,
  setRestaurantTableData,
  setRestaurantTableError,

  // companyConfig
  setCompanyConfigStatus,
  setCompanyConfigData,
  setCompanyConfigError,

  // security code
  setSecurityCodeStatus,
  setSecurityCodeData,
  setSecurityCodeError,

  // table transfer
  setOrderTransferred,
  setOrderMergedAndMoved,
  setMenuStaleBecauseOfPublish,

  setScreenBlocker,

  // fetchLiveRestaurantTableStatus
  setFetchLiveRestaurantTableStatus,
  setFetchLiveRestaurantTableStatusError,

  // reset
  resetAppState,
} = appStateSlice.actions;

export default appStateSlice.reducer;

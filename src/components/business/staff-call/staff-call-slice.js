import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import statusEnum from '../../../constants/api-request-status-enum';
import {
  getCurrentStaffCallFromSessionStorage,
  getStaffCallOptionsFromSessionStorage,
  setStaffCallOptionsToSessionStorage,
  setCurrentStaffCallToSessionStorage,
  removeCurrentStaffCallToSessionStorage,
  setStuffSettingsSessionStorage
} from '../../../actions/nxt-local-storage';
import staffCallStatusEnum from '../../../constants/staff-call-status-enum';

const initialState = {
  options: {
    status: statusEnum.idle,
    data: getStaffCallOptionsFromSessionStorage(),
    error: null,
  },
  currentCall: {
    status: statusEnum.idle,
    data: getCurrentStaffCallFromSessionStorage(),
    error: null,
  },
};

// fetch staff call options list, right after we get table info. cache it to session storage to prevent re-fetching on app refresh.
// store current call in state also cache it. on cancel we remove current call information. on accept call, we update the call status.

export const fetchStaffCallOptions = () => async (dispatch, getState) => {
  var branchId;
  try {
    const { appState } = getState();
    branchId = appState.restaurantTable.data.branch.id;
  } catch (e) {
    console.warn(e);
  }

  const fetchStaffCallOptionsUrl = `/user/branches/${branchId}/staff-call-options`;

  dispatch(setOptionsStatus(statusEnum.loading));
  var response = null;
  try {
    response = await axios.get(fetchStaffCallOptionsUrl);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setOptionsStatus(statusEnum.succeeded));
      dispatch(setOptions(response.data.data));
    } else {
      dispatch(setOptionsStatus(statusEnum.failed));
      dispatch(setOptionsError(response.data.exceptions));
    }
  } else {
    dispatch(setOptionsStatus(statusEnum.failed));
    dispatch(setOptionsError(response));
  }
};

export const createStaffCall = (staffCallOptions) => async (
  dispatch,
  getState,
) => {
  try {
    var restaurantTableData = getState().appState.restaurantTable.data;
    var { id: restaurantTableId, company, branch } = restaurantTableData;
    var companyId = company && company.id;
    var branchId = branch && branch.id;
  } catch (e) {
    console.warn(e);
  }

  const staffCallUrl = '/user/staff-calls';

  dispatch(setCurrentCallApiStatus(statusEnum.loading));
  var response = null;
  try {
    const staffCallConfig = {
      companyId,
      branchId,
      restaurantTableId,
      callOptions: staffCallOptions,
      callTime: new Date().getTime(),
    };

    response = await axios.post(staffCallUrl, staffCallConfig);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setCurrentCallApiStatus(statusEnum.succeeded));
      dispatch(setCurrentCallData(response.data.data));
    } else {
      dispatch(setCurrentCallApiStatus(statusEnum.failed));
      dispatch(setCurrentCallError(response.data.exceptions));
    }
  } else {
    dispatch(setCurrentCallApiStatus(statusEnum.failed));
    dispatch(setCurrentCallError(response));
  }

  return response;
};

export const cancelStaffCall = () => async (dispatch, getState) => {
  var callId;
  try {
    const { staffCall } = getState();
    callId = staffCall.currentCall.data.id;
  } catch (e) {
    console.warn(e);
  }
  const cancelStaffCallUrl = `/user/staff-calls/${callId}`;

  dispatch(setCurrentCallApiStatus(statusEnum.loading));
  var response = null;
  try {
    response = await await axios.patch(cancelStaffCallUrl, {
      id: callId,
      status: staffCallStatusEnum.DROPPED,
    });
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setCurrentCallApiStatus(statusEnum.succeeded));
      // dispatch(setCurrentCallData(response.data.data));
      dispatch(resetCurrentCallState());
    } else {
      dispatch(setCurrentCallApiStatus(statusEnum.failed));
      dispatch(setCurrentCallError(response.data.exceptions));
    }
  } else {
    dispatch(setCurrentCallApiStatus(statusEnum.failed));
    dispatch(setCurrentCallError(response));
  }
};

export const getStaffConfigs = (companyId, branchId) => async (dispatch) => {
  const url = `/user/companies/${companyId}/branches/${branchId}/staffs`;
  var response = null;
  try {
    response = await axios.get(url);
    dispatch(setStaffSettingsData(response.data.data));
  } catch (error) {
    response = error.response || error;
  }

  return response;
};


const staffCallSlice = createSlice({
  name: 'nxt-staff-call',
  initialState,
  reducers: {
    // staff-call-options
    setOptionsStatus(state, { payload }) {
      state.options.status = payload;
    },
    setOptions(state, { payload }) {
      state.options.data = payload;
      setStaffCallOptionsToSessionStorage(payload);
    },
    setOptionsError(state, action) {
      const { payload } = action;
      state.options.error = payload;
    },
    // create call
    setCurrentCallApiStatus(state, { payload }) {
      state.currentCall.status = payload;
    },
    setCurrentCallData(state, { payload }) {
      state.currentCall.data = payload;
      setCurrentStaffCallToSessionStorage(payload);
    },
    setCurrentCallError(state, { payload }) {
      state.currentCall.error = payload;
    },
    resetCurrentCallState: (state) => {
      removeCurrentStaffCallToSessionStorage();
      return {
        ...state,
        currentCall: { status: statusEnum.idle, data: null, error: null },
      };
    },
    setStaffSettingsData(state, { payload }) {
      state.staffSettings = payload;
      setStuffSettingsSessionStorage(payload);
    },
  },
});

export const {
  setOptionsStatus,
  setOptions,
  setOptionsError,
  setCurrentCallApiStatus,
  setCurrentCallData,
  setCurrentCallError,
  resetCurrentCallState,
  setStaffSettingsData
} = staffCallSlice.actions;
export default staffCallSlice.reducer;

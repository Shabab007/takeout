import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import statusEnum from '../../../constants/api-request-status-enum';
import {
  setLanguagesToSessionStorage,
  getLanguagesFromSessionStorage,
  getLanguageCodeFromLocalStorage,
  setLanguageCodeToLocalStorage,
} from '../../../actions/nxt-local-storage';

const defaultSelectedLanguageCode = 'en-US';
const initialState = {
  status: statusEnum.idle,
  data: getLanguagesFromSessionStorage(),
  error: null,
  code: getLanguageCodeFromLocalStorage() || defaultSelectedLanguageCode,
  codePreExisedInLocalStorage: Boolean(getLanguageCodeFromLocalStorage()),
};

export const fetchLanguages = () => async (dispatch, getState) => {
  const getLanguagesUrl = '/common/languages';
  dispatch(setStatus(statusEnum.loading));
  var response = null;
  try {
    response = await axios.get(getLanguagesUrl);
  } catch (error) {
    response = error.response || error;
  }

  if (response && response.data) {
    if (response.data.success) {
      dispatch(setStatus(statusEnum.succeeded));
      dispatch(setLanguages(response.data.data));
    } else {
      dispatch(setStatus(statusEnum.failed));
      dispatch(setError(response.data.exceptions));
    }
  } else {
    dispatch(setStatus(statusEnum.failed));
    dispatch(setError(response));
  }
};

const languagesSlice = createSlice({
  name: 'nxt-languages',
  initialState,
  reducers: {
    setStatus(state, { payload }) {
      state.status = payload;
    },
    setLanguages(state, { payload }) {
      let items = payload.map((lang, index) => {
        return {
          name: lang.name,
          value: lang.langCode,
          icon: lang.name,
          displayOrder: lang.displayOrder,
        };
      });

      items.sort((a, b) => {
        if (a.displayOrder === b.displayOrder) return 0;
        return a.displayOrder < b.displayOrder ? -1 : 1;
      });
      state.data = items;
      setLanguagesToSessionStorage(items);
    },
    selectLanguageCode(state, { payload }) {
      state.code = payload;
      setLanguageCodeToLocalStorage(payload);
    },
    setError(state, action) {
      const { payload } = action;
      state.error = payload;
    },
  },
});

export const {
  setStatus,
  setLanguages,
  selectLanguageCode,
  setError,
} = languagesSlice.actions;
export default languagesSlice.reducer;

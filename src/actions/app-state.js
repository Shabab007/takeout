import axios from '../utils/axios';

export const getCompanyConfig = (companyId) => async (dispatch, getState) => {
  let data = null;
  const url = '/common/companies/' + companyId + '/company-configs';
  await axios
    .get(url)
    .then((res) => {
      data = res;
    })
    .catch((err) => {
      console.log(err);
      data = err.response;
    });
  return data;
};

export const getTableSession = (payload) => async (dispatch, getState) => {
  let data = null;
  const setTableCodeUrl = '/auth/tables/sessions';
  await axios
    .post(setTableCodeUrl, payload)
    .then((res) => {
      data = res;
    })
    .catch((err) => {
      data = err.response;
    });
  return data;
};

export const bookTable = (tableCode) => async (dispatch, getState) => {
  let response;
  const setTableCodeUrl = `/user/restaurant-tables/${tableCode}`;
  await axios
    .post(setTableCodeUrl, { tableCode })
    .then((res) => {
      response = res;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

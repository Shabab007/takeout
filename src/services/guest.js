import axios from '../utils/axios';
import { OCCUPIED } from '../constants/nxt-table-statuses';
const orderUrl = 'user/orders';

export const createOrder = async (payload) => {
  let response;
  await axios
    .post(orderUrl, payload)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response ? err.response.data : err;
    });
  return response;
};

export const cancelOrderItem = async (id) => {
  let response;
  await axios
    .delete(`${orderUrl + '/items'}/${id}`)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const cancelOrder = async (id) => {
  let response;
  await axios
    .patch(`${orderUrl}/cancel/${id}`)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const getOrderById = async (id) => {
  let response;
  await axios
    .get(`${orderUrl}/${id}`)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const checkTableStatus = async (tableCode) => {
  const url = `/user/restaurant-tables/${tableCode}/orders/live`;
  let response;
  await axios
    .get(url)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const addOrderItem = async (payload, orderId) => {
  let response;
  await axios
    .post(`${orderUrl}/${orderId}/items`, payload)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const removeOrderItem = async (itemId) => {
  let response;
  await axios
    .delete(`${orderUrl}/items/${itemId}`)
    .then((res) => {
      response = res;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const updateOrderItem = async (payload, orderId) => {
  let response;
  await axios
    .patch(`${orderUrl}/${orderId}/items/${payload.foodItemId}`, payload)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const updateOrder = async (orderId, payload) => {
  let response;
  await axios
    .patch(`${orderUrl}/${orderId}/combined-items`, payload)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const updateGuestCount = async (orderId, payload) => {
  let response;
  await axios
    .patch(`${orderUrl}/${orderId}/order-guests`, payload)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const getStockInfo = async (companyId, branchId, foodItemId) => {
  let response;
  await axios
    .get(`/common/companies/${companyId}/branches/${branchId}/food-items/${foodItemId}/current-stock`)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const getAllStockInfo = async (companyId, branchId) => {
  let response;
  await axios
    .get(`/common/companies/${companyId}/branches/${branchId}/current-stock`)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const checkQRcodeValidity = async (tableId, qrCode) => {
  let response;
  await axios
    .get(`/common/restaurant-tables/${tableId}/valid-qr-code/${qrCode}`)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};

export const updateTableStatusToOccupied = async (restaurantTableId) => {
  let response;
  await axios
    .patch(`/user/restaurant-tables/${restaurantTableId}/status/${OCCUPIED}`)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response ? err.response.data : err;
    });
  return response;
};

export const isFirstVisitQA = async (payload) => {
  let response;
  await axios
    .post(`/user/visitor-qa`, payload)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err.response;
    });
  return response;
};


export const getRecommendedMenus = async (companyId,branchId,languageCode) => {
  const currentTimeString = getFormattedTimeString();
  const url = `/user/companies/${companyId}/branches/${branchId}/recommended-food-items?languageCode=${languageCode}&currentTime=${currentTimeString}`;
  var response = null;
  try {
    response = await axios.get(url);
  } catch (error) {
    response = error.response || error;
  }

  return response;
};


const getFormattedTimeString = () => {
  const currentTime = new Date();
  function padWithInitialZero(num) {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }

  let currentHours = padWithInitialZero(currentTime.getHours());
  let currentMinutes = padWithInitialZero(currentTime.getMinutes());

  return currentHours + ':' + currentMinutes;
};

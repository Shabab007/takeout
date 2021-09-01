// session
export const setSessionDataToSessionStorage = (session) => {
  sessionStorage.setItem('session', JSON.stringify(session));
};
export const getSessionDataFromSessionStorage = () => {
  const session = sessionStorage.getItem('session');
  return session ? JSON.parse(session) : null;
};
export const removeSessionDataFromSessionStorage = () => {
  return sessionStorage.removeItem('session');
};

// security code
export const setQRCodeToSessionStorage = (tableBookingSecurity) => {
  sessionStorage.setItem(
    'tableBookingSecurity',
    JSON.stringify(tableBookingSecurity),
  );
};
export const getQRCodeFromSessionStorage = () => {
  const tableBookingSecurity = sessionStorage.getItem('tableBookingSecurity');
  return tableBookingSecurity ? JSON.parse(tableBookingSecurity) : null;
};
export const removeQRCodeFromSessionStorage = () => {
  return sessionStorage.removeItem('tableBookingSecurity');
};

// isOrderTransferred
export const setIsOrderTransferredToSessionStorage = (isOrderTransferred) => {
  sessionStorage.setItem(
    'isOrderTransferred',
    JSON.stringify(isOrderTransferred),
  );
};
export const getIsOrderTransferredFromSessionStorage = () => {
  const isOrderTransferred = sessionStorage.getItem('isOrderTransferred');
  return isOrderTransferred ? JSON.parse(isOrderTransferred) : null;
};

// isOrderMergedAndMoved
export const setIsOrderMergedAndMovedToSessionStorage = (
  isOrderMergedAndMoved,
) => {
  sessionStorage.setItem(
    'isOrderMergedAndMoved',
    JSON.stringify(isOrderMergedAndMoved),
  );
};
export const getIsOrderMergedAndMovedFromSessionStorage = () => {
  const isOrderMergedAndMoved = sessionStorage.getItem('isOrderMergedAndMoved');
  return isOrderMergedAndMoved ? JSON.parse(isOrderMergedAndMoved) : null;
};

// isMenuStaleBecauseOfPublish
export const setIsMenuStaleBecauseOfPublishToSessionStorage = (
  isMenuStaleBecauseOfPublish,
) => {
  sessionStorage.setItem(
    'isMenuStaleBecauseOfPublish',
    JSON.stringify(isMenuStaleBecauseOfPublish),
  );
};
export const getIsMenuStaleBecauseOfPublishFromSessionStorage = () => {
  const isMenuStaleBecauseOfPublish = sessionStorage.getItem(
    'isMenuStaleBecauseOfPublish',
  );
  return isMenuStaleBecauseOfPublish
    ? JSON.parse(isMenuStaleBecauseOfPublish)
    : null;
};

// screen blocker
export const getScreenBlockerStatusFromSessionStorage = () => {
  const isScreenBlocked = sessionStorage.getItem('isScreenBlocked');
  return isScreenBlocked ? JSON.parse(isScreenBlocked) : null;
};

export const setScreenBlockerStatusToSessionStorage = (isScreenBlocked) => {
  sessionStorage.setItem('isScreenBlocked', JSON.stringify(isScreenBlocked));
};

// restaurantTable
export const setRestaurantTableDataToSessionStorage = (restaurantTable) => {
  sessionStorage.setItem('restaurantTable', JSON.stringify(restaurantTable));
};
export const getRestaurantTableDataFromSessionStorage = () => {
  const restaurantTable = sessionStorage.getItem('restaurantTable');
  return restaurantTable ? JSON.parse(restaurantTable) : null;
};
export const removeRestaurantTableDataFromSessionStorage = () => {
  return sessionStorage.removeItem('restaurantTable');
};

// companyConfig
export const setCompanyConfigDataToSessionStorage = (companyConfig) => {
  sessionStorage.setItem('companyConfig', JSON.stringify(companyConfig));
};
export const getCompanyConfigDataFromSessionStorage = () => {
  const companyConfig = sessionStorage.getItem('companyConfig');
  return companyConfig ? JSON.parse(companyConfig) : null;
};
export const removeCompanyConfigDataFromSessionStorage = () => {
  return sessionStorage.removeItem('companyConfig');
};

// languages
export const setLanguagesToSessionStorage = (languages) => {
  sessionStorage.setItem('languages', JSON.stringify(languages));
};
export const getLanguagesFromSessionStorage = () => {
  const languages = sessionStorage.getItem('languages');
  return languages ? JSON.parse(languages) : [];
};

// language code
export const setLanguageCodeToLocalStorage = (code) => {
  localStorage.setItem('languageCode', code);
};
export const getLanguageCodeFromLocalStorage = () => {
  return localStorage.getItem('languageCode');
};

// tableInfo
export const setTableInformationToSessionStorage = (tableInfo) => {
  sessionStorage.setItem('table', JSON.stringify(tableInfo));
};
export const getTableInformationFromSessionStorage = () => {
  return sessionStorage.getItem('table');
};
export const removeTableInformationFromSessionStorage = () => {
  return sessionStorage.removeItem('table');
};

// cart
export const setCartToSessionStorage = (cart) => {
  sessionStorage.setItem('cart', JSON.stringify(cart));
};

export const getCartFromSessionStorage = () => {
  const cart = sessionStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

// menus
export const setMenusToSessionStorage = (menus) => {
  sessionStorage.setItem('menus', JSON.stringify(menus));
};

export const getMenusFromSessionStorage = () => {
  const menus = sessionStorage.getItem('menus');
  return menus ? JSON.parse(menus) : null;
};

export const setOriginalMenusToSessionStorage = (menus) => {
  sessionStorage.setItem('originalMenus', JSON.stringify(menus));
};

export const getOriginalMenusFromSessionStorage = () => {
  const menus = sessionStorage.getItem('originalMenus');
  return menus ? JSON.parse(menus) : null;
};

// order
export const setOrderToSessionStorage = (order) => {
  sessionStorage.setItem('order', JSON.stringify(order));
};

export const getOrderFromSessionStorage = () => {
  const order = sessionStorage.getItem('order');
  return order ? JSON.parse(order) : null;
};

// lastTimeToOrder
export const setLastTimeToOrderForAllYouCanEatInSessionStorage = (time) => {
  sessionStorage.setItem('lastTimeToOrderAllYouCanEat', time);
};

export const getLastTimeToOrderForAllYouCanEatFromSessionStorage = () => {
  return sessionStorage.getItem('lastTimeToOrderAllYouCanEat');
};

export const removeLastTimeToOrderForAllYouCanEatFromSessionStorage = () => {
  sessionStorage.removeItem('lastTimeToOrderAllYouCanEat');
};

export const setLastTimeToOrderForAllYouCanDrinkInSessionStorage = (time) => {
  sessionStorage.setItem('lastTimeToOrderAllYouCanDrink', time);
};

export const getLastTimeToOrderForAllYouCanDrinkFromSessionStorage = () => {
  return sessionStorage.getItem('lastTimeToOrderAllYouCanDrink');
};

export const removeLastTimeToOrderForAllYouCanDrinkFromSessionStorage = () => {
  sessionStorage.removeItem('lastTimeToOrderAllYouCanDrink');
};

// guest config
export const setGuestConfigToSessionStorage = (guest) => {
  sessionStorage.setItem('guests', JSON.stringify(guest));
};
export const getGuestConfigFromSessionStorage = () => {
  return sessionStorage.getItem('guests');
};

// staff call
export const setStaffCallId = (id) => {
  sessionStorage.setItem('staffCallId', id);
};
export const getStaffCallId = () => {
  return sessionStorage.getItem('staffCallId');
};

// staff call options
export const setStaffCallOptionsToSessionStorage = (staffCallOptions) => {
  sessionStorage.setItem('staffCallOptions', JSON.stringify(staffCallOptions));
};
export const getStaffCallOptionsFromSessionStorage = () => {
  const staffCallOptions = sessionStorage.getItem('staffCallOptions');
  return staffCallOptions ? JSON.parse(staffCallOptions) : null;
};

export const setCurrentStaffCallToSessionStorage = (currentStaffCall) => {
  sessionStorage.setItem('currentStaffCall', JSON.stringify(currentStaffCall));
};
export const getCurrentStaffCallFromSessionStorage = () => {
  const currentStaffCall = sessionStorage.getItem('currentStaffCall');
  return currentStaffCall ? JSON.parse(currentStaffCall) : null;
};
export const removeCurrentStaffCallToSessionStorage = () => {
  sessionStorage.removeItem('currentStaffCall');
};

// payment methods
export const setPaymentMethodsToSessionStorage = (paymentMethods) => {
  sessionStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
};
export const getPaymentMethodsFromSessionStorage = () => {
  const paymentMethods = sessionStorage.getItem('paymentMethods');
  return paymentMethods ? JSON.parse(paymentMethods) : null;
};

// invoice
export const setInvoiceToSessionStorage = (invoice) => {
  sessionStorage.setItem('invoice', JSON.stringify(invoice));
};
export const getInvoiceFromSessionStorage = () => {
  const invoice = sessionStorage.getItem('invoice');
  return invoice ? JSON.parse(invoice) : null;
};

// payment
export const setPaymentDataToSessionStorage = (payment) => {
  sessionStorage.setItem('payment', JSON.stringify(payment));
};
export const getPaymentDataFromSessionStorage = () => {
  const payment = sessionStorage.getItem('payment');
  return payment ? JSON.parse(payment) : null;
};

// tip settings
export const setTipSettingsSessionStorage = (tipSettings) => {
  sessionStorage.setItem('tipSettings', JSON.stringify(tipSettings));
};
export const getTipSettingsSessionStorage = () => {
  const tipSettings = sessionStorage.getItem('tipSettings');
  return tipSettings ? JSON.parse(tipSettings) : null;
};

export const removePaymentStateFromSessionStorage = () => {
  sessionStorage.removeItem('payment');
  sessionStorage.removeItem('invoice');
};
export const setStuffSettingsSessionStorage = () => {
  const stuffSettings = sessionStorage.getItem('stuffSettings');
  return stuffSettings ? JSON.parse(stuffSettings) : null;
};
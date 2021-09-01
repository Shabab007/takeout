import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';

import appStateSlice from '../components/business/home/appStateSlice';
import languagesSlice from '../components/business/language-selector/languagesSlice';
import staffCallSlice from '../components/business/staff-call/staff-call-slice';
import paymentSlice from '../components/business/payment/paymentSlice';
import menuSlice from '../components/business/menu/menuSlice';

import errorReducer from './error-reducer';
import orderReducer from './nxt-order-reducer';
import foodDetailReducer from './food-detail-reducer';
import cartReducer from './cart-reducer';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    form: formReducer,
    appState: appStateSlice,
    language: languagesSlice,
    menuState: menuSlice,
    staffCall: staffCallSlice,
    paymentState: paymentSlice,
    cart: cartReducer,
    order: orderReducer,
    foodDetail: foodDetailReducer,
    error: errorReducer,
  });

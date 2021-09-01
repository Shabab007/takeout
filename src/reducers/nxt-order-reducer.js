import {
  SET_ORDER_GUEST_CONFIGURATION,
  PAY_THE_ORDER_PAYMENT,
  CANCEL_ORDER,
  ADD_MENU_ID_TO_PROPS,
  ADD_INVOICE,
  RESET_PAYMENTS,
  SET_TIP_CONFIG
} from '../action-types/nxt-order-type';

const initialState = {
  order: [],
  tipConfig: {}
};

export default function orderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ORDER_GUEST_CONFIGURATION: {
      return {
        ...state,
        guests: payload.guests,
      };
    }
    case PAY_THE_ORDER_PAYMENT: {
      return {
        ...state,
        payments: payload.data,
      };
    }
    case RESET_PAYMENTS: {
      return {
        ...state,
        payments: null,
      };
    }
    case CANCEL_ORDER: {
      return {
        ...state,
        order: null,
      };
    }
    case ADD_MENU_ID_TO_PROPS: {
      return {
        ...state,
        menuId: payload.menuId,
      };
    }
    case ADD_INVOICE: {
      return {
        ...state,
        payslip: payload.data,
      };
    }
    case SET_TIP_CONFIG: {
      return {
        ...state,
        tipConfig: payload.data,
      };
    }

    default:
      return state;
  }
}

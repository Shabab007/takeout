import { HIDE_ERROR } from '../action-types/error-types'; // SET_ERROR

const initState = {
  error: null,
  isOpen: false,
};

export default function errorReducer(state = initState, action) {
  const { error } = action;

  if (error) {
    return {
      error: error,
      isOpen: true,
    };
  } else if (action.type === HIDE_ERROR) {
    return {
      error: null,
      isOpen: false,
    };
  }

  return state;
}

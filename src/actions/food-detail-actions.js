import {
  SET_FOOD_ITEM,
  INCREMENT_FOOD_PACKAGE_COUNT,
  DECREMENT_FOOD_PACKAGE_COUNT,
  SET_CHOICE_CATEGORIES,
  TOGGLE_CHECKBOX_OPTION,
  UPDATE_FOOD_PACKAGE_PRICE_WITH_TOPPINGS,
  SET_SPECIAL_INSTRUCTION,
  SET_IS_TAKEOUT,
  // SET_MENU_LIST,
} from '../action-types/food-detail-types';

export const setFoodItem = (foodItem) => {
  return {
    type: SET_FOOD_ITEM,
    payLoad: foodItem,
  };
};

export const incrementFoodPackageCount = () => {
  return { type: INCREMENT_FOOD_PACKAGE_COUNT };
};

export const decrementFoodPackageCount = () => {
  return { type: DECREMENT_FOOD_PACKAGE_COUNT };
};

export const setChoiceCategories = (payLoad) => {
  return { type: SET_CHOICE_CATEGORIES, payLoad: payLoad };
};

export const toggleCheckboxOption = (option) => {
  return { type: TOGGLE_CHECKBOX_OPTION, payLoad: option };
};

export const updateFoodPackagePriceWithToppings = () => {
  return { type: UPDATE_FOOD_PACKAGE_PRICE_WITH_TOPPINGS };
};

export const setSpecialInstruction = (text) => {
  return { type: SET_SPECIAL_INSTRUCTION, payLoad: text };
};

export const setIsTakeOut = (value) => {
  return { type: SET_IS_TAKEOUT, payLoad: value };
};

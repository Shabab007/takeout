import {
  SET_FOOD_ITEM,
  SET_FOOD_PACKAGE_PRICE,
  INCREMENT_FOOD_PACKAGE_COUNT,
  DECREMENT_FOOD_PACKAGE_COUNT,
  SET_CHOICE_CATEGORIES,
  TOGGLE_CHECKBOX_OPTION,
  UPDATE_FOOD_PACKAGE_PRICE_WITH_TOPPINGS,
  SET_SPECIAL_INSTRUCTION,
  SET_MENU_LIST,
  SET_IS_TAKEOUT,
} from '../action-types/food-detail-types';
import { findFoodItemInMenu } from '../services/utility';

const minimumFoodItemCount = 1;

const initialState = {
  foodItem: undefined,
  bundlePrice: 0,
  bundlePriceIncludingTax: 0,
  toppingPrice: 0,
  toppingPriceIncludingTax: 0,
  bundleCount: minimumFoodItemCount,
  toppingCount: 0,
  toppingList: [],
  isRequiredToppingAdded: false,
  choicesCategories: undefined,
  specialInstruction: '',
  menuList: [],
  takeOut: null,
};

function foodDetailReducer(state = initialState, action) {
  const { type, payLoad } = action;

  switch (type) {
    case SET_FOOD_ITEM: {
      let modifiedCategories;
      let isRequiredToppingAdded = true;
      let specialInstruction; // = payLoad.specialInstruction;
      let bundlePrice = 0; // = payLoad.price;
      let bundlePriceIncludingTax = 0;
      let toppingPrice = 0;
      let toppingPriceIncludingTax = 0;
      let bundleCount = minimumFoodItemCount; // = payLoad.quantity ? payLoad.quantity : 1;
      let toppingCount = 0;
      let toppingList = [];

      const { menuList } = state;
      let menuChoicesCategories;
      let menuFoodItem;

      if (menuList) {
        // let foodItemsList = [];
        // const selectedMenu = menuList.find(
        //   (menu) => menu.id === payLoad.menuId,
        // );

        // if (selectedMenu && selectedMenu.foodCategories) {
        //   selectedMenu.foodCategories.map((category) => {
        //     foodItemsList = [...foodItemsList, ...category.foodItems];
        //     return category;
        //   });
        // }

        // menuFoodItem = foodItemsList.find(
        //   (menuFoodItem) =>
        //     menuFoodItem.id ===
        //     (payLoad.orderItemChoices ? payLoad.foodItemId : payLoad.id),
        // );

        // if (menuFoodItem) {
        //   menuChoicesCategories = menuFoodItem.choicesCategories;
        // }

        menuFoodItem = findFoodItemInMenu(menuList, payLoad);
        if (menuFoodItem) {
          menuChoicesCategories = menuFoodItem.choicesCategories;
        }
      }

      if (payLoad.orderItemChoices) {
        // food item came from cart
        const { index, id, foodItemId, orderId } = payLoad;
        menuFoodItem = {
          ...menuFoodItem,
          quantity: payLoad.quantity,
          specialInstruction: payLoad.specialInstruction,
          itemDeliveryType: payLoad.itemDeliveryType,
          index,
          id,
          foodItemId,
          menuId: payLoad.menuId,
          orderId,
          status: payLoad.status,
        };
        bundleCount = payLoad.quantity
          ? payLoad.quantity
          : minimumFoodItemCount;
        bundlePrice = payLoad.price;
        bundlePriceIncludingTax = payLoad.priceIncludingTax;
        specialInstruction = payLoad.specialInstruction;
      } else {
        // menuFoodItem = payLoad;
        bundlePrice = payLoad.price;
        bundlePriceIncludingTax = payLoad.priceIncludingTax;
      }

      if (menuChoicesCategories) {
        let orderItemChoices = payLoad.orderItemChoices;

        modifiedCategories = menuChoicesCategories.map((category) => {
          let modifiedCategory = { ...category };
          let isDefaultSelected = true;
          if (category.isRequired) {
            isRequiredToppingAdded = false;
            isDefaultSelected = false;
            // if the category is required, make the item selected of which isDefault property is true;
            // if none of the items is isDefault, make the first item selected
          }
          modifiedCategory.choicesItems = modifiedCategory.choicesItems.map(
            (item) => {
              let modifiedItem = { ...item, checked: false };
              if (item.isDefault) {
                modifiedItem = { ...modifiedItem, checked: true };
                toppingList = [...toppingList, modifiedItem];
                toppingCount++;
                toppingPrice += modifiedItem.price;
                toppingPriceIncludingTax += modifiedItem.priceIncludingTax;
                bundlePrice += modifiedItem.price;
                bundlePriceIncludingTax += modifiedItem.priceIncludingTax;
                isRequiredToppingAdded = true;
                isDefaultSelected = true;
              }

              if (orderItemChoices) {
                orderItemChoices.map((orderChoiceItem) => {
                  if (orderChoiceItem.choicesItemId === item.id) {
                    modifiedItem = { ...modifiedItem, checked: true };
                    toppingList = [...toppingList, modifiedItem];
                    toppingCount++;
                    toppingPrice += orderChoiceItem.price;
                    toppingPriceIncludingTax +=
                      orderChoiceItem.priceIncludingTax;
                    bundlePrice += orderChoiceItem.price;
                    bundlePriceIncludingTax +=
                      orderChoiceItem.priceIncludingTax;
                    isRequiredToppingAdded = true;
                  }
                  return orderChoiceItem;
                });
              }
              return modifiedItem;
            },
          );

          if (!isDefaultSelected) {
            // if none of the items is isDefault, make the first item selected
            modifiedCategory.choicesItems = modifiedCategory.choicesItems.map(
              (item, index) => {
                let modifiedItem = { ...item };
                // eslint-disable-next-line eqeqeq
                if (index == 0) {
                  modifiedItem = { ...modifiedItem, checked: true };
                  toppingList = [...toppingList, modifiedItem];
                  toppingCount++;
                  toppingPrice += modifiedItem.price;
                  toppingPriceIncludingTax += modifiedItem.priceIncludingTax;
                  bundlePrice += modifiedItem.price;
                  bundlePriceIncludingTax += modifiedItem.priceIncludingTax;
                  isRequiredToppingAdded = true;
                  isDefaultSelected = true;
                }
                return modifiedItem;
              },
            );
          }

          return modifiedCategory;
        });
      }

      return {
        ...state,
        foodItem: menuFoodItem,
        bundlePrice,
        bundlePriceIncludingTax,
        toppingPrice,
        toppingPriceIncludingTax,
        bundleCount,
        toppingCount,
        toppingList,
        isRequiredToppingAdded,
        choicesCategories: modifiedCategories,
        specialInstruction,
      };
    }

    case UPDATE_FOOD_PACKAGE_PRICE_WITH_TOPPINGS: {
      const { foodItem, choicesCategories } = state;
      let bundlePrice = foodItem.price;
      let bundlePriceIncludingTax = foodItem.priceIncludingTax;
      let updatedToppingPrice = 0,
        updatedToppingPriceIncludingTax = 0;
      let toppingCount = 0;
      let toppingList = [];

      choicesCategories.map((category) => {
        category.choicesItems.map((item) => {
          if (item.checked) {
            bundlePrice = bundlePrice + (foodItem.isPackage ? 0 : +item.price);
            bundlePriceIncludingTax =
              bundlePriceIncludingTax +
              (foodItem.isPackage ? 0 : +item.priceIncludingTax);
            toppingCount += 1;
            updatedToppingPrice += item.price;
            updatedToppingPriceIncludingTax += item.priceIncludingTax;
            toppingList = [...toppingList, item];
          }
          return item;
        });
        return category;
      });

      let isRequiredToppingAdded = true;
      for (let i = 0; i < choicesCategories.length; i++) {
        if (choicesCategories[i].isRequired) {
          isRequiredToppingAdded = false;
          for (let j = 0; j < choicesCategories[i].choicesItems.length; j++) {
            if (choicesCategories[i].choicesItems[j].checked) {
              isRequiredToppingAdded = true;
            }
          }
          if (!isRequiredToppingAdded) {
            break;
          }
        }
      }

      return {
        ...state,
        bundlePrice,
        bundlePriceIncludingTax,
        toppingCount,
        toppingPrice: updatedToppingPrice,
        toppingPriceIncludingTax: updatedToppingPriceIncludingTax,
        toppingList,
        isRequiredToppingAdded,
      };
    }

    case INCREMENT_FOOD_PACKAGE_COUNT: {
      return {
        ...state,
        bundleCount: state.bundleCount + 1,
      };
    }

    case DECREMENT_FOOD_PACKAGE_COUNT: {
      if (state.bundleCount > minimumFoodItemCount) {
        return {
          ...state,
          bundleCount: state.bundleCount - 1,
        };
      }
      break;
    }

    case SET_CHOICE_CATEGORIES: {
      const { modifiedCategories, isRequiredToppingAdded } = payLoad;
      return {
        ...state,
        choicesCategories: modifiedCategories,
        isRequiredToppingAdded,
      };
    }

    case TOGGLE_CHECKBOX_OPTION: {
      const { categoryId, choiceId } = action.payLoad;

      const modifiedCategories = state.choicesCategories.map((category) => {
        if (category.id === categoryId) {
          const modifiedItems = category.choicesItems.map((item) => {
            if (item.id === choiceId) {
              return {
                ...item,
                checked: !item.checked,
              };
            }
            if (category.isMultivalued) {
              return item;
            }
            return {
              ...item,
              checked: false,
            };
          });
          const modifiedCategory = {
            ...category,
            choicesItems: modifiedItems,
          };
          return modifiedCategory;
        }
        return category;
      });

      return {
        ...state,
        choicesCategories: modifiedCategories,
      };
    }

    case SET_SPECIAL_INSTRUCTION: {
      return {
        ...state,
        specialInstruction: payLoad,
      };
    }

    case SET_MENU_LIST: {
      return {
        ...state,
        menuList: payLoad,
      };
    }

    case SET_IS_TAKEOUT: {
      return {
        ...state,
        takeOut: payLoad,
      };
    }

    default:
      return state;
  }
}

export default foodDetailReducer;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

import NxtTopBarItems from '../../composite/nxt-top-bar-items';
import NxtTopBar from '../../basic/nxt-top-bar';
import IxTxtBox from '../../basic/ix-txt-box';
import IxTitle from '../../basic/ix-title';
import NxtImage from '../../basic/nxt-image';
import {FOOD_ITEM_DETAIL} from '../../basic/nxt-image';
import IxTab from '../../basic/ix-tab';
import IxButton from '../../basic/ix-button';
import IxToggleSwitch from '../../basic/ix-toggle-switch';
import IxIncrementDecrementCounter from '../../basic/ix-increment-decrement-counter';
import NxtStaticFooter from '../../basic/nxt-static-footer';
import NxtFallback from '../../basic/nxt-fallback';

import {
  createOrder,
  updateOrder,
  getStockInfo,
} from '../../../services/guest';
import { getGuestConfigFromSessionStorage } from '../../../actions/nxt-local-storage';
import {
  isOrderedPackageMenuExpired,
  makeOrderMenus,
  redirectToMenu,
  redirectToSearch,
} from '../../../services/utility';

import { IMAGE_URL } from '../../../constants/ix-image-links';
import snackbarTypes from '../../../constants/snackbar-types';
import companyConfigEnum from '../../../constants/company-config-enum';
import {
  INVALID_MIN_VALUE,
  NOT_ALLOWED,
} from '../../../constants/error-code-enum';
import LanguageNamespaces from '../../../constants/language-namespaces';
import {
  SENT_TO_KITCHEN,
  // AVAILABLE,
  TAKE_AWAY,
  EAT_HERE,
  PLACED,
  GUEST,
  MALE,
  FEMALE,
  KIDS,
  OTHERS,
} from '../../../constants/order-status';
import { CANCELLED } from '../../../constants/order-status';

import NxtFoodCustomization from './nxt-food-customization';
import { useStyles } from './food-item-detail-style';
import NxtPriceDisplay from '../../composite/nxt-price-display';

const NxtFoodItemDetail = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const diningGuests = JSON.parse(getGuestConfigFromSessionStorage());

  const operatorSubtract = '-';
  const operatorAddition = '+';

  const {
    appState,
    foodItem,
    history,
    bundlePrice,
    // bundlePriceIncludingTax,
    toppingPrice,
    // toppingPriceIncludingTax,
    bundleCount,
    incrementFoodPackageCount,
    decrementFoodPackageCount,
    specialInstruction,
    isRequiredToppingAdded,
    toppingList,
    addToCart,
    setOrder,
    setCart,
    cartItems,
    orderedPackageMenus,
    // incrementCartItemCount,
    // incrementOrderedItemCount,
    order,
    // editOrderedItems = [],
    menuId,
    setDisplayOrder,
    // getTopMenus,
    fetchMenus,
    setIsTakeOut,
  } = props;

  const { restaurantTable, companyConfig } = appState;
  const companyConfigData = companyConfig.data;
  const {
    id: restaurantTableId,
    company,
    branch,
    section,
  } = restaurantTable.data;
  const companyId = company.id;
  const { id: branchId, name: branchName } = branch;
  const sectionId = section.id;

  let tableCharge,
    takeAwayTax,
    diningTax,
    kidDiscount,
    displayItemAmountPerPortion,
    displayItemCookingTime,
    displayItemCalories,
    displayItemTakeout;

  try {
    tableCharge = +companyConfigData[companyConfigEnum.TABLE_CHARGES];
    takeAwayTax = +companyConfigData[companyConfigEnum.TAKE_AWAY_TAX];
    diningTax = +companyConfigData[companyConfigEnum.EAT_IN_TAX];
    kidDiscount = +companyConfigData[companyConfigEnum.KIDS_DISCOUNT];
    displayItemAmountPerPortion =
      companyConfigData[companyConfigEnum.DISPLAY_ITEM_AMOUNT_PER_PORTION];
    displayItemCookingTime =
      companyConfigData[companyConfigEnum.DISPLAY_ITEM_COOKING_TIME];
    displayItemCalories =
      companyConfigData[companyConfigEnum.DISPLAY_ITEM_CALORIES];
    displayItemTakeout =
      companyConfigData[companyConfigEnum.DISPLAY_ITEM_TAKE_OUT];
  } catch (e) {
    console.warn(e);
  }

  const totalGuestCountWithoutKids =
    diningGuests.female + diningGuests.male + diningGuests.others;
  const totalGuestCount = totalGuestCountWithoutKids + diningGuests.kid;

  let orderGuests = [];
  if (diningGuests.female > 0) {
    orderGuests.push({
      guestCategory: FEMALE,
      noOfPerson: diningGuests.female,
    });
  }
  if (diningGuests.kid > 0) {
    orderGuests.push({ guestCategory: KIDS, noOfPerson: diningGuests.kid });
  }
  if (diningGuests.male > 0) {
    orderGuests.push({ guestCategory: MALE, noOfPerson: diningGuests.male });
  }
  if (diningGuests.others > 0) {
    orderGuests.push({
      guestCategory: OTHERS,
      noOfPerson: diningGuests.others,
    });
  }

  const [takeOut, setTakeOut] = useState(false);
  const [soldOut, setSoldOut] = useState(false);
  const [t] = useTranslation([LanguageNamespaces.menus]);
  const minimumFoodItemCount = 1;
  const languageCode = useSelector((state) => state.language.code);

  const updateTakeOutValue = (value) => {
    setIsTakeOut(value); // redux state
    setTakeOut(value); // component state
  };

  const foodItemPriceIncludingTax =
    foodItem &&
    foodItem.price +
      (foodItem.price * (takeOut ? takeAwayTax : diningTax)) / 100;

  const toppingPriceIncludingTax =
    toppingPrice + (toppingPrice * (takeOut ? takeAwayTax : diningTax)) / 100;

  useEffect(() => {
    if (!foodItem) {
      redirectToMenu(history, menuId);
    } else {
      foodItem.itemDeliveryType === TAKE_AWAY
        ? updateTakeOutValue(true)
        : updateTakeOutValue(false);
    }
  }, [foodItem, history, menuId]);

  const handleFoodItemCount = (operator) => {
    if (operator === operatorSubtract) {
      decrementFoodPackageCount();
    } else if (operator === operatorAddition) {
      // if (isLimitedQtyPerOrder && bundleCount === totalGuestCount) {
      //   return;
      // }
      incrementFoodPackageCount();
    }
  };

  const handleAddToCart = async () => {
    if (foodItem.isDailyOpeningEnabled) {
      const currentStockQueryResponse = await getStockInfo(
        companyId,
        branchId,
        foodItem.id,
      );
      if (
        currentStockQueryResponse &&
        currentStockQueryResponse.data < bundleCount
      ) {
        const quantity = currentStockQueryResponse.data;
        let title = '',
          message = '';
        if (!quantity) {
          // sold out
          setSoldOut(true);
          // getTopMenus({ companyId, branchId });
          fetchMenus();
          message = t('common:SoldOutMessage');
        } else if (quantity < bundleCount) {
          // insufficient stock
          title = t('common:QuantityNotAvailableSnackbarTitle');
          message = t('common:QuantityNotAvailableMessage', { quantity });
        }

        enqueueSnackbar(
          {
            title: title,
            message: message,
            variant: 'outlined',
            severity: snackbarTypes.error,
          },
          {
            persist: true,
            // autoHideDuration: 6000,
          },
        );
        return;
      }
    }

    const newCartItem = {
      ...foodItem,
      menuId: foodItem.orderId || foodItem.index ? foodItem.menuId : menuId,
      foodItemId:
        foodItem.orderId || foodItem.index ? foodItem.foodItemId : foodItem.id,
      itemDeliveryType: takeOut ? TAKE_AWAY : EAT_HERE, //TODO: EAT_HERE NEED TO BE UPDATED AS ENUM
      quantity: bundleCount,
      price: foodItem.price,
      priceIncludingTax: foodItemPriceIncludingTax,
      discount: 0,
      tax: foodItem.tax,
      payable: bundlePrice * bundleCount,
      status: foodItem.orderId ? foodItem.status : SENT_TO_KITCHEN,
      specialInstruction: specialInstruction,
      orderItemChoices: toppingList.map((topping) => ({
        choicesItemId: topping.id,
        price: topping.price,
        priceIncludingTax:
          topping.price +
          (topping.price * (takeOut ? takeAwayTax : diningTax)) / 100,
        tax: (topping.price * (takeOut ? takeAwayTax : diningTax)) / 100,
      })),
    };

    addToCart(newCartItem);
    if (foodItem.orderId || foodItem.index) {
      history.push(`/cart`);
      setDisplayOrder(true);
    } else {
      const { menuId, rootParentId } = foodItem;
      redirectToMenu(history, rootParentId ? rootParentId : menuId);
    }
  };

  const tabList = [
    {
      label: t('OrderCustomizationTabLabel'),
      content: (
        <div className={classes.tabContentWrapper}>
          <NxtFoodCustomization takeOut={takeOut} />
        </div>
      ),
    },
    {
      label: t('NutritionFactsTabLabel'),
      content: (
        <div className={classes.tabContentWrapper}>
          <IxTxtBox
            primary={foodItem ? foodItem.nutritionInfo : ''}
            primaryVariant="body1"
            align="left"
          ></IxTxtBox>
        </div>
      ),
    },
    {
      label: t('AllergenTabLabel'),
      content: (
        <div className={classes.tabContentWrapper}>
          <IxTxtBox
            primary={foodItem ? foodItem.allergyInfo : ''}
            primaryVariant="body1"
            align="left"
          ></IxTxtBox>
        </div>
      ),
    },
  ];

  if (!foodItem) {
    return <NxtFallback />;
  }

  const {
    isHalal,
    isAlcoholAdded,
    isKidItem,
    isVegetarian,
    isLimitedQtyPerOrder,
  } = foodItem;

  //TAX CALCULATION
  let yetDiningTax = 0,
    yetTakeAwayTax = 0,
    yetTableCharge = 0,
    yetToOrderTotal = 0,
    yetToOrderItemsSubtotal = 0,
    total = 0,
    yetKidDiscount = 0;

  yetToOrderItemsSubtotal = bundlePrice * bundleCount;
  //Calculate kid discount
  if (foodItem.isKidItem) {
    let subTotal = 0;
    subTotal = yetToOrderItemsSubtotal;
    yetKidDiscount += (subTotal * kidDiscount) / 100;
  }

  //Dining tax (if it is dining here or eat here)
  // eslint-disable-next-line eqeqeq
  if (takeOut == false) {
    let subTotal = 0;
    subTotal = yetToOrderItemsSubtotal;
    yetDiningTax += (subTotal * diningTax) / 100;
  }

  //Take away tax
  // eslint-disable-next-line eqeqeq
  if (takeOut == true) {
    let subTotal = 0;
    subTotal = yetToOrderItemsSubtotal;
    yetTakeAwayTax += (subTotal * takeAwayTax) / 100;
  }

  yetToOrderTotal =
    yetToOrderItemsSubtotal +
    yetDiningTax +
    yetTakeAwayTax +
    yetTableCharge -
    yetKidDiscount;

  total = yetToOrderTotal;

  const applyCompanyConfigPriceRounding = (price) => {
    if (
      companyConfigData[companyConfigEnum.PRICE_ROUNDING] ===
      companyConfigEnum.ROUND_OFF
    ) {
      return Math.round(price);
    } else if (
      companyConfigData[companyConfigEnum.PRICE_ROUNDING] ===
      companyConfigEnum.ROUND_UP
    ) {
      return Math.ceil(price);
    } else if (
      companyConfigData[companyConfigEnum.PRICE_ROUNDING] ===
      companyConfigEnum.ROUND_DOWN
    ) {
      return Math.floor(price);
    }

    return price;
  };

  //Order
  const redirectToOrder = () => {
    history.push('/order-result');
  };

  // Create order

  const makeOrderPayload = () => {
    const itemToOrder = {
      name: foodItem.name,
      menuId: menuId,
      foodItemId: foodItem.id,
      photo: foodItem.photo,
      itemDeliveryType: takeOut ? TAKE_AWAY : EAT_HERE, //TODO: EAT_HERE NEED TO BE UPDATED AS ENUM
      quantity: bundleCount,
      price: bundlePrice,
      discount: 0,
      tax: 0,
      isPackage: foodItem.isPackage,
      payable: applyCompanyConfigPriceRounding(bundlePrice * bundleCount),
      prepareDuration: foodItem.prepareDuration,
      status: SENT_TO_KITCHEN,
      specialInstruction: specialInstruction,
      orderItemChoices: toppingList.map((topping) => ({
        choicesItemId: topping.id,
        //choicesCategoryId: topping.choicesCategoryId,
        price: topping.price,
        priceIncludingTax:
          topping.price +
          (topping.price * (takeOut ? takeAwayTax : diningTax)) / 100,
        tax: (topping.price * (takeOut ? takeAwayTax : diningTax)) / 100,
      })),
    };

    return {
      orderBy: GUEST,
      branchId: branchId,
      restaurantTableId: +restaurantTableId,
      sectionId: sectionId,
      status: PLACED,
      orderGuests: orderGuests,
      orderMenus: makeOrderMenus([itemToOrder]),
      tableCharge,
      totalTableCharge: !takeOut
        ? applyCompanyConfigPriceRounding(
            tableCharge * totalGuestCountWithoutKids,
          )
        : 0,
      takeAwayTax: takeOut
        ? applyCompanyConfigPriceRounding(
            (bundlePrice * bundleCount * takeAwayTax) / 100,
          )
        : 0,
      eatInTax: !takeOut
        ? applyCompanyConfigPriceRounding(
            (bundlePrice * bundleCount * diningTax) / 100,
          )
        : 0,
      total: applyCompanyConfigPriceRounding(
        (foodItemPriceIncludingTax + toppingPriceIncludingTax) * bundleCount,
      ),
      subTotal: applyCompanyConfigPriceRounding(bundlePrice * bundleCount),
      // kidsDiscount: ,
      discount: 0, // todo apply discount business when it is decided
      payable: applyCompanyConfigPriceRounding(
        (foodItemPriceIncludingTax + toppingPriceIncludingTax) * bundleCount,
      ),
      prepareDuration: foodItem.prepareDuration,
    };
  };

  const handleOrderError = async (response) => {
    let invalidMinValueFoodItemIds = [],
      orderFailedDueToTableStatusIsseMessage;
    response.exceptions.map((exception) => {
      if (exception.code === INVALID_MIN_VALUE) {
        invalidMinValueFoodItemIds = exception.description.split(',');
      }
      if (exception.code === NOT_ALLOWED) {
        orderFailedDueToTableStatusIsseMessage = t(
          'common:OrderFailureMessage',
        );
      }
      return exception;
    });
    if (invalidMinValueFoodItemIds.length) {
      // mark these items as sold out
      enqueueSnackbar(
        {
          title: t('common:OrderFailedMessageDueToInsufficientStock'),
          message: '',
          variant: 'outlined',
          severity: snackbarTypes.error,
        },
        {
          persist: true,
          // autoHideDuration: 6000,
        },
      );
    } else if (orderFailedDueToTableStatusIsseMessage) {
      enqueueSnackbar(
        {
          title: orderFailedDueToTableStatusIsseMessage,
          message: '',
          variant: 'outlined',
          severity: snackbarTypes.error,
        },
        {
          persist: true,
          // autoHideDuration: 6000,
        },
      );
    } else {
      enqueueSnackbar(
        {
          title: t('common:OrderFailureMessage'),
          message: '',
          variant: 'outlined',
          severity: snackbarTypes.error,
        },
        {
          persist: true,
          // autoHideDuration: 6000,
        },
      );
    }
  };

  const isExpiredMenuExistsInToBeOrderedItems = () => {
    let expiredFoodItemFound = false;
    const { menuId, menuName } = foodItem;

    if (isOrderedPackageMenuExpired(menuId, orderedPackageMenus)) {
      expiredFoodItemFound = true;
      const name = menuName
        ? typeof menuName === 'string'
          ? menuName
          : menuName[languageCode]
        : '';
      enqueueSnackbar(
        {
          title: t('menus:LastTimeToOrderPassedMessage', { name }),
          message: '',
          variant: 'outlined',
          severity: snackbarTypes.error,
        },
        {
          persist: true,
          // autoHideDuration: 4000,
        },
      );
    }

    return expiredFoodItemFound;
  };

  const handlePlaceOrder = async () => {
    let isExpiredItem = isExpiredMenuExistsInToBeOrderedItems();
    if (isExpiredItem) {
      return;
    }

    const orderPayload = makeOrderPayload();
    const response = await createOrder(orderPayload);
    if (response && response.success) {
      setCart();

      let filteredResponse = response; // filter out cancelled items
      try {
        const filteredOrderMenus = response.data.orderMenus.map((menu) => {
          menu.orderItems = menu.orderItems.filter(
            (orderItem) => orderItem.status !== CANCELLED,
          );
          return menu;
        });

        filteredResponse.data.orderMenus = filteredOrderMenus;
      } catch (e) {
        console.warn(e);
      }

      setOrder(filteredResponse);
      redirectToOrder();
    } else if (
      response &&
      !response.success &&
      response.data &&
      response.data.exceptions &&
      response.data.exceptions.length
    ) {
      handleOrderError(response.data);
    }
  };
  // End Order

  const makeItemPayload = () => {
    const { id } = foodItem;
    return {
      id,
      foodItemId: id,
      menuId,
      itemDeliveryType: takeOut ? TAKE_AWAY : EAT_HERE,
      quantity: bundleCount,
      price: foodItem.price,
      status: SENT_TO_KITCHEN,
      specialInstruction: specialInstruction,
      orderItemChoices: toppingList.map((topping) => ({
        choicesItemId: topping.id,
        //choicesCategoryId: topping.choicesCategoryId,
        price: topping.price,
        priceIncludingTax:
          topping.price +
          (topping.price * (takeOut ? takeAwayTax : diningTax)) / 100,
        tax: topping.tax,
      })),
    };
  };

  //Update order
  const handleUpdateOrder = async () => {
    let isExpiredItem = isExpiredMenuExistsInToBeOrderedItems();
    if (isExpiredItem) {
      return;
    }
    const orderPayload = makeItemPayload();
    const response = await updateOrder(order.id, {
      toAddOrderItems: [orderPayload],
    });
    if (response && response.success) {
      setCart();
      setOrder(response);
      redirectToOrder();
    } else if (
      response &&
      !response.success &&
      response.data &&
      response.data.exceptions &&
      response.data.exceptions.length
    ) {
      handleOrderError(response.data);
    }
  };
  //End update order
  const { photo,video } = foodItem;
  const imageSrc = photo ? IMAGE_URL + companyId + '/images/' + photo : null;
  const videoSrc = video
  ? IMAGE_URL + companyId + '/images/' + video
  : null;

  return (
    <div className={classes.root}>
      <NxtTopBar
        subTitle={
          <IxTitle variant="h6" className={classes.itemName}>
            {typeof foodItem.name === 'string'
              ? foodItem.name
              : foodItem.name[languageCode]}
          </IxTitle>
        }
      >
        <NxtTopBarItems
          title={branchName}
          handleSearchButton={() => redirectToSearch(history)}
        ></NxtTopBarItems>
      </NxtTopBar>

      <div className={classes.bodyWrapper}>
        {/* <IxTitle variant="h6">
          {typeof foodItem.name === 'string' ? foodItem.name : foodItem.name[languageCode]}
        </IxTitle> */}

        <div className={classes.attributesWrapper}>
          {displayItemAmountPerPortion == 'true' ? (
            // <IxTxtBox
            //   className={classes.attributeItem}
            //   align="left"
            //   primary={<IxCurrency value={foodItem.price} variant="body2" unformatted={true}></IxCurrency>}
            //   primaryVariant="body2"
            //   secondary={t('PriceAttributeLabel')}
            //   secondaryVariant="subtitle1"
            // ></IxTxtBox>
            <NxtPriceDisplay
              price={foodItem.isPackage ? 0 : foodItem.price}
              priceIncludingTax={
                foodItem.isPackage ? 0 : foodItemPriceIncludingTax
              }
              shouldApplyCompanyConfigPriceRounding={false}
              option={companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]}
              subTitle={t('PriceAttributeLabel')}
              rootClassName={classes.priceDisplayRoot}
              rowClassName={classes.priceDisplayRow}
              className={classes.priceDisplayClassName}
              suffixClassName={classes.priceDisplaySuffixClassName}
            ></NxtPriceDisplay>
          ) : (
            ''
          )}

          {foodItem.prepareDuration !== undefined &&
          displayItemCookingTime == 'true' ? (
            <IxTxtBox
              className={classes.attributeItem}
              align="left"
              primary={
                foodItem.prepareDuration +
                ' ' +
                t('Mins') +
                ' ~ ' +
                foodItem.prepareDuration +
                ' ' +
                t('Mins')
              }
              primaryVariant="body2"
              secondary={t('cookingTime')}
              secondaryVariant="subtitle1"
            ></IxTxtBox>
          ) : (
            ''
          )}

          {foodItem.calorie !== undefined && displayItemCalories == 'true' ? (
            <IxTxtBox
              className={classes.attributeItem}
              align="left"
              primary={foodItem.calorie + ' ' + t('CalorieShorthand')}
              primaryVariant="body2"
              secondary={t('Calories')}
              secondaryVariant="subtitle1"
            ></IxTxtBox>
          ) : (
            ''
          )}
        </div>

        <IxTxtBox
          className={classes.itemDescription}
          secondary={foodItem.description}
          secondaryVariant="body1"
          align="left"
        ></IxTxtBox>

        <NxtImage
          src={imageSrc}
          vdo={videoSrc}
          vdoClassName={'itemVideoLarge'}
          isHalal={isHalal}
          isAlcoholAdded={isAlcoholAdded}
          isVegetarian={isVegetarian}
          isKidItem={isKidItem}
          isSoldOut={soldOut}
          foodItemDetail={FOOD_ITEM_DETAIL}
        ></NxtImage>

        <IxTab itemList={tabList}></IxTab>
      </div>

      <NxtStaticFooter>
        <div className={classes.counterWrapper}>
          <div>
            {displayItemTakeout == 'true' && (
              <IxToggleSwitch
                name={t('orderr:takeout')}
                label={t('orderr:takeout')}
                checked={takeOut}
                disabled={foodItem.isPackage}
                onChange={(event) => updateTakeOutValue(event.target.checked)}
              />
            )}
          </div>

          <div className={classes.count}>
            {/* <IxCurrency
              className={classes.countText}
              value={applyCompanyConfigPriceRounding(bundlePrice * bundleCount)}
              variant="h6"
            /> */}
            <NxtPriceDisplay
              price={
                foodItem.isPackage
                  ? 0
                  : (foodItem.price + toppingPrice) * bundleCount
              }
              priceIncludingTax={
                foodItem.isPackage
                  ? 0
                  : (foodItemPriceIncludingTax + toppingPriceIncludingTax) *
                    bundleCount
              }
              shouldApplyCompanyConfigPriceRounding={false}
              option={companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]}
              rootClassName={classes.priceDisplayRoot}
              rowClassName={classes.priceDisplayRow}
              className={classes.totalPriceDisplayClassName}
              suffixClassName={classes.priceDisplaySuffixClassName}
            ></NxtPriceDisplay>

            <IxIncrementDecrementCounter
              className={classes.countButton}
              operatorOne={operatorSubtract}
              operatorTwo={operatorAddition}
              count={bundleCount}
              handleCount={handleFoodItemCount}
              buttonOneDisabled={bundleCount <= minimumFoodItemCount}
              buttonTwoDisabled={
                isLimitedQtyPerOrder && bundleCount >= totalGuestCount
              }
            />
          </div>
        </div>

        <div className={classes.footerButtonsWrapper}>
          {cartItems.editOrderedItems && cartItems.editOrderedItems.length ? (
            //Update Order
            <IxButton
              // variant="outlined"
              color="primary"
              disableElevation={true}
              disabled={
                !isRequiredToppingAdded ||
                soldOut ||
                foodItem.index ||
                foodItem.orderId
              }
              classes={{
                root: classes.cancelBtnRoot,
              }}
              onClick={handleUpdateOrder}
            >
              {t('orderr:Update order')}
            </IxButton>
          ) : (
            //Order Now
            <IxButton
              // variant="outlined"
              color="primary"
              disableElevation={true}
              disabled={!isRequiredToppingAdded || soldOut}
              classes={{
                root: classes.cancelBtnRoot,
              }}
              onClick={handlePlaceOrder}
            >
              {t('orderr:orderNow')}
            </IxButton>
          )}

          <IxButton
            onClick={handleAddToCart}
            variant="contained"
            color="primary"
            disableElevation={true}
            disabled={!isRequiredToppingAdded || soldOut}
            classes={{
              root: classes.OkBtnRoot,
            }}
          >
            {foodItem.index || foodItem.orderId
              ? t('orderr:updateItem')
              : t('orderr:addToOrder')}
          </IxButton>
        </div>
      </NxtStaticFooter>
    </div>
  );
};

export default NxtFoodItemDetail;

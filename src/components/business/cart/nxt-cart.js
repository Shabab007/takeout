import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import styles from './style';
import { Typography, Grid, CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import NxtTopBar from '../../basic/nxt-top-bar';
import NxtTopBarItems from '../../composite/nxt-top-bar-items';
import LanguageNamespaces from '../../../constants/language-namespaces';
import IxTxtBox from '../../basic/ix-txt-box';
import NxtTxtApart from '../../basic/nxt-text-apart';
import IxButton from '../../basic/ix-button';

// import IxCurrency from '../../basic/ix-currency';
import NxtCartSummary from './nxt-cart-summary';
import NxtStaticFooter from '../../basic/nxt-static-footer';
import orderStatus from '../../../constants/order-status';
import errorCodeEnum from '../../../constants/error-code-enum';

import { createOrder, updateOrder, cancelOrder } from '../../../services/guest';
import {
  getGuestConfigFromSessionStorage,
  // removeSessionDataFromSessionStorage,
  // removeTableInformationFromSessionStorage,
} from '../../../actions/nxt-local-storage';
import TakeOutItems from './nxt-takeout-items';
import DiningItems from './nxt-dining-items';
import OrderedCollapsItems from './nxt-ordered-collaps-items';
import OrderedItems from './nxt-ordered-items';
import {
  EAT_HERE,
  TAKE_AWAY,
  MALE,
  FEMALE,
  KIDS,
  OTHERS,
} from '../../../constants/order-status';
import {
  getPriceIncludingTax,
  isOrderedPackageMenuExpired,
  makeOrderMenus,
  parseGuestConfig,
  redirectToMenu,
  redirectToOrderHome,
  redirectToSearch,
} from '../../../services/utility';
import snackbarTypes from '../../../constants/snackbar-types';
import companyConfigEnum from '../../../constants/company-config-enum';
import { useSnackbar } from 'notistack';
import NxtPriceDisplay from '../../composite/nxt-price-display';
import nxtMenuTypes from '../../../constants/nxt-menu-types';

const NxtCart = ({
  history,
  appState,
  // getTopMenus,
  fetchMenus,
  cartItems, // yet to order items
  order, // the order object, if order placed
  editOrderedItems, // ordered items, if order placed
  orderedPackageMenus,
  decrementCartItemCount,
  incrementCartItemCount,
  removeFromCart,
  removePackageMenuFromCart,
  setOrder,
  setCart,
  incrementOrderedItemCount,
  decrementOrderedItemCount,
  cancelOrderToProps,
  removeFromOrderedItem,
  removedOrderedItems,
  showOrder,
  setDisplayOrder,
}) => {
  const languageCode = useSelector((state) => state.language.code);
  const { enqueueSnackbar } = useSnackbar();
  const classes = styles();
  const [t] = useTranslation([LanguageNamespaces.orderr]);
  const [orderNumber] = useState();
  const [showProgressSpinner, setShowProgressSpinner] = useState(false);

  const { restaurantTable, companyConfig } = appState;

  const companyConfigData = companyConfig.data;
  const {
    id: restaurantTableId,
    branch,
    company,
    section,
  } = restaurantTable.data;

  let branchId,
    companyId,
    sectionId,
    tableCharge,
    takeAwayTax,
    diningTax,
    kidDiscount;
  try {
    branchId = branch.id;
    companyId = company.id;
    sectionId = section.id;

    tableCharge = +companyConfigData[companyConfigEnum.TABLE_CHARGES];
    takeAwayTax = +companyConfigData[companyConfigEnum.TAKE_AWAY_TAX];
    diningTax = +companyConfigData[companyConfigEnum.EAT_IN_TAX];
    kidDiscount = +companyConfigData[companyConfigEnum.KIDS_DISCOUNT];
  } catch (e) {
    console.warn(e);
  }

  let diningGuests;
  // if order exists, we use the guest from there, else from session storage
  if (order) {
    diningGuests = parseGuestConfig(order.orderGuests);
  } else {
    diningGuests = JSON.parse(getGuestConfigFromSessionStorage());
  }

  const totalGuestCountWithoutKids =
    diningGuests.female + diningGuests.male + diningGuests.others;
  // const totalGuestCount = totalGuestCountWithoutKids + diningGuests.kid;

  let toUpdateOrderItems = [];

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

  let orderBtnDisable = true;
  const orderedItemsCount = editOrderedItems
    ? editOrderedItems.filter((item) => !item.isRemoved).length
    : 0;
  let itemCount = cartItems
    ? cartItems.filter(
        (item) =>
          item.itemCode !== nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE,
      ).length
    : 0;

  let orderedItemCount = editOrderedItems
    ? editOrderedItems.filter(
        (item) =>
          item.itemCode !== nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE,
      ).length
    : 0;

  const [deleteConfirmDialogueOpen, setDeleteConfirmDialogueOpen] = useState(
    false,
  );

  useEffect(() => {
    return () => {
      setDisplayOrder(false);
    };
  }, [setDisplayOrder]);

  const handleAddMore = () => {
    redirectToMenu(history);
  };

  const handleOpenConfirmDialogue = () => {
    setDeleteConfirmDialogueOpen(true);
  };

  const handleCloseConfirmDialogue = () => {
    setDeleteConfirmDialogueOpen(false);
  };

  const packagedCartItems = cartItems.filter((item) => item.isPackage);
  const nonPackageCartItems = cartItems.filter((item) => !item.isPackage);

  const cartItemsDistinctPackageMenus = Array.from(
    new Set(packagedCartItems.map((item) => item.menuId)),
  ).map((id) => {
    const {
      menuId,
      menuName,
      packagePrice,
      packagePriceIncludingTax,
      packagePriceTax,
      quantity,
    } = packagedCartItems.find((foodItem) => foodItem.menuId === id);
    return {
      id,
      menuId,
      menuName,
      packagePrice,
      packagePriceIncludingTax,
      packagePriceTax,
      quantity,
    };
  });

  const packagedOrderedItems = editOrderedItems.filter(
    (item) => item.isPackage && !item.isRemoved,
  );

  const nonPackagedOrderedItems = editOrderedItems.filter(
    (item) => !item.isPackage && !item.isRemoved,
  );

  const orderedItemsDistinctPackageMenus = Array.from(
    new Set(packagedOrderedItems.map((item) => item.menuId)),
  ).map((id) => {
    const {
      menuName,
      packagePrice,
      packagePriceIncludingTax,
      taxDecimal,
      quantity,
    } = packagedOrderedItems.find((foodItem) => foodItem.menuId === id);
    return {
      id,
      menuName,
      packagePrice,
      packagePriceIncludingTax,
      taxDecimal,
      quantity,
    };
  });

  let yetToOrderItemsSubtotal = 0, // items price without taxes and discocunt
    yetToOrderItemsSubtotalIncludingTax = 0,
    yetToOrderTaxes = 0,
    yetToOrderKidDiscount = 0,
    yetToOrderDiscount = 0,
    orderedItemsSubtotal = 0,
    orderedItemsSubtotalIncludingTax = 0,
    orderedItemsTaxes = 0,
    orderedItemsDiscount = 0,
    orderedItemsTotal = 0,
    orderedItemsTotalIncludingTax = 0,
    orderedItemsKidDiscount = 0,
    orderedItemTakeAwayTax = 0,
    orderedItemDiningTax = 0,
    yetToOrderDiningTax = 0,
    yetToOrderTakeAwayTax = 0,
    total = 0,
    totalIncludingTax = 0,
    payable = 0,
    payableIncludingTax = 0;

  let tableChargeApplicable = false;

  if (nonPackageCartItems) {
    // non package unordered cart items calculation
    nonPackageCartItems.map((item) => {
      let bundlePrice = item.price;
      let bundlePriceIncludingTax = item.priceIncludingTax;

      item.orderItemChoices &&
        item.orderItemChoices.map((item) => {
          bundlePrice += item.price;
          bundlePriceIncludingTax += item.priceIncludingTax;
        });

      tableChargeApplicable = true;
      // subtotal
      yetToOrderItemsSubtotal += bundlePrice * item.quantity;
      yetToOrderItemsSubtotalIncludingTax +=
        bundlePriceIncludingTax * item.quantity;

      // Calculate kid discount
      if (item.isKidItem && diningGuests.kid) {
        let subTotal = bundlePrice * item.quantity;
        yetToOrderKidDiscount += (subTotal * kidDiscount) / 100;
      }

      //Take away tax
      if (item.itemDeliveryType === TAKE_AWAY) {
        let subTotal = bundlePrice * item.quantity;
        yetToOrderTakeAwayTax += (subTotal * takeAwayTax) / 100;
      }

      // Dining tax
      if (item.itemDeliveryType === EAT_HERE) {
        let subTotal = bundlePrice * item.quantity;
        yetToOrderDiningTax += (subTotal * diningTax) / 100;
      }
      return item;
    });
  }

  if (cartItemsDistinctPackageMenus) {
    // package cart items calculation
    cartItemsDistinctPackageMenus.map((menu) => {
      const { packagePrice, id } = menu; // quantity

      if (
        orderedItemsDistinctPackageMenus.length &&
        orderedItemsDistinctPackageMenus.find(
          (orderedPackageMenu) => orderedPackageMenu.id === id,
        )
      ) {
        return null;
      }

      let subtotal = packagePrice * totalGuestCountWithoutKids;
      tableChargeApplicable = true;
      yetToOrderItemsSubtotal += subtotal;
      let tax = (subtotal * diningTax) / 100;

      yetToOrderItemsSubtotalIncludingTax += subtotal + tax;

      yetToOrderDiningTax += tax;
      return menu;
    });
  }

  // Ordered items

  if (nonPackagedOrderedItems) {
    // non package
    nonPackagedOrderedItems.map((item) => {
      let { price, priceIncludingTax, tax } = item;
      let bundlePrice = price;
      let bundlePriceIncludingTax = getPriceIncludingTax(
        priceIncludingTax,
        price,
        tax,
      );
      item.orderItemChoices.map((item) => {
        const {
          price: choiceItemPrice,
          priceIncludingTax: choiceItemPriceIncludingTax,
          tax: choiceItemTax,
        } = item;
        bundlePrice += choiceItemPrice;
        bundlePriceIncludingTax += getPriceIncludingTax(
          choiceItemPriceIncludingTax,
          choiceItemPrice,
          choiceItemTax,
        );
      });
      tableChargeApplicable = true;
      // subtotal
      orderedItemsSubtotal += bundlePrice * item.quantity;
      orderedItemsSubtotalIncludingTax +=
        bundlePriceIncludingTax * item.quantity;

      // Calculate kid discount
      if (item.isKidItem && diningGuests.kid) {
        let subTotal = bundlePrice * item.quantity;
        orderedItemsKidDiscount += (subTotal * kidDiscount) / 100;
      }

      //Take away tax
      if (item.itemDeliveryType === TAKE_AWAY) {
        let subTotal = bundlePrice * item.quantity;
        orderedItemTakeAwayTax += (subTotal * takeAwayTax) / 100;
      }

      // Dining tax
      if (item.itemDeliveryType === EAT_HERE) {
        let subTotal = bundlePrice * item.quantity;
        orderedItemDiningTax += (subTotal * diningTax) / 100;
      }
      return item;
    });
  }

  if (orderedItemsDistinctPackageMenus) {
    // package ordered calculation
    orderedItemsDistinctPackageMenus.map((menu) => {
      tableChargeApplicable = true;
      const {
        packagePrice,
        packagePriceIncludingTax,
        taxDecimal,
        // quantity,
      } = menu;

      orderedItemsSubtotal += packagePrice * totalGuestCountWithoutKids;

      orderedItemsSubtotalIncludingTax +=
        getPriceIncludingTax(
          packagePriceIncludingTax,
          packagePrice,
          taxDecimal,
        ) * totalGuestCountWithoutKids;

      orderedItemDiningTax += (orderedItemsSubtotal * diningTax) / 100;
      return menu;
    });
  }

  yetToOrderTaxes = yetToOrderTakeAwayTax + yetToOrderDiningTax;
  orderedItemsTaxes = orderedItemTakeAwayTax + orderedItemDiningTax;

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

  const totalTableCharge = tableChargeApplicable
    ? tableCharge * totalGuestCountWithoutKids
    : 0;

  total =
    yetToOrderItemsSubtotal +
    orderedItemsSubtotal +
    // yetToOrderTaxes +
    // orderedItemsTaxes +
    totalTableCharge;

  totalIncludingTax =
    yetToOrderItemsSubtotalIncludingTax +
    orderedItemsSubtotalIncludingTax +
    totalTableCharge;

  payable = total - (yetToOrderKidDiscount + orderedItemsKidDiscount);
  payableIncludingTax =
    totalIncludingTax - (yetToOrderKidDiscount + orderedItemsKidDiscount);
  const roundedTakeawayTax = applyCompanyConfigPriceRounding(
    yetToOrderTakeAwayTax + orderedItemTakeAwayTax,
  );
  const roundedDineInTax = applyCompanyConfigPriceRounding(
    yetToOrderDiningTax + orderedItemDiningTax,
  );
  const roundedKidsDiscount = applyCompanyConfigPriceRounding(
    yetToOrderKidDiscount + orderedItemsKidDiscount,
  );

  const roundedSubTotal = applyCompanyConfigPriceRounding(
    yetToOrderItemsSubtotal + orderedItemsSubtotal,
  );
  const roundedSubtotalIncludingTax = applyCompanyConfigPriceRounding(
    yetToOrderItemsSubtotalIncludingTax + orderedItemsSubtotalIncludingTax,
  );

  const makeOrderPayload = (items) => {
    const prepareDuration = Math.max(...items.map((o) => o.prepareDuration), 0);
    return {
      orderBy: orderStatus.GUEST,
      companyId: companyId,
      branchId: branchId,
      restaurantTableId: +restaurantTableId,
      sectionId: sectionId,
      status: orderStatus.PLACED,
      orderGuests: orderGuests,
      orderMenus: makeOrderMenus(items),
      tableCharge,
      totalTableCharge,
      takeAwayTax: roundedTakeawayTax,
      eatInTax: roundedDineInTax,
      kidsDiscount: roundedKidsDiscount,
      discount: 0, // todo apply discount business when it is decided
      subTotal: roundedSubTotal, // items prices total
      // total: applyCompanyConfigPriceRounding(totalIncludingTax), // item prices + table charge + tax
      total: applyCompanyConfigPriceRounding(payableIncludingTax), // item prices + table charge + tax

      payable: applyCompanyConfigPriceRounding(payableIncludingTax), // total - discounts
      prepareDuration,
      customerLanguage: languageCode,
    };
  };

  const handleOrderError = async (response) => {
    let invalidMinValueFoodItemIds = [],
      orderFailedDueToTableStatusIsseMessage;
    response.exceptions.map((exception) => {
      if (exception.code === errorCodeEnum.INVALID_MIN_VALUE) {
        invalidMinValueFoodItemIds = exception.description.split(',');
      }
      if (exception.code === errorCodeEnum.NOT_ALLOWED) {
        orderFailedDueToTableStatusIsseMessage = t(
          'common:OrderFailureMessage',
        );
      }

      return exception;
    });
    if (invalidMinValueFoodItemIds.length) {
      // getTopMenus();
      fetchMenus();
      const modifiedCartItems = cartItems.map((cartItem) => {
        let invalidItemIndex = invalidMinValueFoodItemIds.findIndex(
          (soldOutItemId) => +cartItem.id === +soldOutItemId,
        );
        if (invalidItemIndex !== -1) {
          return {
            ...cartItem,
            isSoldOut: true,
          };
        }
        return cartItem;
      });
      setCart(modifiedCartItems);
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
    cartItems.map((foodItem) => {
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

      return foodItem;
    });

    return expiredFoodItemFound;
  };

  const handlePlaceOrder = async () => {
    let expiredFoodItemFound = isExpiredMenuExistsInToBeOrderedItems();

    if (expiredFoodItemFound) {
      return;
    }

    const orderPayload = makeOrderPayload(cartItems);
    setShowProgressSpinner(true);
    const response = await createOrder(orderPayload);
    setShowProgressSpinner(false);
    if (response && response.success) {
      setCart();
      setOrder(response); // to redux store
      redirectToOrderResult();
    } else if (
      response &&
      !response.success &&
      response.exceptions &&
      response.exceptions.length
    ) {
      handleOrderError(response);
    }
  };

  const makeItemPayload = (item) => {
    const {
      id,
      foodItemId,
      menuId,
      itemDeliveryType,
      quantity,
      price,
      tax,
      priceWithTax,
      packagePrice,
      packagePriceTax,
      packagePriceWithTax,
      status,
      specialInstruction,
      orderItemChoices,
      itemCode,
    } = item;
    return {
      id,
      menuId,
      itemDeliveryType,
      quantity,
      price,
      tax,
      priceWithTax,
      packagePrice,
      packagePriceTax,
      packagePriceWithTax,
      status,
      specialInstruction,
      orderItemChoices,
      foodItemId,
      itemCode,
    };
  };

  const handleUpdateOrder = async () => {
    let expiredFoodItemFound = isExpiredMenuExistsInToBeOrderedItems();

    if (expiredFoodItemFound) {
      return;
    }

    setShowProgressSpinner(true);
    let toAddOrderItems = [];
    // let toUpdateOrderItems = [];
    let toRemoveOrderItems = [];

    cartItems.length &&
      cartItems.map((item) => {
        let orderItemPayload = makeItemPayload(item);
        if (
          orderItemPayload.itemCode ===
          nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE
        ) {
          orderItemPayload.foodItemId = orderItemPayload.id;
          orderItemPayload.status = orderStatus.SENT_TO_KITCHEN;
          orderItemPayload.itemDeliveryType = orderStatus.EAT_HERE;
        }
        delete orderItemPayload.id;
        toAddOrderItems.push(orderItemPayload);
        return item;
      });

    editOrderedItems.length &&
      editOrderedItems.map((item) => {
        if (item.isRemoved) {
          toRemoveOrderItems.push({ id: item.id });
        }
        return item;
      });

    // editOrderedItems.length &&
    //   editOrderedItems.map((item) => {
    //     if (item.isQuantityUpdated) {
    //       let toUpdateOrderItems = [];
    //       const orderItemPayload = makeItemPayload(item);
    //       toUpdateOrderItems.push(orderItemPayload);

    //     }
    //   });

    const response = await updateOrder(order.id, {
      toAddOrderItems,
      toUpdateOrderItems,
      toRemoveOrderItems,
    });
    setShowProgressSpinner(false);
    if (response && response.success) {
      setCart();
      let filteredResponse = response; // filter out cancelled items
      try {
        const filteredOrderMenus = response.data.orderMenus.map((menu) => {
          menu.orderItems = menu.orderItems.filter(
            (orderItem) => orderItem.status !== orderStatus.CANCELLED,
          );
          return menu;
        });

        filteredResponse.data.orderMenus = filteredOrderMenus;
      } catch (e) {
        console.warn(e);
      }

      setOrder(filteredResponse); // to redux store
      redirectToOrderResult();
    } else if (
      response &&
      !response.success &&
      response.exceptions &&
      response.exceptions.length
    ) {
      handleOrderError(response);
    }
  };

  const handleCancelOrder = async () => {
    setShowProgressSpinner(true);
    const response = await cancelOrder(order.id);
    setShowProgressSpinner(false);
    if (response && response.success) {
      setOrder(null);
      setCart();

      // removeSessionDataFromSessionStorage();
      // removeTableInformationFromSessionStorage();
      redirectToOrderHome(history);
    } else {
      // todo handle error
    }
  };

  const redirectToOrderResult = (isUpdate) => {
    history.push('/order-result');
  };

  const isOrderBtnDisabled = () => {
    if (cartItems.length) {
      orderBtnDisable = false;
      return;
    }

    if (
      order &&
      order.orderMenus &&
      order.orderMenus.length &&
      editOrderedItems.length
    ) {
      let orderedItems = [];
      order.orderMenus.map((menu) => {
        if (menu.orderItems) {
          orderedItems = [...orderedItems, ...menu.orderItems];
        }
        return menu;
      });

      for (let i = 0; i < editOrderedItems.length; i++) {
        if (
          !editOrderedItems[i].isRemoved &&
          (editOrderedItems[i].quantity !== orderedItems[i].quantity ||
            editOrderedItems[i].specialInstruction !==
              orderedItems[i].specialInstruction ||
            !isEqual(
              editOrderedItems[i].orderItemChoices,
              orderedItems[i].orderItemChoices,
            ))
        ) {
          const orderItemPayload = makeItemPayload(editOrderedItems[i]);
          toUpdateOrderItems.push(orderItemPayload);
        }
        if (editOrderedItems[i].isRemoved) {
          orderBtnDisable = false;
        }
      }
    }

    if (toUpdateOrderItems.length) {
      orderBtnDisable = false;
    }
  };

  isOrderBtnDisabled();

  return (
    <div className={classes.root}>
      <Dialog
        open={deleteConfirmDialogueOpen}
        onClose={handleCloseConfirmDialogue}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.myDiolog}
      >
        <DialogTitle id="alert-dialog-title">
          {t('AreYouSureToDeleteTheOrder')}
        </DialogTitle>
        <DialogActions>
          <Button
            align="left"
            onClick={handleCloseConfirmDialogue}
            color="primary"
          >
            {t('No')}
          </Button>
          <Button onClick={handleCancelOrder} color="primary">
            {t('Yes')}
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <NxtTopBar>
          <NxtTopBarItems
            title={t('Cart title')}
            titleAlignment="left"
            handleSearchButton={() => redirectToSearch(history)}
          ></NxtTopBarItems>
        </NxtTopBar>
      </div>

      <div className={classes.body}>
        <div className={classes.orderNumberWrapper}>
          <IxTxtBox
            primary={orderNumber ? t('Order Number', { orderNumber }) : ''}
            primaryVariant="h6"
            secondary={
              <NxtTxtApart
                left={
                  <Typography color="textSecondary">
                    {t('ItemsCount', { itemCount })}
                  </Typography>
                }
                right={
                  <IxButton
                    color="primary"
                    size="small"
                    onClick={handleAddMore}
                  >
                    <AddIcon></AddIcon> {t('Add more')}
                  </IxButton>
                }
              ></NxtTxtApart>
            }
            align="left"
          ></IxTxtBox>
        </div>

        <div className={classes.cartItemsWrapper}>
          <DiningItems
            packageMenus={packagedCartItems}
            nonPackageMenus={nonPackageCartItems.filter(
              (item) => item.itemDeliveryType === EAT_HERE,
            )}
            distinctPackageMenus={cartItemsDistinctPackageMenus}
            items={cartItems.filter(
              (item) => item.itemDeliveryType === EAT_HERE,
            )}
            decrementCartItemCount={decrementCartItemCount}
            incrementCartItemCount={incrementCartItemCount}
            removeFromCart={removeFromCart}
            removePackageMenuFromCart={removePackageMenuFromCart}
            companyConfigData={companyConfigData}
            totalGuestCountWithoutKids={totalGuestCountWithoutKids}
          ></DiningItems>
          <TakeOutItems
            items={cartItems.filter(
              (item) => item.itemDeliveryType === TAKE_AWAY,
            )}
            decrementCartItemCount={decrementCartItemCount}
            incrementCartItemCount={incrementCartItemCount}
            removeFromCart={removeFromCart}
            companyConfigData={companyConfigData}
          ></TakeOutItems>
        </div>

        <div className={classes.cartItemsWrapper}>
          {/* ordered items */}
          {showOrder || (cartItems.length && editOrderedItems.length) ? (
            <div>
              {cartItems.length ? (
                <OrderedCollapsItems
                  packageMenus={packagedOrderedItems}
                  nonPackageMenus={nonPackagedOrderedItems}
                  distinctPackageMenus={orderedItemsDistinctPackageMenus}
                  items={editOrderedItems.filter((item) => !item.isRemoved)}
                  itemCount={orderedItemCount}
                  orderedItemsTotal={orderedItemsTotal}
                  decrementOrderedItemCount={decrementOrderedItemCount}
                  incrementOrderedItemCount={incrementOrderedItemCount}
                  removeFromCart={removeFromOrderedItem}
                  removePackageMenuFromCart={removePackageMenuFromCart}
                  enableEditOrderedItemButton={true}
                  companyConfigData={companyConfigData}
                  totalGuestCountWithoutKids={totalGuestCountWithoutKids}
                ></OrderedCollapsItems>
              ) : (
                <div>
                  <OrderedItems
                    packageMenus={packagedOrderedItems}
                    nonPackageMenus={nonPackagedOrderedItems}
                    distinctPackageMenus={orderedItemsDistinctPackageMenus}
                    items={editOrderedItems.filter((item) => !item.isRemoved)}
                    orderedItemsTotal={orderedItemsTotal}
                    decrementOrderedItemCount={decrementOrderedItemCount}
                    incrementOrderedItemCount={incrementOrderedItemCount}
                    removeFromCart={removeFromOrderedItem}
                    enableEditOrderedItemButton={true}
                    companyConfigData={companyConfigData}
                    totalGuestCountWithoutKids={totalGuestCountWithoutKids}
                  ></OrderedItems>
                </div>
              )}
            </div>
          ) : (
            ''
          )}
        </div>

        {/* order payment calculation summary */}

        {showOrder || (cartItems && cartItems.length) ? (
          <div className={classes.summaryWrapper}>
            {/* <NxtCartSummary title={t('Subtotal')} value={roundedSubTotal} /> */}

            <div className={classes.summaryRow}>
              <Typography variant="subtitle1" color="textSecondary">
                {t('Subtotal')}
              </Typography>
              <NxtPriceDisplay
                price={roundedSubTotal}
                priceIncludingTax={roundedSubtotalIncludingTax}
                option={
                  companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]
                }
                rootClassName={classes.priceDisplayRoot}
                rowClassName={classes.subtotalDisplayRow}
                className={classes.subtotalDisplayClassName}
                suffixClassName={classes.subtotalDisplaySuffixClassName}
              ></NxtPriceDisplay>
            </div>

            <NxtCartSummary
              title={t('tableCharge', {
                tableCharge,
                totalGuest: totalGuestCountWithoutKids,
              })}
              value={applyCompanyConfigPriceRounding(totalTableCharge)}
            />
            <NxtCartSummary
              title={t('Taxes and fees', { diningTax, takeAwayTax })}
              value={applyCompanyConfigPriceRounding(
                // roundedSubtotalIncludingTax - roundedSubTotal,
                yetToOrderTaxes + orderedItemsTaxes,
              )}
              // value={0}
            />

            {yetToOrderDiscount || orderedItemsDiscount ? (
              <NxtCartSummary
                title={t('Discount')}
                value={applyCompanyConfigPriceRounding(
                  yetToOrderDiscount + orderedItemsDiscount,
                )}
              />
            ) : (
              ''
            )}
            {yetToOrderKidDiscount || orderedItemsKidDiscount ? (
              <NxtCartSummary
                title={t('KidDiscount')}
                value={applyCompanyConfigPriceRounding(
                  yetToOrderKidDiscount + orderedItemsKidDiscount,
                )}
              />
            ) : (
              ''
            )}
          </div>
        ) : (
          <IxTxtBox
            className={classes.emptyCartMessage}
            primary={t('emptyCartMessage')}
            primaryVariant="h6"
            align="left"
          ></IxTxtBox>
        )}
      </div>

      {/* Footer */}
      <NxtStaticFooter>
        <div className={classes.total}>
          {/* <NxtTxtApart
            left={t('Total')}
            leftVariant="h6"
            leftColor="textPrimary"
            right={
              <IxCurrency
                value={showOrder || (cartItems && cartItems.length) ? applyCompanyConfigPriceRounding(payable) : 0}
                variant="h6"
                color="textPrimary"
              ></IxCurrency>
            }
          ></NxtTxtApart> */}

          <div className={classes.summaryRow}>
            <Typography
              variant="h6"
              color="textPrimary"
              className={classes.totalLabel}
            >
              {t('Total')}
            </Typography>
            <NxtPriceDisplay
              price={showOrder || (cartItems && cartItems.length) ? payable : 0}
              priceIncludingTax={
                showOrder || (cartItems && cartItems.length)
                  ? payableIncludingTax
                  : 0
              }
              option={companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]}
              rootClassName={classes.priceDisplayRoot}
              rowClassName={classes.priceDisplayRow}
              className={classes.priceDisplayClassName}
              suffixClassName={classes.priceDisplaySuffixClassName}
            ></NxtPriceDisplay>
          </div>
        </div>

        {/* Footer buttons */}

        <div>
          <Grid className="footerBtns" container direction="row">
            {(cartItems &&
              cartItems.length &&
              editOrderedItems &&
              editOrderedItems.length) ||
            showOrder ? (
              <span className={classes.updateSection}>
                {/* todo enable_cancel */}
                {/* <Grid justify="flex-start" container item xs={6}>
                  <IxButton
                    color="primary"
                    classes={{
                      root: classes.cancelBtnRoot,
                    }}
                    onClick={handleOpenConfirmDialogue}
                    disabled={order && order.status !== orderStatus.PLACED}
                  >
                    {t('orderr:CancelOrderBtnText')}
                  </IxButton>
                </Grid> */}
                {!(
                  editOrderedItems &&
                  editOrderedItems.length &&
                  !orderedItemsCount &&
                  !cartItems.length
                ) ? (
                  <Grid justify="flex-end" container item xs={12}>
                    <IxButton
                      classes={{
                        root: classes.orderBtnRoot,
                      }}
                      onClick={
                        editOrderedItems && editOrderedItems.length
                          ? handleUpdateOrder
                          : handlePlaceOrder
                      }
                      disabled={orderBtnDisable}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      {editOrderedItems && editOrderedItems.length
                        ? t('Update order')
                        : t('Place order')}
                    </IxButton>
                  </Grid>
                ) : (
                  ''
                )}
              </span>
            ) : (
              <IxButton
                classes={{
                  root: classes.orderBtnRoot,
                }}
                onClick={handlePlaceOrder}
                disabled={orderBtnDisable}
                variant="contained"
                color="primary"
                fullWidth
              >
                {t('Place order')}
              </IxButton>
            )}
          </Grid>
        </div>
      </NxtStaticFooter>
      {showProgressSpinner && (
        <CircularProgress className={classes.progressSpinner} color="primary" />
      )}
    </div>
  );
};

export default NxtCart;

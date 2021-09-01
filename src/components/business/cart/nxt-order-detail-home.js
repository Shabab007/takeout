import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import NxtTopBarItems from '../../composite/nxt-top-bar-items';
import IxTxtBox from '../../basic/ix-txt-box';
import NxtTxtApart from '../../basic/nxt-text-apart';
import IxButton from '../../basic/ix-button';
import IxCurrency from '../../basic/ix-currency';
import NxtStaticFooter from '../../basic/nxt-static-footer';
import NxtTopBar from '../../basic/nxt-top-bar';

import companyConfigEnum from '../../../constants/company-config-enum';
import { PLACED } from '../../../constants/order-status';
import LanguageNamespaces from '../../../constants/language-namespaces';
import { EAT_HERE, TAKE_AWAY } from '../../../constants/order-status';
import {
  getPriceIncludingTax,
  parseGuestConfig,
  redirectToMenu,
  redirectToOrderHome,
  redirectToSearch,
} from '../../../services/utility';
import { cancelOrder } from '../../../services/guest';

import OrderedItems from './nxt-ordered-items';
import NxtCartSummary from './nxt-cart-summary';
import styles from './style';
import NxtPriceDisplay from '../../composite/nxt-price-display';
import nxtMenuTypes from '../../../constants/nxt-menu-types';

const NxtOrderDetail = ({
  history,
  appState,
  order,
  setDisplayOrder,
  setOrder,
  setCart,
}) => {
  const classes = styles();
  const [t] = useTranslation([LanguageNamespaces.orderr]);

  const companyConfigData = appState.companyConfig.data;

  const [orderedItems, setOrderedItems] = useState([]);
  const [showProgressSpinner, setShowProgressSpinner] = useState(false);
  const [deleteConfirmDialogueOpen, setDeleteConfirmDialogueOpen] = useState(
    false,
  );

  useEffect(() => {
    if (order) {
      let items = [];
      order.orderMenus.map((menu) => {
        const modifiedOrderItems = menu.orderItems.map((item) => {
          return {
            ...item,
            menuId: menu.id,
            isPackage: menu.isPackage,
            packagePrice: menu.packagePrice,
            menuName: menu.name || item.menuName,
            taxDecimal: menu.taxDecimal,
          };
        });
        items = [...items, ...modifiedOrderItems];
        return menu;
      });
      setOrderedItems(items);
    }
  }, [order]);

  let diningGuests, totalGuestCountWithoutKid, totalGuestCount;
  // if order exists, we use the guest from there, else from session storage
  if (order && order.orderGuests) {
    diningGuests = parseGuestConfig(order.orderGuests);
  }

  let tableCharge, takeAwayTax, diningTax, kidDiscount;
  try {
    tableCharge = +companyConfigData[companyConfigEnum.TABLE_CHARGES];
    takeAwayTax = +companyConfigData[companyConfigEnum.TAKE_AWAY_TAX];
    diningTax = +companyConfigData[companyConfigEnum.EAT_IN_TAX];
    kidDiscount = +companyConfigData[companyConfigEnum.KIDS_DISCOUNT];
  } catch (e) {
    console.warn(e);
  }

  if (diningGuests) {
    totalGuestCountWithoutKid =
      diningGuests.female + diningGuests.male + diningGuests.others;
    totalGuestCount = totalGuestCountWithoutKid + diningGuests.kid;
  }

  const packagedOrderedItems = orderedItems.filter(
    (item) => item.isPackage && !item.isRemoved,
  );
  const nonPackagedOrderedItems = orderedItems.filter(
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

  let orderedFoodItemsCount = 0,
    orderedItemsSubtotal = 0,
    orderedItemsSubtotalIncludingTax = 0,
    orderedItemsTaxes = 0,
    orderedItemsDiscount = 0,
    orderedItemsTotal = 0,
    orderedItemsKidDiscount = 0,
    orderedItemTakeAwayTax = 0,
    orderedItemDiningTax = 0,
    total = 0,
    totalIncludingTax = 0,
    payable = 0,
    payableIncludingTax = 0;

  let tableChargeApplicable = false;
  // Ordered items

  if (nonPackagedOrderedItems) {
    // non package
    nonPackagedOrderedItems.map((item) => {
      let bundlePrice = item.price;
      let bundlePriceIncludingTax = getPriceIncludingTax(
        item.priceIncludingTax,
        item.price,
        item.tax,
      );
      item.orderItemChoices.map((item) => {
        bundlePrice += item.price;
        bundlePriceIncludingTax += getPriceIncludingTax(
          item.priceIncludingTax,
          item.price,
          item.tax,
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
      orderedItemsSubtotal += menu.packagePrice * totalGuestCountWithoutKid;

      // orderedItemsSubtotalIncludingTax +=
      //   menu.packagePriceIncludingTax * totalGuestCountWithoutKid;

      orderedItemsSubtotalIncludingTax +=
        getPriceIncludingTax(
          menu.packagePriceIncludingTax,
          menu.packagePrice,
          menu.taxDecimal,
        ) * totalGuestCountWithoutKid;

      orderedItemDiningTax += (orderedItemsSubtotal * diningTax) / 100;
      return menu;
    });
  }

  orderedItemsTaxes = orderedItemTakeAwayTax + orderedItemDiningTax;

  const totalTableCharge = tableChargeApplicable
    ? tableCharge * totalGuestCountWithoutKid
    : 0;

  total = orderedItemsSubtotal + totalTableCharge;
  totalIncludingTax = orderedItemsSubtotalIncludingTax + totalTableCharge;
  payable = total - orderedItemsKidDiscount;
  payableIncludingTax = totalIncludingTax - orderedItemsKidDiscount;

  const redirectToCart = () => {
    history.push('/cart');
    setDisplayOrder(true);
  };

  const handleOpenConfirmDialogue = () => {
    setDeleteConfirmDialogueOpen(true);
  };

  const handleCloseConfirmDialogue = () => {
    setDeleteConfirmDialogueOpen(false);
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

  // if (!order) {
  //   return (
  //     <div className={classes.root}>
  //       <NxtFallback />
  //     </div>
  //   );
  // }
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

  orderedFoodItemsCount = orderedItems.filter(
    (item) =>
      item.itemCode !== nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE,
  ).length;

  return (
    <div className={classes.root}>
      <div>
        <NxtTopBar>
          <NxtTopBarItems
            title={t('orderr:OrderDetailTitle')}
            titleAlignment="left"
            handleSearchButton={() => redirectToSearch(history)}
          ></NxtTopBarItems>
        </NxtTopBar>
      </div>

      <div className={classes.orderDetailBody}>
        {order && orderedItems.length ? (
          <div className={classes.orderNumberWrapper}>
            <IxTxtBox
              primary={t('Order Number', { orderNumber: order.displayOrderNo })}
              primaryVariant="h6"
              secondary={
                <NxtTxtApart
                  left={
                    <Typography color="textSecondary">
                      {t('ItemsCount', {
                        itemCount: orderedFoodItemsCount,
                      })}
                    </Typography>
                  }
                ></NxtTxtApart>
              }
              align="left"
            ></IxTxtBox>
          </div>
        ) : (
          <Grid container className={classes.noOrderMessageWrapper}>
            <Grid item xs={12}>
              <Typography className={classes.noOrderMessage}>
                {t('orderr:noCurrentOrderMessage')}
              </Typography>
            </Grid>
            <Grid item className={classes.createOrderBtnWrapper} xs={12}>
              <IxButton
                color="primary"
                size="small"
                onClick={() => redirectToMenu(history)}
              >
                {t('BrowseMenu')}
              </IxButton>
            </Grid>
          </Grid>
        )}

        <div className={classes.cartItemsWrapper}>
          <div>
            <OrderedItems
              packageMenus={packagedOrderedItems}
              nonPackageMenus={nonPackagedOrderedItems}
              distinctPackageMenus={orderedItemsDistinctPackageMenus}
              items={orderedItems}
              orderedItemsTotal={orderedItemsTotal}
              readOnly={true}
              totalGuest={totalGuestCount}
              companyConfigData={companyConfigData}
              totalGuestCountWithoutKids={totalGuestCountWithoutKid}
            ></OrderedItems>
          </div>
        </div>

        {/* order payment calculation summary */}

        {order && orderedItems.length ? (
          <div className={classes.summaryWrapper}>
            {/* <NxtCartSummary
              title={t('Subtotal')}
              value={orderedItemsSubtotal}
            /> */}
            <div className={classes.summaryRow}>
              <Typography variant="subtitle1" color="textSecondary">
                {t('Subtotal')}
              </Typography>
              <NxtPriceDisplay
                price={orderedItemsSubtotal}
                priceIncludingTax={orderedItemsSubtotalIncludingTax}
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
                totalGuest: totalGuestCount,
              })}
              value={applyCompanyConfigPriceRounding(totalTableCharge)}
            />

            <NxtCartSummary
              title={t('Taxes and fees', { diningTax, takeAwayTax })}
              value={applyCompanyConfigPriceRounding(orderedItemsTaxes)}
              // value={0}
            />

            {orderedItemsDiscount ? (
              <NxtCartSummary
                title={t('Discount')}
                value={applyCompanyConfigPriceRounding(orderedItemsDiscount)}
              />
            ) : (
              ''
            )}
            {orderedItemsKidDiscount ? (
              <NxtCartSummary
                title={t('KidDiscount')}
                value={applyCompanyConfigPriceRounding(orderedItemsKidDiscount)}
              />
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
      </div>

      {/* Footer */}
      <NxtStaticFooter>
        {order && orderedItems.length ? (
          <div className={classes.total}>
            <NxtTxtApart
              left={t('Total')}
              leftVariant="h6"
              leftColor="textPrimary"
              right={
                // <IxCurrency
                //   value={payable}
                //   variant="h6"
                //   color="textPrimary"
                // ></IxCurrency>
                <NxtPriceDisplay
                  price={payable}
                  priceIncludingTax={payableIncludingTax}
                  option={
                    companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]
                  }
                  rootClassName={classes.priceDisplayRoot}
                  rowClassName={classes.priceDisplayRow}
                  className={classes.priceDisplayClassName}
                  suffixClassName={classes.priceDisplaySuffixClassName}
                ></NxtPriceDisplay>
              }
            ></NxtTxtApart>
          </div>
        ) : (
          ''
        )}

        {/* Footer buttons */}

        <div>
          <Grid className="footerBtns" container direction="row">
            {/* todo enable_cancel */}
            {/* <Grid justify="flex-start" container item xs={6}>
              <IxButton
                fullWidth
                color="primary"
                classes={{
                  root: classes.cancelBtnRoot,
                }}
                onClick={handleOpenConfirmDialogue}
                disabled={!order || (order && order.status !== PLACED)}
              >
                {t('orderr:CancelOrderBtnText')}
              </IxButton>
            </Grid> */}

            <Grid justify="flex-start" container item xs={12}>
              <IxButton
                classes={{
                  root: classes.orderBtnRoot,
                }}
                disabled={!orderedItems.length}
                onClick={redirectToCart}
                variant="contained"
                color="primary"
                fullWidth
              >
                {t('updateItems')}
              </IxButton>
            </Grid>
          </Grid>
        </div>
      </NxtStaticFooter>

      {showProgressSpinner && (
        <CircularProgress className={classes.progressSpinner} color="primary" />
      )}

      <Dialog
        open={deleteConfirmDialogueOpen}
        onClose={handleCloseConfirmDialogue}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.myDiolog}
      >
        <DialogTitle id="alert-dialog-title">
          {t('orderr:AreYouSureToDeleteTheOrder')}
        </DialogTitle>
        <DialogActions>
          <Button
            align="left"
            onClick={handleCloseConfirmDialogue}
            color="primary"
          >
            {t('orderr:No')}
          </Button>
          <Button onClick={handleCancelOrder} color="primary">
            {t('orderr:Yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NxtOrderDetail;

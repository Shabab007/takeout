import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, Paper } from '@material-ui/core';
import IxTxtBox from '../../../basic/ix-txt-box';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

import NxtPriceDisplay from '../../../composite/nxt-price-display';
import {
  getPriceIncludingTax,
  operatorAddition,
  operatorSubtract,
  parseGuestConfig,
  redirectToCart,
} from '../../../../services/utility';
import companyConfigEnum from '../../../../constants/company-config-enum';
import IxIncrementDecrementCounter from '../../../basic/ix-increment-decrement-counter';
import IxButton from '../../../basic/ix-button';
import { getGuestConfigFromSessionStorage } from '../../../../actions/nxt-local-storage';
import snackbarTypes from '../../../../constants/snackbar-types';

import { addToCart } from '../../../../actions/cart';
import orderStatus from '../../../../constants/order-status';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    width: '100%',
    backgroundColor: theme.palette.background.white,
    position: 'relative',
    zIndex: theme.zIndex.packageMenuOrderCard,
    marginTop: theme.spacing(1),
    marginLeft: '8px'
  },
  description: {
    fontSize: '1rem',
    color: theme.palette.text.primary,
    wordBreak: 'break-all',
    marginBottom: theme.spacing(1),
  },
  attribute: { fontSize: '1rem', color: theme.palette.text.primary },
  orderActionsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
  },
  priceDisplayRoot: {},
  packageMenuPriceRowClassName: {
    justifyContent: 'flex-start',
  },
  packageMenuPriceClassName: { fontSize: '1rem' },
  packageMenuPriceSuffixClassName: { fontSize: '.8rem' },
}));

function PackageMenuOrderView(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar(); // closeSnackbar
  const { companyConfigData, menu } = props;

  const languageCode = useSelector((state) => state.language.code);
  const order = useSelector((state) => state.cart.order);
  const orderedPackageMenus = useSelector(
    (state) => state.cart.orderedPackageMenus,
  );
  let diningGuests;
  // if order exists, we use the guest from there, else from session storage
  if (order) {
    diningGuests = parseGuestConfig(order.orderGuests);
  } else {
    diningGuests = JSON.parse(getGuestConfigFromSessionStorage());
  }

  const totalGuestWithoutKids =
    diningGuests.female + diningGuests.male + diningGuests.others;

  const [menuCount, setMenuCount] = useState(totalGuestWithoutKids);

  const {
    name,
    // isPackage,
    // isTimeBound,
    lastTimeToOrder,
    timeBoundDuration,
    menuType,
    description,
    packagePrice,
    packagePriceTax,
    packagePriceIncludingTax,
    // reminderTime,
    rootParentId,
  } = menu;

  let checkedTimeBoundDuration =
    timeBoundDuration && !isNaN(timeBoundDuration) ? timeBoundDuration : 0;

  checkedTimeBoundDuration = Number.isInteger(checkedTimeBoundDuration)
    ? checkedTimeBoundDuration
    : checkedTimeBoundDuration.toFixed(2);

  let checkedLastTimeToOrder =
    lastTimeToOrder && !isNaN(lastTimeToOrder) ? lastTimeToOrder : 0;

  checkedLastTimeToOrder = checkedTimeBoundDuration - checkedLastTimeToOrder;

  const handleMenuCountUpdate = (operator) => {
    let count = menuCount;
    if (operator === operatorSubtract && count > 1) {
      count = menuCount - 1;
    } else if (operator === operatorAddition) {
      count = menuCount + 1;
    }

    setMenuCount(count);
  };

  const handleAddPackageMenuToCart = () => {
    let errorMessage;

    if (!totalGuestWithoutKids) {
      errorMessage = t(
        'menus:PackageMenuOrderAttemptWithoutAdultGuestCountErrorMessage',
      );
    } else if (totalGuestWithoutKids !== menuCount) {
      errorMessage = t(
        'menus:PackageMenuOrderQuantityMismatchWithGuestCountErrorMessage',
      );
    }

    if (errorMessage) {
      enqueueSnackbar(
        {
          title: errorMessage,
          // message: ,
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

    let fakePackageMenuFoodItem;
    try {
      fakePackageMenuFoodItem = menu.foodCategories.find(
        (category) => category.isPackageDefault,
      ).foodItems[0];
    } catch (e) {
      console.warn(e);
    }

    if (fakePackageMenuFoodItem) {
      const { id } = fakePackageMenuFoodItem;
      const isSameTypeMenuAlreadyOrdered =
        orderedPackageMenus &&
        orderedPackageMenus.find(
          (orderedPackageMenu) => orderedPackageMenu.menuType === menuType,
        );

      if (isSameTypeMenuAlreadyOrdered) {
        enqueueSnackbar(
          {
            title: t('menus:SameTypePackageMenuAlreadyOrderedErrorMessage', {
              menuType,
            }),
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

      let foodItemPayload = {
        ...fakePackageMenuFoodItem,
        quantity: menuCount,
        rootParentId,
        foodItemId: id,
        status: orderStatus.SENT_TO_KITCHEN,
        itemDeliveryType: orderStatus.EAT_HERE,
      };
      // delete foodItemPayload.id;
      dispatch(addToCart(foodItemPayload));
      redirectToCart(history);
    } else {
      enqueueSnackbar(
        {
          title: t('menus:FakeFoodItemNotAvailableMessage'),
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
  };

  const menuName = name
    ? (typeof name === 'string' ? name : name[languageCode]) + ': '
    : '';
  const timeBoundHour = Math.floor(checkedTimeBoundDuration / 60);
  const timeBoundMin = Math.floor(checkedTimeBoundDuration % 60);

  let formattedTimeDuration =
    (timeBoundHour
      ? timeBoundHour.toString() + ' ' + t('common:Hours') + ' '
      : '') +
    (timeBoundMin ? timeBoundMin.toString() + ' ' + t('common:Minutes') : '');

  return (
    <Paper className={classes.root} elevation={0}>
      <IxTxtBox
        primary={description}
        align="left"
        primaryClassName={classes.description}
      ></IxTxtBox>

      <IxTxtBox
        primary={menuName + formattedTimeDuration}
        secondary={t('menus:PackageMenuLastOrderTimeLabel', {
          minute: checkedLastTimeToOrder,
        })}
        primaryVariant="h4"
        secondaryVariant="h4"
        align="left"
        primaryClassName={classes.attribute}
        secondaryClassName={classes.attribute}
      ></IxTxtBox>

      <div className={classes.orderActionsWrapper}>
        <NxtPriceDisplay
          price={packagePrice}
          priceIncludingTax={getPriceIncludingTax(
            packagePriceIncludingTax,
            packagePrice,
            packagePriceTax,
          )}
          option={
            companyConfigData &&
            companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]
          }
          // option={companyConfigEnum.BOTH_INCL_EXCL_TAX}
          rootClassName={classes.priceDisplayRoot}
          rowClassName={classes.packageMenuPriceRowClassName}
          className={classes.packageMenuPriceClassName}
          suffixClassName={classes.packageMenuPriceSuffixClassName}
        ></NxtPriceDisplay>

        <IxIncrementDecrementCounter
          className={classes.countButton}
          operatorOne={operatorSubtract}
          operatorTwo={operatorAddition}
          count={menuCount}
          handleCount={handleMenuCountUpdate}
          //   buttonOneDisabled={bundleCount <= minimumFoodItemCount}
        />

        <IxButton
          variant="contained"
          color="primary"
          onClick={handleAddPackageMenuToCart}
        >
          {t('orderr:order')}
        </IxButton>
      </div>
    </Paper>
  );
}

export default PackageMenuOrderView;

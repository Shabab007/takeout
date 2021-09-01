import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CircularProgress, makeStyles } from '@material-ui/core';

import IxTxtBox from '../../basic/ix-txt-box';
import IxButton from '../../basic/ix-button';
import IxCurrency from '../../basic/ix-currency';

import { CREDIT_CARD, CASH } from '../../../constants/ix-enums';
import {
  redirectToCreditCardDetails,
  redirectToOrderHome,
  redirectToPaymentHome,
} from '../../../services/utility';
import OrderTopbarWithBorder from '../../basic/nxt-topbar-with-bottom-border';
import paymentStatusEnum from '../../../constants/payment-status-enum';
import { makePayment } from './paymentSlice';
import NxtPriceDisplay from '../../composite/nxt-price-display';
import companyConfigEnum from '../../../constants/company-config-enum';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '& .MuiSvgIcon-colorPrimary': {
      color: theme.palette.text.commonSecondaryColor,
    },
    '& .MuiTypography-colorTextSecondary': {
      color: theme.palette.text.commonSecondaryColor,
      fontSize: '0.9em',
    },
  },
  body: {
    marginTop: '5rem',
    marginBottom: '7rem',
    height: 'calc(100vh - 12rem)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  bottomButtonWrapper: {
    position: 'fixed',
    bottom: theme.spacing(3),
    width: 'calc( 100% - 32px )',
  },
  fullWidthHr: {
    marginTop: theme.spacing(2),
    marginLeft: -theme.spacing(2),
    marginRight: -theme.spacing(2),
    borderTop: `1px solid ${theme.palette.border.light}`,
  },
  errorMeg: {
    '& h6': {
      textAlign: 'left',
    },
    '& .MuiTypography-colorTextSecondary': {
      color: theme.palette.text.errorMeg,
    },
  },
  currencyLabel: {
    display: 'block',
    width: '5rem',
    height: '5rem',
    border: `2px solid ${theme.palette.text.commonSecondaryColor}`,
    borderRadius: '50%',
    margin: '1.5rem auto',
    textAlign: 'center',
    lineHeight: '5rem',
    color: `${theme.palette.text.commonSecondaryColor}`,
    fontSize: '2rem',
  },
  paymentAmount: {
    display: 'block',
    textAlign: 'center',
  },
  confirmPaymentTitle: {
    marginBottom: '1rem',
  },
  progressSpinner: {
    position: 'fixed',
    top: 'calc(50% - 20px)',
    left: 'calc(50% - 20px)',
    zIndex: theme.zIndex.progressSpinner,
  },
  priceDisplayRoot: {
    textAlign: 'center',
  },
  priceDisplayRow: {
    justifyContent: 'center !important',
  },
  priceDisplayClassName: {
    fontSize: '1.5rem',
  },
  priceDisplaySuffixClassName: {
    fontSize: '1rem',
  },
}));

export const ConfirmPayment = ({
  appState,
  history,
  order,
  paymentState,
  handleOrderPayment,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [progressSpinner, setProgressSpinner] = useState(false);
  const tipConfig = useSelector(state => state.order.tipConfig);

  const { selectedPaymentMethod, payment } = paymentState;

  let restaurantTableData, companyConfigData;
  let tableNumber;

  try {
    const { restaurantTable, companyConfig } = appState;
    restaurantTableData = restaurantTable.data;
    companyConfigData = companyConfig.data;
    tableNumber = restaurantTableData.tableNo;
  } catch (e) {
    console.warn(e);
  }

  useEffect(() => {
    if (!order) {
      redirectToOrderHome(history);
    }
  }, [order, history]);

  useEffect(() => {
    if (order && !selectedPaymentMethod) {
      redirectToPaymentHome(history);
    }
  }, [selectedPaymentMethod, order, history]);

  useEffect(() => {
    if (payment.data) {
      setProgressSpinner(false);
      redirectToPaymentHome(history);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment]);

  if (!order || !selectedPaymentMethod) {
    redirectToPaymentHome(history);
    return <div></div>;
  }

  const {
    displayOrderNo,
    id: orderId,
    // subTotal = 0,
    // totalTableCharge = 0,
    // kidsDiscount = 0,
    // discount = 0,
    takeAwayTax = 0,
    eatInTax = 0,
    payable = 0,
  } = order ? order : {};

  const handleCashPayment = async () => {
    const payload = {
      orderId,
      paymentMethodId: selectedPaymentMethod && selectedPaymentMethod.id,
      paymentAmount: payable,
      paymentDateTime: new Date().getTime(),
      status: paymentStatusEnum.PROCESSING,
      isManualPaid: true,
    };
    // setProgressSpinner(true);
    handleOrderPayment({...payload, tipAmount: tipConfig});
  };

  const handleProceedToPay = () => {
    if (selectedPaymentMethod.type === CREDIT_CARD) {
      redirectToCreditCardDetails(history);
    } else if (selectedPaymentMethod.type === CASH) {
      handleCashPayment();
    }
  };

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

  return (
    <div className={classes.root}>
      {progressSpinner && (
        <CircularProgress className={classes.progressSpinner} color="primary" />
      )}
      <OrderTopbarWithBorder isBackAro={true}>
        <IxTxtBox
          className={classes.attributeItem}
          align="left"
          primary={t('orderr:tableName') + ' ' + tableNumber}
          primaryVariant="caption"
          secondary={t('orderr:Order Number', { orderNumber: displayOrderNo })}
          secondaryVariant="h6"
        ></IxTxtBox>
      </OrderTopbarWithBorder>

      <div className={classes.body}>
        {/* <span className={classes.currencyLabel}>¥</span> */}

        {/* <IxCurrency
          className={classes.paymentAmount}
          value={applyCompanyConfigPriceRounding(payable)}
          variant="h4"
        ></IxCurrency> */}
        <NxtPriceDisplay
          price={tipConfig?.tipAmount ? (payable - eatInTax - takeAwayTax) + tipConfig?.tipAmount : (payable - eatInTax - takeAwayTax)}
          priceIncludingTax={tipConfig?.tipAmount ? payable + tipConfig?.tipAmount : payable}
          option={companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]}
          // option={companyConfigEnum.PRICE_INCLUDING_TAX}
          rootClassName={classes.priceDisplayRoot}
          rowClassName={classes.priceDisplayRow}
          className={classes.priceDisplayClassName}
          suffixClassName={classes.priceDisplaySuffixClassName}
        ></NxtPriceDisplay>
        <IxTxtBox
          primary={t('orderr:ConfirmPayment')}
          primaryClassName={classes.confirmPaymentTitle}
          primaryVariant="h5"
          align="center"
          secondary={t('orderr:ConfirmPaymentHint')}
        ></IxTxtBox>
      </div>

      <div className={classes.bottomButtonWrapper}>
        <IxButton
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleProceedToPay}
          disabled={progressSpinner}
        >
          {t('orderr:ConfirmPayment')}
        </IxButton>

        <IxButton
          fullWidth
          color="primary"
          onClick={history.goBack}
          disabled={progressSpinner}
        >
          {t('orderr:cancel')}
        </IxButton>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleOrderPayment: (postData) => {
      dispatch(makePayment(postData));
    },
  };
};

const mapStateToProps = ({ appState, cart, paymentState }) => {
  return {
    appState,
    order: cart && cart.order,
    paymentState,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPayment);

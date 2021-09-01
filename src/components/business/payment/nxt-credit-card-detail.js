import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CircularProgress, makeStyles } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import IxTxtBox from '../../basic/ix-txt-box';
import IxButton from '../../basic/ix-button';
import IxIconButtonRadioGroup from '../../basic/ix-icon-btn-radio-group';
import IxControlledInput from '../../basic/ix-controlled-input';
import OrderTopbarWithBorder from '../../basic/nxt-topbar-with-bottom-border';

import { CREDIT_CARD } from '../../../constants/ix-enums';
import { PROCESSING } from '../../../constants/ix-enums';

import {
  redirectToOrderHome,
  redirectToPaymentHome,
} from '../../../services/utility';

import icons from '../../../assets/imgs/payment-icons';
import { makePayment } from './paymentSlice';

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
    paddingBottom: '9.375rem',
  },
  formDescription: {
    borderTop: '1px solid grye',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  verifiedByVisaDetailTitle: {
    fontSize: '20px',
  },
  verifiedByVisaDetailDescription: {
    fontSize: '12px !important',
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1.5rem',
  },
  formRowWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  columnFullWidth: {
    marginBottom: theme.spacing(2),
  },
  columnHalfWidth: {
    width: 'calc(50% - 4px)',
  },

  errorMeg: {
    '& h6': {
      textAlign: 'left',
    },
    '& .MuiTypography-colorTextSecondary': {
      color: theme.palette.text.errorMeg,
    },
  },
  progressSpinner: {
    position: 'fixed',
    top: 'calc(50% - 20px)',
    left: 'calc(50% - 20px)',
    zIndex: theme.zIndex.progressSpinner,
  },
  footerWrapper: {
    position: 'fixed',
    bottom: 0,
    paddingBottom: theme.spacing(3),
    width: 'calc( 100% - 32px )',
    backgroundColor: '#fff',
    zIndex: theme.zIndex.bottomNav,
  },
  bottomButtonWrapper: { backgroundColor: '#fff' },
  fullWidthHr: {
    // marginTop: theme.spacing(2),
    marginLeft: -theme.spacing(2),
    marginRight: -theme.spacing(2),
    borderTop: `1px solid ${theme.palette.border.light}`,
  },
}));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      format="##/##"
      placeholder="MM/YY"
      mask={['M', 'M', 'Y', 'Y']}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
    />
  );
}

export const NxtCreditCardDetail = ({
  history,
  appState,
  order,
  makePayment,
  paymentState,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const tipConfig = useSelector(state => state.order.tipConfig);
  const { displayOrderNo, id: orderId, payable } = order ? order : {};
  const { paymentMethods, payment } = paymentState;

  let paymentMethodsData = [];
  if (paymentMethods.data && paymentMethods.data.length) {
    paymentMethodsData = paymentMethods.data;
  }

  let restaurantTableData = appState.restaurantTable.data;
  let tableNumber;

  try {
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
    if (payment.data) {
      setProgressSpinner(false);
      redirectToPaymentHome(history);
    }
  }, [payment, history]);

  const [selectedPaymentType, setSelectedPaymentType] = useState();
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiryDate, setCardExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [progressSpinner, setProgressSpinner] = useState(false);
  const paymentTypes = getFilteredPaymentTypes(paymentMethodsData);
  const [selectedPaymentMethodIndex, setPaymentMethodIndex] = React.useState(
    -1,
  );

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!cardNumber || cardExpiryDate.length < 4 || !cvv) {
      return;
    }

    const payload = {
      orderId,
      paymentMethodId: selectedPaymentType.id,
      paymentAmount: payable,
      paymentDateTime: new Date().getTime(),
      status: PROCESSING,
      isManualPaid: false,
      cardInfo: {
        card_number: cardNumber.toString(),
        card_expire: getFormattedCreditCardExpiryDate(cardExpiryDate),
        security_code: cvv.toString(),
      },
      // tipAmount: {
      //   receiverStaffId: 0, // this will be 0 if receiverOption = RESTAURANT
      //   receiverOption: 'STAFF',  // or STAFF
      //   tipAmountOption: 'PERCENTAGE', // or NO_TIP or  PERCENTAGE
      //   //tipPercentage : isNaN(parseInt(tipAmount)) ? 0 : parseInt(tipAmount),
      //   tipPercentage : 5,
      //   tipAmount: 16.8
      
      // }
    };

    // setProgressSpinner(true);
    makePayment({...payload, tipAmount: tipConfig});
  };

  const handlePaymentMethodChange = (index) => {
    const paymentType = paymentTypes[index];
    const paymentMethod = paymentMethodsData.find(
      (item) => item.name === paymentType.name,
    );
    setSelectedPaymentType(paymentMethod);
    setPaymentMethodIndex(index);
  };

  function getFilteredPaymentTypes(paymentMethods) {
    const creditCardMethods = paymentMethods.filter(
      (paymentMethod) => paymentMethod.type === CREDIT_CARD,
    );

    return creditCardMethods.map((item, index) => {
      return {
        id: index,
        name: t(item.name),
        icon: item.name,
        type: item.type,
      };
    });
  }

  function getFormattedCreditCardExpiryDate(cardExpiryDate) {
    function splice(originalString, idx, rem, str) {
      return (
        originalString.slice(0, idx) +
        str +
        originalString.slice(idx + Math.abs(rem))
      );
    }

    return splice(cardExpiryDate, 2, 0, '/');
  }

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
        <div>
          <IxTxtBox
            align="center"
            primary={t('orderr:chooseCreditCartTypeHint')}
            primaryVariant="body1"
            color="primary"
          ></IxTxtBox>

          <IxIconButtonRadioGroup
            items={paymentTypes}
            iconOnly={true}
            icons={icons}
            selectedIndex={selectedPaymentMethodIndex}
            itemChange={handlePaymentMethodChange}
          ></IxIconButtonRadioGroup>
        </div>

        <form className={classes.formWrapper} autoComplete="off">
          <IxControlledInput
            label={t('orderr:CardNumber')}
            placeholder={t('orderr:CardNumber')}
            adornment={<LockOutlinedIcon color="primary" />}
            type="number"
            value={cardNumber}
            onChange={setCardNumber}
            className={classes.columnFullWidth}
            disabled={!selectedPaymentType}
          />

          <div className={classes.formRowWrapper}>
            <IxControlledInput
              variant="outlined"
              label={t('orderr:ExpiryDate')}
              value={cardExpiryDate}
              onChange={setCardExpiryDate}
              name="cardexpiry"
              id="nxt-user-payment-card-expiry"
              disabled={!selectedPaymentType}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </div>

          <div className={classes.formRowWrapper}>
            <IxControlledInput
              label={t('orderr:CVV')}
              placeholder={t('orderr:CVV')}
              value={cvv}
              onChange={setCVV}
              className={classes.columnHalfWidth}
              disabled={!selectedPaymentType}
            />
            <div className={classes.columnHalfWidth}>
              {/* <IxButton color="primary">{t('orderr:CVVHint')}</IxButton> */}
            </div>
          </div>
        </form>
      </div>
      <div className={classes.footerWrapper}>
        <div className={classes.fullWidthHr} />
        <IxTxtBox
          className={classes.formDescription}
          secondary={t('orderr:CreditCardDetailPageHint')}
          secondaryVariant="subtitle2"
        ></IxTxtBox>

        <div className={classes.bottomButtonWrapper}>
          <IxButton
            onClick={handlePayment}
            disabled={
              progressSpinner ||
              !cardNumber ||
              cardExpiryDate.length < 4 ||
              !cvv
            }
            fullWidth
            variant="contained"
            color="primary"
          >
            {t('orderr:PayNow')}
          </IxButton>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    makePayment: (postData) => {
      dispatch(makePayment(postData));
    },
  };
};

const mapStateToProps = ({ cart, order, appState, paymentState }) => {
  return {
    appState,
    order: cart && cart.order,
    paymentState,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NxtCreditCardDetail);

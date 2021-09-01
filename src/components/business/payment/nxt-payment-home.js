import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Grid } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { useReactToPrint } from 'react-to-print';

import NxtLayout from '../../composite/nxt-layout.js';
import IxIconButtonRadioGroup from '../../basic/ix-icon-btn-radio-group';
import IxButton from '../../basic/ix-button';
import IxTxtBox from '../../basic/ix-txt-box.js';
import IxCurrency from '../../basic/ix-currency.js';
import OrderTopbarWithBorder from '../../basic/nxt-topbar-with-bottom-border.js';

import { PAID } from '../../../constants/order-status.js';
import { updateTableStatusToOccupied } from '../../../services/guest.js';
import {
  groupBy,
  redirectToMenu,
  redirectToPaymentHome,
} from '../../../services/utility.js';

import PaymentBottomNav from './nxt-payment-bottom-nav.js';
import SupportedPaymentMethods from './nxt-supported-payment-methods';
import ComponentToPrint from './payslip/nxt-component-to-print';

import icons from '../../../assets/imgs/payment-icons';
import styles from './style.js';
import apiRequestStatusEnum from '../../../constants/api-request-status-enum.js';
import NxtPriceDisplay from '../../composite/nxt-price-display.js';
import companyConfigEnum from '../../../constants/company-config-enum.js';

function PaymentHome(props) {
  const { t } = useTranslation(['common']);
  const {
    appState,
    paymentState,
    order,
    setOrder,
    fetchPaymentMethods,
    setSelectedPaymentMethod,
    history,
    resetAppState,
    resetPaymentState,
  } = props;

  const { paymentMethods, invoice, payment } = paymentState;
  const invoiceData = invoice.data;
  const tipConfig = useSelector(state => state.order.tipConfig);

  let restaurantTableData,
    companyConfigData,
    companyId,
    branchId,
    tableCode,
    restaurantTableId,
    tableNumber;

  try {
    const { restaurantTable, companyConfig } = appState;
    restaurantTableData = restaurantTable.data;
    companyConfigData = companyConfig.data;
    restaurantTableId = restaurantTableData.id;
    tableNumber = restaurantTableData.tableNo;
    tableCode = restaurantTableData.tableCode;
    companyId = restaurantTableData.company.id;
    branchId = restaurantTableData.branch.id;
  } catch (e) {
    console.warn(e);
  }

  let paymentMethodsData = [];
  if (paymentMethods.data && paymentMethods.data.length) {
    paymentMethodsData = paymentMethods.data;
  }
  const paymentTypes = getPaymentMethodsGroups(paymentMethodsData);
  const classes = styles();

  const [displayOrderNo, setDisplayOrderNo] = React.useState();
  const [payableAmount, setPayableAmount] = React.useState();
  const [totalTax, setTotalTax] = React.useState();
  const [billPaid, setBillPaid] = React.useState(false);

  const [selectedPaymentMethodIndex, setPaymentMethodIndex] = React.useState(
    -1,
  );
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] = React.useState(
    false,
  );

  // loading payment methods if not already loaded
  useEffect(() => {
    if (paymentMethods.status === apiRequestStatusEnum.idle) {
      fetchPaymentMethods();
    }
  }, [branchId, companyId, fetchPaymentMethods, paymentMethods]);

  useEffect(() => {
    if (order) {
      const { payable, eatInTax, takeAwayTax, displayOrderNo, status } = order;
      if (status === PAID) {
        // setOrder(null);
        setBillPaid(true);
      }
      setPayableAmount(payable);
      setTotalTax(eatInTax + takeAwayTax);
      setDisplayOrderNo(displayOrderNo);
    } else {
      redirectToMenu(history);
    }
  }, [order, history]);

  // when bill paid by this user app instance
  useEffect(() => {
    if (payment.data) {
      setBillPaid(true);
    }
  }, [payment]);

  function getPaymentMethodsGroups(paymentMethods) {
    if (!paymentMethods || !paymentMethods.length) {
      return;
    }
    // group them by type
    const groupsByType = groupBy(paymentMethods, 'type');

    return groupsByType.map((item, index) => {
      return {
        id: index,
        name: t(item[0].type),
        icon: item[0].type,
        type: item[0].type,
      };
    });
  }

  const handlePaymentMethodChange = (index) => {
    const paymentType = paymentTypes[index];
    const paymentMethod = paymentMethodsData.find(
      (item) => item.type === paymentType.type,
    );
    setPaymentMethodIndex(index);
    setIsPaymentMethodSelected(true);
    setSelectedPaymentMethod(paymentMethod);
  };

  const handlePayment = async (event) => {
    event.preventDefault();
  };

  const componentRef = useRef();

  const getPageHeight = () => {
    if (props && props.payslip) {
      const { payslip } = props;
      let totalLines = 0;

      //add total number of items
      for (let i = 0; i < payslip.menus.length; i++) {
        totalLines += payslip.menus[i].invoiceItems.length;
      }

      // add total menus
      totalLines += payslip.menus.length;

      // for header, footer, sub-total
      totalLines += 20;

      return totalLines * 7.5 - totalLines * 0.85;
    }
    return 100;
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle:
      '@page { size: 100mm ' +
      getPageHeight().toString() +
      'mm;  margin: 0mm;} @media print { body { -webkit-print-color-adjust: exact; } }',
  });

  const checkout = () => {
    sessionStorage.clear();
    resetAppState();
    setOrder(null);
    resetPaymentState();
    // removeTableInformationFromSessionStorage();
    // history.push(`/home/for-table-book/${tableCode}`);
    history.push(`/home/for-table-book`);
  };

  const handleMakeTableOccupiedAndRedirect = async () => {
    const response = await updateTableStatusToOccupied(restaurantTableId);
    if (response && response.success) {
      resetPaymentState();
      setOrder(null);
      redirectToMenu(history);
    }
  };

  const paymentMethodsView = (
    <Box className={classes.paymentMethodsWrapper}>
      {paymentTypes && (
        <>
          <Grid>
            <Grid
              className={classes.orderDescription}
              justify="center"
              container
              direction="row"
            >
              <IxTxtBox
                align="center"
                primary={t('orderr:PaymentDescription')}
                primaryVariant="body1"
                color="primary"
              ></IxTxtBox>
            </Grid>
            <form onSubmit={handlePayment} className={classes.formContainer}>
              <Grid
                className={classes.paymentMethods}
                container
                direction="row"
              >
                {/* payment methods component */}
                <IxIconButtonRadioGroup
                  fullWidth={true}
                  items={paymentTypes}
                  icons={icons}
                  selectedIndex={selectedPaymentMethodIndex}
                  itemChange={handlePaymentMethodChange}
                ></IxIconButtonRadioGroup>
              </Grid>
            </form>
          </Grid>

          <Grid className={classes.SupportedPaymentMethodsWrapper}>
            <SupportedPaymentMethods
              paymentMethods={paymentMethodsData}
            ></SupportedPaymentMethods>
          </Grid>

          <Grid className={classes.btnBottom} container direction="row">
            {/* Button to pay */}
            <PaymentBottomNav
              history={history}
              rightChildText={t('static:next')}
              isSubmit={false}
              rightChildLink={`/confirm-payment`}
              rightChildDisabled={!isPaymentMethodSelected}
            ></PaymentBottomNav>
          </Grid>
        </>
      )}
    </Box>
  );

  const paymentResult = (
    <Box>
      <div className={classes.orderResultMessageWrapper}>
        <DoneIcon className={classes.orderResultIcon} color="primary" />
        <IxTxtBox
          className={classes.orderResultMessage}
          primary={t('orderr:PaymentSuccess')}
          primaryVariant="h6"
        ></IxTxtBox>
      </div>

      <Grid
        className={classes.paymentOrderResultMessage}
        justify="center"
        container
        direction="row"
      >
        {/* description */}
      </Grid>
      <Grid
        justify="center"
        className={classes.orderNumber}
        container
        direction="row"
      >
        <IxTxtBox
          className={classes.orderNumber}
          primary={t('orderr:Order Number', { orderNumber: displayOrderNo })}
          primaryVariant="h5"
          align="center"
        ></IxTxtBox>
      </Grid>

      <Grid justify="center" container direction="row" style={{marginBottom: '500px'}}>
        {/* <IxCurrency
          value={applyCompanyConfigPriceRounding(payableAmount)}
          variant="h4"
        ></IxCurrency> */}

        <NxtPriceDisplay
          price={tipConfig?.tipAmount ? (payableAmount - totalTax) + tipConfig?.tipAmount : payableAmount - totalTax}
          priceIncludingTax={tipConfig?.tipAmount ? payableAmount+tipConfig?.tipAmount : payableAmount}
          option={companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]}
          // option={companyConfigEnum.PRICE_INCLUDING_TAX}
          rootClassName={classes.priceDisplayRoot}
          rowClassName={classes.priceDisplayRow}
          className={classes.priceDisplayClassName}
          suffixClassName={classes.priceDisplaySuffixClassName}
        ></NxtPriceDisplay>
      </Grid>

      <Grid
        className={classes.btnBottom}
        justify="center"
        container
        direction="row"
      >
        <IxButton
          onClick={handlePrint}
          variant="contained"
          fullWidth
          color="primary"
          className={classes.nxtBtnPrimary + ' ' + classes.btnPrint}
          disabled={!invoiceData}
        >
          {t('downloadPayslipButton')}
        </IxButton>

        <IxButton
          onClick={() => {
            handleMakeTableOccupiedAndRedirect();
          }}
          variant="contained"
          fullWidth
          color="primary"
          className={classes.nxtBtnPrimary}
        >
          {t('orderr:OrderAgainBtnText')}
        </IxButton>

        <IxButton
          onClick={() => {
            checkout();
          }}
          variant="contained"
          fullWidth
          color="primary"
          className={classes.nxtBtnPrimary}
        >
          {t('orderr:Checkout')}
        </IxButton>
      </Grid>
    </Box>
  );

  return (
    <NxtLayout
      header={
        <OrderTopbarWithBorder isBackAro={true}>
          <IxTxtBox
            className={classes.attributeItem}
            align="left"
            primary={t('orderr:tableName') + ' ' + tableNumber}
            primaryVariant="caption"
            secondary={t('orderr:Order Number', {
              orderNumber: displayOrderNo,
            })}
            secondaryVariant="h6"
          ></IxTxtBox>
        </OrderTopbarWithBorder>
      }
    >
      <Box className={classes.root}>
        <div style={{ display: 'none' }}>
          {invoiceData ? (
            <ComponentToPrint
              orderId={displayOrderNo}
              payResponse={invoiceData}
              ref={componentRef}
            />
          ) : null}
        </div>

        {billPaid ? paymentResult : paymentMethodsView}
      </Box>
    </NxtLayout>
  );
}

export default PaymentHome;

import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import { CircularProgress, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DoneIcon from '@material-ui/icons/Done';
import // removeTableInformationFromSessionStorage,
// removeSessionDataFromSessionStorage,
'../../../actions/nxt-local-storage';
import LanguageNamespaces from '../../../constants/language-namespaces';
import NxtStaticFooter from '../../basic/nxt-static-footer';
import IxButton from '../../basic/ix-button';
import IxTxtBox from '../../basic/ix-txt-box';

import NxtFallback from '../../basic/nxt-fallback';
import { cancelOrder } from '../../../services/guest';
import { cancelOrderToProps } from '../../../actions/nxt-order-action';
import OrderTopbarWithBorder from '../../basic/nxt-topbar-with-bottom-border';

import { setOrder, setCart } from '../../../actions/cart';
import { redirectToMenu, redirectToOrderHome } from '../../../services/utility';
import NxtPriceDisplay from '../../composite/nxt-price-display';
import companyConfigEnum from '../../../constants/company-config-enum';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '& h4': {
      fontSize: '2rem',
      textAlign: 'center',
      color: theme.palette.text.commonSecondary,
    },
  },
  myDiolog: {
    '& .MuiDialogActions-root': {
      justifyContent: 'center',
    },
  },
  body: {
    paddingBottom: theme.spacing(18),
    marginBottom: '1em',
  },
  orderResultMessageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(8),
    '& .MuiTypography-colorTextPrimary': {
      fontSize: '1.5em',
      fontWeight: theme.typography.body1.fontWeight,
      marginTop: '1.2em',
    },
  },
  orderResultIcon: {
    marginTop: '0.6em',
    fontSize: '5rem',
    border: '3px solid',
    borderRadius: '50%',
    color: theme.palette.border.successTag,
  },
  orderResultMessage: {},
  orderNumber: {
    marginTop: '4.5em',
  },
  orderResultAttributesWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: theme.spacing(3),
    '& MuiTypography-body1': {
      color: theme.palette.text.commonSecondaryColor,
    },
  },
  orderAttribute: { display: 'flex' },
  footer: {},
  footerBtn: {
    marginBottom: theme.spacing(1),
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

const mapStateToProps = ({ cart, appState, language }) => {
  return {
    appState,
    order: cart.order,
    language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleOrderCancel: () => {
      dispatch(cancelOrderToProps());
    },
    handleSetOrder: (data) => {
      dispatch(setOrder(data));
    },
    handleResetCart: () => {
      dispatch(setCart());
    },
  };
};

const NxtOrderResult = (props) => {
  const {
    history,
    appState,
    language,
    order,
    handleSetOrder,
    handleResetCart,
    isUpdate,
  } = props;
  const [showProgressSpinner, setShowProgressSpinner] = useState(false);
  const classes = useStyles();
  const [t] = useTranslation([LanguageNamespaces.orderr]);
  const [open, setOpen] = React.useState(false);

  let companyConfigData,
    restaurantTableData,
    tableNumber,
    restaurantName,
    sectionName;

  try {
    const { restaurantTable, companyConfig } = appState;
    restaurantTableData = restaurantTable.data;
    companyConfigData = companyConfig.data;
    tableNumber = restaurantTableData.tableNo;
    restaurantName = restaurantTableData.branch.name;
    sectionName =
      restaurantTableData.section.name[language.code] || '';
    sectionName = sectionName ? ' - ' + sectionName : sectionName;
  } catch (e) {
    console.warn(e);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!order) {
    return <NxtFallback />;
  }

  const {
    // subTotal = 0,
    // totalTableCharge = 0,
    // kidsDiscount = 0,
    // discount = 0,
    takeAwayTax = 0,
    eatInTax = 0,
    payable = 0,
    prepareDuration = 0,
    displayOrderNo,
  } = order;

  const handleCancelOrder = async () => {
    const emptyOrder = { ...order, orderMenus: [] };
    setShowProgressSpinner(true);
    const response = await cancelOrder(order.id);
    setShowProgressSpinner(false);
    if (response && response.success) {
      handleResetCart();
      handleSetOrder(emptyOrder);
      // removeSessionDataFromSessionStorage();
      // removeTableInformationFromSessionStorage();
      redirectToOrderHome(history);
    } else {
      // todo handle error
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.topbar}>
        <OrderTopbarWithBorder style={{ marginLeft: '1em' }}>
          <IxTxtBox
            className={classes.attributeItem}
            align="left"
            primary={restaurantName + sectionName}
            primaryVariant="caption"
            secondary={t('tableName') + tableNumber}
            secondaryVariant="h6"
          ></IxTxtBox>
        </OrderTopbarWithBorder>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={classes.myDiolog}
      >
        <DialogTitle id="alert-dialog-title">
          {t('AreYouSureToDeleteTheOrder')}
        </DialogTitle>
        <DialogActions>
          <Button align="left" onClick={handleClose} color="primary">
            {t('No')}
          </Button>
          <Button onClick={handleCancelOrder} color="primary">
            {t('Yes')}
          </Button>
        </DialogActions>
      </Dialog>

      <div className={classes.body}>
        <div className={classes.orderResultMessageWrapper}>
          <DoneIcon className={classes.orderResultIcon} color="primary" />
          <IxTxtBox
            className={classes.orderResultMessage}
            primary={
              isUpdate ? t('orderUpdateMessage') : t('orderSuccessMessage')
            }
            primaryVariant="h6"
          ></IxTxtBox>
        </div>
        {/* `Order # ${displayOrderNo}`} */}
        <IxTxtBox
          className={classes.orderNumber}
          primary={t('Order Number', { orderNumber: displayOrderNo })}
          primaryVariant="h5"
          align="center"
        ></IxTxtBox>
        {/* <IxCurrency value={payable} variant="h4"></IxCurrency> */}
        <NxtPriceDisplay
          price={payable - eatInTax - takeAwayTax}
          priceIncludingTax={payable}
          option={companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]}
          // option={companyConfigEnum.PRICE_INCLUDING_TAX}
          rootClassName={classes.priceDisplayRoot}
          rowClassName={classes.priceDisplayRow}
          className={classes.priceDisplayClassName}
          suffixClassName={classes.priceDisplaySuffixClassName}
        ></NxtPriceDisplay>

        <div className={classes.orderResultAttributesWrapper}>
          <div className={classes.orderAttribute}>
            <Typography variant="body1">{`${t(
              'PreparingTimeLabel',
            )} ${prepareDuration} ${t('menus:Mins')}`}</Typography>
          </div>
        </div>
      </div>

      <NxtStaticFooter>
        <div className={classes.footer}>
          {/* <div className={classes.footerBtn}>{isPaymentBtn}</div> */}
          <div className={classes.footerBtn}>
            <IxButton
              onClick={() => {
                redirectToMenu(history);
              }}
              variant="contained"
              color="primary"
              fullWidth
            >
              {t('GoToHomepageBtnText')}
            </IxButton>
          </div>

          <div className={classes.footerBtn}>
            {/* todo enable_cancel */}
            {/* <IxButton color="primary" fullWidth onClick={handleClickOpen}>
              {t('CancelOrderBtnText')}
            </IxButton> */}
          </div>
        </div>
      </NxtStaticFooter>
      {showProgressSpinner && (
        <CircularProgress className={classes.progressSpinner} color="primary" />
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(NxtOrderResult);

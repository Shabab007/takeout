import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Box,
  Dialog,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import NxtLayout from '../../composite/nxt-layout.js';
import IxServedTag from '../../basic/ix-served-tag';
import IxBottomNav from '../../basic/ix-bottom-nav';
import IxButton from '../../basic/ix-button';
import IxTitle from '../../basic/ix-title';
import IxTxtBox from '../../basic/ix-txt-box.js';
import NxtTimer from '../../basic/nxt-timer.js';
import OrderTopbarWithBorder from '../../basic/nxt-topbar-with-bottom-border.js';

import { PARTIAL_DONE, DONE } from '../../../constants/order-status';

import {
  parseGuestConfig,
  redirectToMenu,
  redirectToPaymentHome,
  redirectToTipHome,
} from '../../../services/utility.js';
import NxtGuestConfigForm from '../guest-configuration/nxt-guest-config-form.js';

import styles from './nxt-order-timer/style.js';
import { bookRestaurantTable } from '../home/appStateSlice.js';

function OrderHome(props) {
  const classes = styles();
  const { t } = useTranslation(['orderr']);
  const pageLoadTimeStamp = new Date().getTime();
  const [
    guestConfigUPdatePopupOpen,
    setGuestConfigUpdatePopupOpen,
  ] = React.useState(false);

  const [tipConfigs, setTipConfigs] = React.useState(null);

  const dispatch = useDispatch();
  const { restaurantTable } = useSelector((state) => state.appState);
  const { language } = useSelector((state) => state);
  const { order, history, editOrderedItems, reorderSameItems, handleGetTipConfigs } = props;

  if (!restaurantTable.data) {
    dispatch(bookRestaurantTable());
  }

  const { tableNo: tableNumber, branch, section } = restaurantTable.data;
  const restaurantName = branch && branch.name;
  let sectionName;
  try {
    sectionName =
      (section && section.name && JSON.parse(section.name)[language.code]) ||
      '';
    sectionName = sectionName ? ' - ' + sectionName : sectionName;
  } catch (e) {
    console.info(e);
  }

  const {
    id: orderId = 0,
    status,
    displayOrderNo,
    orderStartTime = pageLoadTimeStamp,
  } = order ? order : {};

  let diningGuests;
  let totalGuestCount = 0;
  // if order exists, we use the guest from there, else from session storage
  if (order) {
    diningGuests = parseGuestConfig(order.orderGuests);
    totalGuestCount =
      diningGuests.male +
      diningGuests.female +
      diningGuests.kid +
      diningGuests.others;
  }

  const timeElapsedFromOrder = pageLoadTimeStamp - orderStartTime;

  const handleReorderSameItems = () => {
    reorderSameItems();
    history.push('/cart');
  };

  const handleGuestUpdatePopupOpen = () => {
    setGuestConfigUpdatePopupOpen(true);
  };

  const guestConfigUPdatePopupClose = () => {
    setGuestConfigUpdatePopupOpen(false);
  };

  const payNowButton = (redirectPath) => {
    // if (status === DONE || status === PARTIAL_DONE) {
    if (status === DONE || status === PARTIAL_DONE || 1) {
      return (
        <Grid
          className={classes.buttonGd}
          container
          justify="center"
          item
          direction="row"
        >
          <IxButton
            onClick={() => {
              redirectPath === 'tip' ? redirectToTipHome(history) : redirectToPaymentHome(history);
            }}
            variant="contained"
            fullWidth
            color="primary"
            className={classes.payNow}
          >
            {t('PayNow')}
          </IxButton>
        </Grid>
      );
    }
    return null;
  };

  useEffect(() => {
    async function fetchTipsAPI() {
      let response = await handleGetTipConfigs(
        branch.companyId,
        branch.id,
      );
      response && response.data && setTipConfigs(response.data)
    }

    fetchTipsAPI()
  }, [])

  return (
    <NxtLayout
      header={
        <OrderTopbarWithBorder isOnlyMenu={false}>
          <IxTxtBox
            className={classes.attributeItem}
            align="left"
            primary={restaurantName + sectionName}
            primaryVariant="caption"
            secondary={t('tableName') + tableNumber}
            secondaryVariant="h6"
          ></IxTxtBox>
        </OrderTopbarWithBorder>
      }
      footer={
        <Box className={classes.bottomNav} component="span">
          <IxBottomNav props={props}></IxBottomNav>
        </Box>
      }
    >
      <div className={classes.root}>
        {/* <NxtTopBar>
        <NxtTopBarItems handleSearchButton={openSearchOption}></NxtTopBarItems>
      </NxtTopBar> */}

        <Dialog
          fullWidth={true}
          maxWidth="xs"
          open={guestConfigUPdatePopupOpen}
          onClose={guestConfigUPdatePopupClose}
          aria-labelledby="next-guest-count-update-title"
        >
          <DialogContent>
            <NxtGuestConfigForm
              guest={diningGuests}
              orderId={orderId}
              handleClose={guestConfigUPdatePopupClose}
            ></NxtGuestConfigForm>
          </DialogContent>
        </Dialog>

        <div className={classes.bodyWrapper}>
          {order && restaurantTable.data ? (
            <>
              <Grid className={classes.orderDetailWrapper}>
                <Grid className={classes.guests} container item direction="row">
                  <Grid
                    className={classes.leftChild}
                    container
                    item
                    justify="flex-start"
                    xs={6}
                  >
                    <IxTxtBox
                      align="left"
                      primary={t('guestCount') + '- ' + totalGuestCount}
                      primaryVariant="h6"
                    ></IxTxtBox>
                  </Grid>
                  <Grid
                    onClick={handleGuestUpdatePopupOpen}
                    className={classes.rightChild}
                    container
                    item
                    justify="flex-end"
                    xs={6}
                  >
                    <IxTxtBox
                      align="left"
                      primary={t('guestUpdate')}
                      primaryVariant="subtitle1"
                      color="primary"
                    ></IxTxtBox>
                  </Grid>
                </Grid>

                <Grid
                  className={classes.order}
                  container
                  justify="center"
                  item
                  direction="row"
                >
                  <IxTitle
                    text={t('Order Number', { orderNumber: displayOrderNo })}
                    variant="h5"
                    alignment="center"
                    isMedium={false}
                  ></IxTitle>
                </Grid>
                <Grid
                  className={classes.statusWrapper}
                  container
                  justify="center"
                  item
                  direction="row"
                >
                  <IxServedTag>{t(`${status}`)}</IxServedTag>
                </Grid>

                <Grid
                  className={classes.countUpTimer}
                  container
                  justify="center"
                  item
                  direction="row"
                >
                  <NxtTimer
                    initialTime={
                      timeElapsedFromOrder >= 0 ? timeElapsedFromOrder : 0
                    }
                    direction="forward"
                  ></NxtTimer>
                </Grid>
              </Grid>
              <Grid className={classes.orderActionsWrapper}>
                {
                  tipConfigs && tipConfigs.data && tipConfigs.data.isEnabled ? payNowButton('tip') : payNowButton()
                }
                <Grid
                  className={classes.buttonGd}
                  container
                  justify="center"
                  item
                  direction="row"
                >
                  <IxButton
                    onClick={() => redirectToMenu(history)}
                    variant="contained"
                    color="primary"
                  >
                    {t('addNewItemToOrderBtnLabel')}
                  </IxButton>
                </Grid>
                <Grid
                  className={classes.buttonGd}
                  container
                  justify="center"
                  item
                  direction="row"
                >
                  <IxButton
                    className={classes.btnReorder}
                    variant="outlined"
                    color="#000000"
                    disabled={
                      editOrderedItems && editOrderedItems.length ? false : true
                    }
                    onClick={() => handleReorderSameItems()}
                  >
                    {t('reOrderBtnLabel')}
                  </IxButton>
                </Grid>
              </Grid>
            </>
          ) : (
            <Grid container>
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
        </div>
      </div>
    </NxtLayout>
  );
}

export default OrderHome;

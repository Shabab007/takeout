import React from 'react';
import { Grid } from '@material-ui/core';
import PaidItemsDineIn from './nxt-paid-items-dine-in';
import PaidItemsTakeOut from './nxt-paid-items-take-out';
import PaidItemsAllYouCanEat from './nxt-paid-items-all-you-can-eat';
import PaidSubtotal from './nxt-paid-subtotal';
import PaidTotal from './nxt-paid-total';
import { useTranslation } from 'react-i18next';
import { TAKE_AWAY, EAT_HERE, KIDS } from '../../../../constants/order-status';
import { formatDateTime } from '../../../../services/utility';

function PaidItems({ invoice }) {
  const { t } = useTranslation(['orderr']);
  const {
    orderNo: displayOrderNo,
    orderId: orderNumber,
    menus,
    noOfGuests,
    tableNo,
    total,
    tipAmount,
    paymentMethodName,
    // orderTime,
    paymentTime,
  } = invoice;

  const formattedPaymentTime = formatDateTime(paymentTime);
  let regularItems = [];
  let dineInItems = [];
  let takeOutItems = [];
  let packageMenus = [];
  let numberOfGuest = 0,
    numberOfGuestWithoutKids = 0;

  if (noOfGuests && noOfGuests.length) {
    noOfGuests.map((x) => {
      if (x.guestCategory !== KIDS) {
        numberOfGuestWithoutKids = numberOfGuestWithoutKids + x.noOfPerson;
      }
      numberOfGuest = numberOfGuest + x.noOfPerson;
      return null;
    });
  }

  if (menus && menus.length) {
    packageMenus = menus.filter((menu) => menu.isPackage);
    regularItems = menus
      .filter((menu) => !menu.isPackage)
      .flatMap((regularMenu) => regularMenu.invoiceItems);
  }

  if (regularItems && regularItems.length) {
    dineInItems = regularItems.filter(
      (item) => item.itemDeliveryType === EAT_HERE,
    );
    takeOutItems = regularItems.filter(
      (item) => item.itemDeliveryType === TAKE_AWAY,
    );
    // takeOutItems = regularItems.filter((item) => {
    //   if (item.itemDeliveryType === TAKE_AWAY) {
    //     return item;
    //   }
    // });
  }

  return (
    <Grid className="items" style={{ fontSize: '0.9em' }} container>
      <Grid
        className="information"
        style={{ fontWeight: 'bold', marginBottom: '0.5em' }}
        container
        direction="row"
      >
        <Grid
          className="informationOrderNo"
          style={{ textTransform: 'capitalize' }}
          justify="flex-start"
          container
          item
          xs={12}
        >
          {t('Order Number', {
            orderNumber: displayOrderNo ? displayOrderNo : orderNumber,
          })}
        </Grid>
      </Grid>

      <Grid
        className="tableNo"
        style={{ textTransform: 'capitalize', paddingBottom: '0.2em' }}
        container
        direction="row"
      >
        <Grid className="tableNoNo" container item xs={4}>
          {t('tableName')}#{tableNo}
        </Grid>
        <Grid
          className="tableDateTime"
          justify="flex-end"
          container
          item
          xs={8}
        >
          {t('date')}:{' '}
          <span style={{ textTransform: 'lowercase' }}>
            {formattedPaymentTime}
          </span>
        </Grid>
      </Grid>

      {dineInItems.length ? (
        <PaidItemsDineIn items={dineInItems}></PaidItemsDineIn>
      ) : null}
      {takeOutItems.length ? (
        <PaidItemsTakeOut items={takeOutItems}></PaidItemsTakeOut>
      ) : null}

      {packageMenus.length ? (
        <PaidItemsAllYouCanEat
          menus={packageMenus}
          numberOfGuest={numberOfGuestWithoutKids}
        ></PaidItemsAllYouCanEat>
      ) : null}

      <PaidSubtotal
        response={invoice}
        numberOfGuest={numberOfGuestWithoutKids}
      ></PaidSubtotal>
      <PaidTotal
        total={total + tipAmount}
        paymentMethodName={paymentMethodName}
      ></PaidTotal>
    </Grid>
  );
}

export default PaidItems;

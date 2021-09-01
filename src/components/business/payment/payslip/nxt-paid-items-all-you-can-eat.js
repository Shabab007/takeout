import React from 'react';
import { Grid } from '@material-ui/core';
import IxCurrency from '../../../basic/ix-currency';
import nxtMenuTypes from '../../../../constants/nxt-menu-types';
// import { useTranslation } from 'react-i18next';

function PaidItemsAllYouCanEat({ menus, numberOfGuest }) {
  // const { t } = useTranslation(['orderr']);

  const itemsShowing = menus.map((menu, index) => {
    return (
      <Grid key={index} container>
        <Grid
          className="foodItemTitle"
          style={{ fontWeight: 'bold', marginTop: '0.3em' }}
          container
          direction="row"
        >
          <Grid container direction="row">
            <Grid container item xs={9}>
              {menu.name} (
              <span
                className="allCalculation"
                style={{
                  fontSize: '0.8em',
                  // marginTop: '0.2em',
                  marginLeft: '0.2em',
                  marginRight: '0.2em',
                }}
              >
                <IxCurrency
                  className="allCalculationItemPrice"
                  value={menu.packagePrice}
                  variant="h6"
                ></IxCurrency>{' '}
              </span>
              <span
                className="allCalculation operants"
                style={{
                  fontSize: '0.8em',
                  // marginTop: '0.2em',
                  marginLeft: '0.2em',
                  marginRight: '0.2em',
                  //marginTop: '0.4em',
                }}
              >
                {' '}
                x {numberOfGuest}
              </span>
              )
            </Grid>
            <Grid justify="flex-end" container item xs={3}>
              <IxCurrency
                className="allCalculationItemTotalPrice"
                style={{ fontWeight: '600' }}
                value={menu.packagePrice * numberOfGuest}
                variant="h6"
              ></IxCurrency>
            </Grid>
          </Grid>
        </Grid>
        {menu.invoiceItems && menu.invoiceItems.length
          ? menu.invoiceItems.map((item, itemIndex) => {
              if (
                item.foodItemCode !==
                nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE
              ) {
                return (
                  <Grid
                    key={itemIndex}
                    container
                    direction="row"
                    className="allYouCanEatItemsRow"
                  >
                    <Grid style={{ textAlign: 'left' }} item xs={9}>
                      {item.quantity} {item.foodItemName}
                    </Grid>
                    <Grid
                      justify="flex-end"
                      item
                      xs={3}
                      style={{ textAlign: 'right', fontWeight: 'bold' }}
                    >
                      <IxCurrency className="itemPrice" value={0}></IxCurrency>
                    </Grid>
                  </Grid>
                );
              }
            })
          : null}
      </Grid>
    );
  });

  return (
    <Grid
      className="foodItem foodItemDineIn borderTopSingle"
      style={{ borderTop: '1px solid rgba(0,0,0,0.54)' }}
      container
    >
      {itemsShowing}
    </Grid>
  );
}

export default PaidItemsAllYouCanEat;

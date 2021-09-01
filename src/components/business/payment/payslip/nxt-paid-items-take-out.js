import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import IxCurrency from '../../../basic/ix-currency';
import { useTranslation } from 'react-i18next';
import companyConfigEnum from '../../../../constants/company-config-enum';

function PaidItemsTakeOut({ items }) {
  const { t } = useTranslation(['orderr']);
  const companyConfig = useSelector((state) => state.appState.companyConfig);
  const companyConfigData = companyConfig.data;

  // let takeAwayTax, diningTax;

  // try {
  //   takeAwayTax = companyConfigData[companyConfigEnum.TAKE_AWAY_TAX];
  //   diningTax = companyConfigData[companyConfigEnum.EAT_IN_TAX];
  // } catch (e) {
  //   console.warn(e);
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
  return (
    <Grid
      className="foodItem foodItemDineIn borderTopSingle"
      style={{ borderTop: '1px solid rgba(0,0,0,0.54)' }}
      container
    >
      <Grid
        className="foodItemTitle"
        style={{ fontWeight: 'bold', marginTop: '0.3em' }}
        container
        direction="row"
      >
        {t('takeout')}
      </Grid>
      {items.map((item, index) => {
        const { foodItemChoicesNames, price, foodItemName, quantity } = item;
        let totalFoodItemPrice = price;
        foodItemChoicesNames.map((choiceItem) => {
          totalFoodItemPrice += choiceItem.price;
        });
        return (
          <Grid key={index} container>
            <Grid container item xs={8}>
              {quantity} {foodItemName}
            </Grid>
            <Grid justify="flex-end" container item xs={4}>
              <IxCurrency
                className="itemPrice"
                value={applyCompanyConfigPriceRounding(totalFoodItemPrice)}
              ></IxCurrency>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default PaidItemsTakeOut;

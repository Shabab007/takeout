import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import IxCurrency from '../../../basic/ix-currency';
import { useTranslation } from 'react-i18next';
import companyConfigEnum from '../../../../constants/company-config-enum';

function PaidTotal({ total, paymentMethodName }) {
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

  const { t } = useTranslation(['orderr']);
  return (
    <Grid
      className="foodItem borderTopDouble"
      style={{ borderTop: '2px solid rgba(0,0,0,0.54)' }}
      container
    >
      <Grid
        className="foodItemTitle paidTotal"
        style={{ fontWeight: 'bold', marginTop: '0.3em', fontSize: '1.2em' }}
        container
        direction="row"
      >
        <Grid container item xs={8}>
          {t('Total')}
        </Grid>
        <Grid justify="flex-end" container item xs={4}>
          <IxCurrency
            className="itemPrice totalPrice"
            style={{ fontSize: '1.1em', fontWeight: '800' }}
            value={applyCompanyConfigPriceRounding(total)}
            variant="h6"
          ></IxCurrency>
        </Grid>
      </Grid>
      {/* <Grid container direction="row">
        <Grid container item xs={8}>
          {paymentMethodName}
        </Grid>
        <Grid justify="flex-end" container item xs={4}>
          <IxCurrency className="itemPrice" value={total} variant="h6"></IxCurrency>
        </Grid>
      </Grid> */}
    </Grid>
  );
}

export default PaidTotal;

import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import IxCurrency from '../../../basic/ix-currency';
import { useTranslation } from 'react-i18next';
import companyConfigEnum from '../../../../constants/company-config-enum';

function PaidSubtotal({ response, numberOfGuest }) {
  const { t } = useTranslation(['orderr']);
  const companyConfig = useSelector((state) => state.appState.companyConfig);
  const companyConfigData = companyConfig.data;

  let takeAwayTax, diningTax;

  try {
    takeAwayTax = companyConfigData[companyConfigEnum.TAKE_AWAY_TAX];
    diningTax = companyConfigData[companyConfigEnum.EAT_IN_TAX];
  } catch (e) {
    console.warn(e);
  }

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
      className="foodItem borderTopSingle"
      style={{ borderTop: '1px solid rgba(0,0,0,0.54)' }}
      container
    >
      <Grid
        className="foodItemTitle"
        style={{ fontWeight: 'bold', marginTop: '0.3em' }}
        container
        direction="row"
      >
        <Grid container item xs={8}>
          {t('Subtotal')}
        </Grid>
        <Grid justify="flex-end" container item xs={4}>
          <IxCurrency
            className="itemPrice subtotal"
            style={{ fontWeight: '600' }}
            value={applyCompanyConfigPriceRounding(response.subtotal)}
            variant="h6"
          ></IxCurrency>
        </Grid>
      </Grid>
      {/* start loop */}

      <Grid container direction="row">
        <Grid justify="flex-start" container item xs={9}>
          {/* TAX (DINE IN 15%, TAKE OUT 10%) */}
          {t('Taxes and fees', { diningTax, takeAwayTax })}
        </Grid>
        <Grid justify="flex-end" container item xs={3}>
          <IxCurrency
            className="itemPrice"
            value={applyCompanyConfigPriceRounding(response.tax)}
            variant="h6"
          ></IxCurrency>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid container item xs={8}>
          {t('Chargees')} (
          <IxCurrency
            className="itemPrice subtotalCharges"
            style={{ marginTop: '-0.2em' }}
            value={applyCompanyConfigPriceRounding(response.tableCharge)}
            variant="h6"
          ></IxCurrency>{' '}
          <span
            className="space2"
            style={{ textTransform: 'lowercase', paddingLeft: '0.5em' }}
          >
            x {numberOfGuest}
          </span>{' '}
          )
        </Grid>
        <Grid justify="flex-end" container item xs={4}>
          <IxCurrency
            className="itemPrice"
            value={applyCompanyConfigPriceRounding(response.totalTableCharge)}
            variant="h6"
          ></IxCurrency>
        </Grid>
      </Grid>

      <Grid container direction="row">
        <Grid container item xs={8}>
          {t('Discount')}
        </Grid>
        <Grid justify="flex-end" container item xs={4}>
          <IxCurrency
            className="itemPrice"
            value={applyCompanyConfigPriceRounding(response.discount)}
            variant="h6"
          ></IxCurrency>
        </Grid>
      </Grid>

      <Grid container direction="row">
        <Grid container item xs={8}>
        {t('tip')}
        </Grid>
        <Grid justify="flex-end" container item xs={4}>
          <IxCurrency
            className="itemPrice"
            value={applyCompanyConfigPriceRounding(response.tipAmount)}
            variant="h6"
          ></IxCurrency>
        </Grid>
      </Grid>

      {/* end loop */}
    </Grid>
  );
}

export default PaidSubtotal;

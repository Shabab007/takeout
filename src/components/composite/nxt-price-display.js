import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import companyConfigEnum from '../../constants/company-config-enum';
import { useSelector } from 'react-redux';
import { getNumber } from '../../services/utility';

const useStyles = makeStyles((theme) => ({
  rootInternal: {
    display: 'flex',
    flexDirection: 'column',
  },
  rowInternal: {
    display: 'flex',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    alignItems: 'flex-end',
  },
}));

function NxtPriceDisplay({
  price,
  priceIncludingTax,
  shouldApplyCompanyConfigPriceRounding = true,
  option,
  prefix,
  subTitle,
  className,
  variant = 'h5',
  suffixClassName,
  suffixVariant = 'subtitle1',
  rootClassName,
  rowClassName,
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  const getFormattedNumber = (value) => {
    const checkedValue = getNumber(value);
    if (Number.isInteger(checkedValue)) {
      return checkedValue;
    }
    return (Math.round(checkedValue * 100) / 100).toFixed(2);
  };

  const getInteger = (value) => {
    const checkedValue = getNumber(value);
    if (Number.isInteger(checkedValue)) {
      return checkedValue;
    }
    return Number.parseInt(checkedValue);
  };

  const companyConfigData = useSelector(
    (state) => state.appState.companyConfig.data,
  );

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

  const displayPrice = shouldApplyCompanyConfigPriceRounding
    ? applyCompanyConfigPriceRounding(getFormattedNumber(price))
    : getInteger(price);

  const displayPriceIncludingTax = shouldApplyCompanyConfigPriceRounding
    ? applyCompanyConfigPriceRounding(getFormattedNumber(priceIncludingTax))
    : getInteger(priceIncludingTax);

  return (
    // todo refactor
    <div className={clsx(classes.rootInternal, rootClassName)}>
      {(option === companyConfigEnum.BOTH_INCL_EXCL_TAX ||
        option === companyConfigEnum.PRICE_EXCLUDING_TAX) && (
        <div className={clsx(classes.rowInternal, rowClassName)}>
          <Typography className={className} variant={variant}>
            {(prefix ? prefix + ' ' : '') + '¥' + displayPrice}
          </Typography>
          <Typography
            className={suffixClassName}
            variant={suffixVariant}
            color={'textSecondary'}
          >
            ({t('common:withoutTax')})
          </Typography>
        </div>
      )}
      {(option === companyConfigEnum.BOTH_INCL_EXCL_TAX ||
        option === companyConfigEnum.PRICE_INCLUDING_TAX) && (
        <div className={clsx(classes.rowInternal, rowClassName)}>
          <Typography className={className} variant={variant}>
            {(prefix ? prefix + ' ' : '') + '¥' + displayPriceIncludingTax}
          </Typography>
          <Typography
            className={suffixClassName}
            variant={suffixVariant}
            color={'textSecondary'}
          >
            ({t('common:withTax')})
          </Typography>
        </div>
      )}
      {subTitle && <Typography color={'textSecondary'}>{subTitle}</Typography>}
    </div>
  );
}

export default NxtPriceDisplay;

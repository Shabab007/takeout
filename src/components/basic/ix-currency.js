import React from 'react';
import { Typography } from '@material-ui/core';
import { getNumber } from '../../services/utility';

const IxCurrency = ({
  className,
  value,
  prefix,
  variant = 'subtitle1',
  unformatted = false,
}) => {
  const getFormattedNumber = () => {
    const checkedValue = getNumber(value);
    if (Number.isInteger(checkedValue)) {
      return checkedValue;
    }
    return (Math.round(checkedValue * 100) / 100).toFixed(2);
  };

  if (unformatted) {
    return (
      <span>{(prefix ? prefix + ' ' : '') + '¥' + getFormattedNumber()}</span>
    );
  }

  return (
    <div className={className}>
      <Typography variant={variant}>
        {(prefix ? prefix + ' ' : '') + '¥' + getFormattedNumber()}
      </Typography>
    </div>
  );
};

export default IxCurrency;

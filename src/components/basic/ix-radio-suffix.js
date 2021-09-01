import React from 'react';
import { FormControlLabel, Radio, Typography } from '@material-ui/core';
import IxControlSuffix from './ix-control-suffix';

const IxRadioSuffix = ({
  value,
  label,
  suffix,
  controlColor = 'primary',
  suffixColor = 'textSecondary',
  className,
}) => {
  const control = (
    <FormControlLabel
      value={value}
      label={label}
      control={<Radio color={controlColor} />}
      color="textSecondary"
    />
  );
  const suffixElement = (
    <Typography variant="subtitle1" color={suffixColor}>
      {suffix}
    </Typography>
  );
  return (
    <IxControlSuffix
      className={className}
      control={control}
      suffix={suffixElement}
    ></IxControlSuffix>
  );
};

export default IxRadioSuffix;

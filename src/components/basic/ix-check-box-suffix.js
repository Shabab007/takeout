import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import IxControlSuffix from './ix-control-suffix';

const IxCheckBoxSuffix = ({
  name,
  label,
  checked,
  value,
  handleChange,
  controlColor = 'primary',
  suffix,
  suffixColor,
  suffixClassName,
}) => {
  const control = (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={handleChange} name={name} value={value} color={controlColor} />}
      label={label}
    />
  );
  const suffixElement = <span color={suffixColor}>{suffix}</span>;
  return <IxControlSuffix control={control} suffix={suffixElement} suffixClassName={suffixClassName}></IxControlSuffix>;
};

export default IxCheckBoxSuffix;

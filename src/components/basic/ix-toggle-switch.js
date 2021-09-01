import React from 'react';
import Switch from '@material-ui/core/Switch';
import { FormControlLabel, Typography } from '@material-ui/core';

const IxToggleSwitch = ({
  name,
  checked,
  onChange,
  color = 'primary',
  label,
  labelVariant = 'subtitle2',
  labelColor = 'textSecondary',
  disabled,
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={onChange}
          color={color}
          name={name}
          inputProps={{ 'aria-label': 'primary checkbox' }}
          disabled={disabled}
        />
      }
      label={
        <Typography variant={labelVariant} color={labelColor}>
          {label}
        </Typography>
      }
    />
  );
};

export default IxToggleSwitch;

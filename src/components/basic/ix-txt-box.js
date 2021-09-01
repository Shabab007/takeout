import React from 'react';
import { Typography } from '@material-ui/core';

const IxTxtBox = ({
  primary,
  secondary,
  primaryVariant = 'h4',
  secondaryVariant = 'subtitle1',
  align = 'center',
  className,
  primaryClassName = '',
  secondaryClassName = '',
  primaryColor = 'textPrimary',
  secondaryColor = 'textSecondary',
  reversed = false,
}) => {
  if (!reversed) {
    return (
      <div className={className}>
        <Typography
          className={primaryClassName}
          variant={primaryVariant}
          align={align}
          color={primaryColor}
        >
          {primary}
        </Typography>
        <Typography
          className={secondaryClassName}
          variant={secondaryVariant}
          align={align}
          color={secondaryColor}
        >
          {secondary}
        </Typography>
      </div>
    );
  }
  return (
    <div className={className}>
      <Typography
        className={secondaryClassName}
        variant={secondaryVariant}
        align={align}
        color={secondaryColor}
      >
        {secondary}
      </Typography>
      <Typography
        className={primaryClassName}
        variant={primaryVariant}
        align={align}
        color={primaryColor}
      >
        {primary}
      </Typography>
    </div>
  );
};

export default IxTxtBox;

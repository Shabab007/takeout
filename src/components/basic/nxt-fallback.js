import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';

const NxtFallback = () => {
  const [t] = useTranslation();
  return (
    <Typography variant="body1" color="textSecondary">
      {t('loading-text')}
    </Typography>
  );
};

export default NxtFallback;

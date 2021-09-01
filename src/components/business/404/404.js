import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import nextLogo from '../../../assets/imgs/common/regiless-user-app-logo.png';
import { Typography } from '@material-ui/core';
import NxtLayout from '../../composite/nxt-layout';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
}));

function UrlNotFound(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <NxtLayout childrenCentered={true}>
      <div className={classes.root}>
        <img src={nextLogo} alt="next logo" />
        <Typography align="center" variant="h6">
          {t('scan:tableCodeNotFoundInUrlMsg')}
        </Typography>
      </div>
    </NxtLayout>
  );
}

export default UrlNotFound;

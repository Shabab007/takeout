import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Grid, Box } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import NextLogo from '../../../assets/imgs/common/regiless-user-app-logo.png';
import IxTxtBox from '../../basic/ix-txt-box';
import IxButton from '../../basic/ix-button';
import IxTitle from '../../basic/ix-title';

import {
  redirectToTempScan,
  redirectToLanguageSelection,
  redirectToRestaurantHome,
  redirectToTableBookErrorPage,
  redirectToGuide,
} from '../../../services/utility';

import apiRequestStatusEnum from '../../../constants/api-request-status-enum';

import { setOrder, setCart } from '../../../actions/cart';

import {
  fetchRestaurantTableSession,
  bookRestaurantTable,
  fetchCompanyConfig,
  verifyQRcodeValidity,
  setSecurityCodeStatus, // todo temporary. remove when done
} from './appStateSlice';

import useStyles from './styles';

const NxtBookRestaurantTable = ({
  history,
  match,
  // location,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();
  // const { referer } = location && location.state ? location.state : {};

  const appState = useSelector((state) => state.appState);
  const languageState = useSelector((state) => state.language);

  const [showProgressSpinner, setShowProgressSpinner] = useState(false);

  const { session, restaurantTable, companyConfig, securityCode } = appState;

  // order of execution => get session, success -> get restaurantTable, success -> get companyConfig, success -> verify securityCode
  useEffect(() => {
    if (
      session.status === apiRequestStatusEnum.failed ||
      restaurantTable.status === apiRequestStatusEnum.failed ||
      companyConfig.status === apiRequestStatusEnum.failed
    ) {
      redirectToTableBookErrorPage(history);
    }

    setShowProgressSpinner(
      session.status === apiRequestStatusEnum.loading ||
        restaurantTable.status === apiRequestStatusEnum.loading ||
        companyConfig.status === apiRequestStatusEnum.loading ||
        securityCode.status === apiRequestStatusEnum.loading
    );
  }, [session, restaurantTable, companyConfig, securityCode, history]);

  useEffect(() => {
    if (securityCode.status === apiRequestStatusEnum.succeeded) {
      redirectToRestaurantHome(history);
    } else if (securityCode.status === apiRequestStatusEnum.failed) {
      redirectToTempScan(history);
    }
  }, [securityCode, history]);

  useEffect(() => {
    if (session.status === apiRequestStatusEnum.succeeded && restaurantTable.status === apiRequestStatusEnum.idle) {
      dispatch(bookRestaurantTable());
    }
  }, [session, restaurantTable, dispatch]);

  useEffect(() => {
    if (
      restaurantTable.status === apiRequestStatusEnum.succeeded &&
      companyConfig.status === apiRequestStatusEnum.idle
    ) {
      dispatch(fetchCompanyConfig());
    }
  }, [restaurantTable, companyConfig, dispatch]);

  useEffect(() => {
    const dependencyToVerifySecurity =
      companyConfig.status === apiRequestStatusEnum.succeeded && securityCode.status === apiRequestStatusEnum.idle;

    if (dependencyToVerifySecurity && securityCode.data) {
      // if status is idle, and it has data, means its cached data, need to verify.
      //dispatch(verifyQRcodeValidity(securityCode.data.tableBookingNbr)); // todo: for dev testing. uncoment this
      dispatch(setSecurityCodeStatus('succeeded')); // todo remove this line
    } else if (dependencyToVerifySecurity && !securityCode.data) {
      redirectToLanguageSelection(history);
    }
  }, [companyConfig, securityCode, languageState, dispatch, history]);

  const handleGetSession = () => {
    const { tableCode } = match.params;
    if (!tableCode) {
      console.error('Table code not provided');
      return;
    }
    dispatch(setOrder(null));
    dispatch(setCart());
    dispatch(fetchRestaurantTableSession({ tableCode }));
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Grid className={classes.gridContainer} container direction="row" justify="center" alignItems="center">
        <img src={NextLogo} className={classes.logo} alt="app logo" />

        <div className={classes.greeting}>
          <IxTxtBox secondary={t('common:homePageDescription')}></IxTxtBox>
        </div>

        <div>
          <IxButton
            variant="contained"
            fullWidth
            color="primary"
            className={classes.continueButton}
            // disabled={showProgressSpinner}
            onClick={() => {
              !showProgressSpinner && handleGetSession();
            }}
          >
            {t('homePageButton')}
          </IxButton>

          <Box className={classes.footerText} direction="span">
            <IxTitle variant="caption">{t('copyrightText')}</IxTitle>
          </Box>
          <Box>
            <a
              href="https://ixorasolution.com/"
              className={classes.companyBackLink}
            >
              iXora Solution Ltd
            </a>
          </Box>
        </div>
      </Grid>
    </div>
  );
};

export default NxtBookRestaurantTable;

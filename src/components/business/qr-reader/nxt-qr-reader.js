import React, { lazy, Suspense, useState, useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import QrIcon from './qr-icon';
import NxtTopBar from '../../basic/nxt-top-bar';
import { redirectToRestaurantHome } from '../../../services/utility';
import { verifyQRcodeValidity } from '../home/appStateSlice.js';
import apiRequestStatusEnum from '../../../constants/api-request-status-enum';

const QrReader = lazy(() => import('react-qr-reader'));

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  pageTitleWrapper: {
    // flex child:: 1
    display: 'block',
    boxSizing: 'border-box',
    //padding: theme.spacing(2),
    margin: 0,
  },
  qrHint: {
    display: 'block',
    marginTop: '1rem',
    color: '#7f8195',
    textAlign: 'center',
  },
  bottomBar: {
    // flex child:: 3
    width: '100%',
    borderTop: '1px solid',
    borderTopColor: theme.palette.primary.main,
    backgroundColor: '#1A1311',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarCircle: {
    fontSize: '4rem',
    color: theme.palette.primary.light,
    marginTop: '.8rem',
    marginBottom: '.8rem',
  },
  // qr reader plugin styling
  qrWrapper: {
    // flex child:: 2
    marginTop: theme.spacing(7),
    position: 'relative',
    width: '100vw !important',
    height: '100vw !important',
    maxWidth: '650px !important',
    maxHeight: '650px !important',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxSizing: 'border-box',
    '& *': {
      boxSizing: 'border-box',
    },
  },
  qrLoadingWrapper: {
    padding: '50px',
  },
  qrLoading: {
    display: 'block',
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: '50px',
  },
  qrReader: {
    position: 'relative',
    display: 'block',
    width: '100%',
    height: '100%',
    '& section': {
      '& div': {
        border: '50px solid transparent !important',
        boxShadow: 'none !important',
        height: '100%',
        paddingTop: '0 !important',
      },
      '& video': {
        boxSizing: 'border-box',
      },
    },
  },
  qrFrame: {
    position: 'absolute',
    display: 'block',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    zIndex: theme.zIndex.body,
    border: '50px solid transparent !important',

    '&::before, &::after, & > :first-child::before, & >:first-child::after': {
      position: 'absolute',
      content: `' '`,
      width: '4rem',
      height: '4rem',
      borderColor: theme.palette.primary.light /* or whatever colour */,
      borderStyle: 'solid' /* or whatever style */,
    },
    '&::before': {
      top: 0,
      left: 0,
      borderWidth: '0.375rem 0 0 0.375rem',
    },
    '&::after': {
      top: 0,
      right: 0,
      borderWidth: ' 0.375rem 0.375rem 0 0',
    },
    '& >:first-child': {
      '&::before': {
        bottom: 0,
        right: 0,
        borderWidth: '0 0.375rem 0.375rem 0',
      },
      '&::after': {
        bottom: 0,
        left: 0,
        borderWidth: '0 0 0.375rem 0.375rem',
      },
    },
  },
}));

const NxtQrReader = ({ history }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [qrHint, setQrHint] = useState(t('loading-text'));

  const appState = useSelector((state) => state.appState);
  const { securityCode } = appState;

  useEffect(() => {
    if (securityCode.status === apiRequestStatusEnum.succeeded) {
      redirectToRestaurantHome(history);
    }

    if (securityCode.status === apiRequestStatusEnum.failed) {
      setQrHint(t('qrScanHint'));
    }
  }, [securityCode, history, setQrHint, t]);

  // scan success
  const handleScan = (data) => {
    if (data) {
      setQrHint(data);
      dispatch(verifyQRcodeValidity(data));
    }
  };

  // error scanning
  const handleError = (err) => {
    setQrHint(err.message);
  };

  // on load qr reader
  const handleOnLoad = () => {
    setQrHint(t('qrScanHint'));
  };

  return (
    <div className={classes.root}>
      <div className={classes.pageTitleWrapper}>
        <NxtTopBar>
          <Typography align="left" variant="h6">
            {t('scanQrPageTitle')}
          </Typography>
        </NxtTopBar>
      </div>

      <div>
        <div className={classes.qrWrapper}>
          <Suspense
            fallback={
              <div className={classes.qrLoadingWrapper}>
                <QrIcon width={'100%'} height={'100%'} className={classes.qrLoading} />
              </div>
            }
          >
            <div className={classes.qrFrame}>
              <div></div>
            </div>

            <QrReader
              className={classes.qrReader}
              delay={300}
              resolution={600}
              onError={handleError}
              onLoad={handleOnLoad}
              onScan={handleScan}
              facingMode={'environment'}
            />
          </Suspense>
        </div>
        <div>
          <Typography variant="subtitle1" className={classes.qrHint}>
            {qrHint}
          </Typography>
        </div>
      </div>
      <div className={classes.bottomBar}>
        <RadioButtonUncheckedIcon className={classes.bottomBarCircle} />
      </div>
    </div>
  );
};

export default NxtQrReader;

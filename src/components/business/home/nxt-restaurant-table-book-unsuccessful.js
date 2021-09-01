import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import errorImage from '../../../assets/imgs/common/error.png';
import IxButton from '../../basic/ix-button';
import { Typography } from '@material-ui/core';
import StaticBottom from '../../basic/ix-static-bottom-nav';
import errorCodeEnum from '../../../constants/error-code-enum';
import { unAuthenticateApp } from '../../../services/utility';

const useStyles = makeStyles((theme) => ({
  thisRoot: {
    textAlign: 'center',
  },
  imgGrid: {
    //margin: '1.5em 1em',
  },
  img: {
    paddingTop: '1em',
    paddingBottom: '2em',
    width: '20em',
  },
  logo: {
    marginTop: '8em',
    width: '7em',
  },
  thisP: {
    marginBottom: '1.5em',
    padding: '0 1.5em',
    textAlign: 'center',
    color: theme.palette.border.commonSecondaryColor,
    fontSize: '0.85em',
  },
  thish2: {
    marginBottom: '0em',
    marginTop: '0.5em',
    color: theme.palette.border.secondary,
  },
  thisClickText: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
    color: '#297fca',
  },
  thisLink: {
    textDecoration: 'none',
    color: '#297fca',
  },
  btnManually: {
    height: '3.2em',
  },

  thisButton: {
    padding: '1em 0',
    width: '100%',
    backgroundColor: '#3fa2f7',
    borderColor: '#3fa2f7',
    color: 'white',
  },
  thisOutlineButton: {
    padding: '1em 0',
    width: '100%',
    backgroundColor: '#ffffff',
    borderColor: '#3fa2f7',
    color: '#3fa2f7',
  },
  thisTop: {
    padding: '0 1em',
  },
  btnQrcode: {
    marginBottom: '1em',
  },
}));

function TableBookErrorView(props) {
  const classes = useStyles();
  const { t } = useTranslation(['scan']);
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState();
  const appState = useSelector((state) => state.appState);
  const { session, restaurantTable, companyConfig } = appState;

  useEffect(() => {
    let errors = session.error || restaurantTable.error || companyConfig.error;
    // session error gets highest priority, if present, others ignored. and such is the others

    const handleSetErrorMessage = () => {
      if (errors) {
        if (typeof errors === 'object') {
          if (errors.message === 'Network Error') {
            setErrorMessage(t('scan:netWorkErrorMessage'));
            return;
          }
          errors = [errors];
        }

        errors.map((error) => {
          const { code } = error;
          if (code === errorCodeEnum.NOT_ALLOWED) {
            setErrorMessage(t('scan:tableOccupiedMessage'));
          } else if (code === errorCodeEnum.RESOURCE_NOT_FOUND) {
            setErrorMessage(t('scan:tableNotFoundMessage'));
          } else {
            setErrorMessage(t('scan:tableSessionFailGenericMsg'));
          }
          return null;
        });
      } else {
        // setErrorMessage(t('scan:tableSessionFailGenericMsg'));
      }
      dispatch(unAuthenticateApp());
    };
    handleSetErrorMessage();
  }, [session, restaurantTable, companyConfig, dispatch, t]);

  return (
    <div className={classes.thisRoot}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid className={classes.imgGrid} item xs={12}>
          <img className={classes.logo} src={errorImage} alt="error icon" />
        </Grid>
        <Grid className="scan-title" item xs={12}>
          <Typography variant="h4">{errorMessage || 'Something went wrong!'}</Typography>
        </Grid>
        <StaticBottom>
          <IxButton
            onClick={() => {
              window.close();
            }}
            className={classes.btnManually}
            variant="contained"
            fullWidth
            color="primary"
          >
            {t('orderr:Checkout')}
          </IxButton>
        </StaticBottom>
      </Grid>
    </div>
  );
}

export default TableBookErrorView;

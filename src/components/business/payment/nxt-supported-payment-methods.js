import React from 'react';
import { makeStyles } from '@material-ui/styles';

import { useTranslation } from 'react-i18next';
import { Paper } from '@material-ui/core';
import PaymentIcons from '../../../assets/imgs/payment-icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  methodsWrapper: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    '& img': {
      width: '50px',
      height: '35px',
    },
  },
  item: {
    backgroundColor: '#f1f1f1',
    padding: '10px 10px',
    borderRadius: '5px',
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

function SupportedPaymentMethods(props) {
  const { t } = useTranslation(['common']);
  const { paymentMethods } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.title}>{t('SupportedPaymentMethods')}</div>
      <div className={classes.methodsWrapper}>
        {paymentMethods.map((paymentMethod, index) => {
          return (
            <React.Fragment key={paymentMethod.id}>
              <div className={classes.item}>
                {PaymentIcons[paymentMethod.name] != null ? (
                  <Paper className={classes.paper}>
                    <img src={PaymentIcons[paymentMethod.name]} alt={paymentMethod.name} />
                  </Paper>
                ) : null}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default SupportedPaymentMethods;

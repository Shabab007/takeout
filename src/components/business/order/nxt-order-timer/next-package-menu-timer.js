// Displays countdown timer for every package menu

import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { minuteToMilliSecond } from '../../../../services/utility';
import NxtTimer from '../../../basic/nxt-timer';
const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(1.3),
    paddingRight: theme.spacing(1),
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  label: { marginRight: theme.spacing(1) },
  time: {},
}));

function NextPackageMenuTimer() {
  const classes = useStyles();
  const cart = useSelector((state) => state.cart);
  const { orderedPackageMenus } = cart;
  const { code: languageCode } = useSelector((state) => state.language);

  const { t } = useTranslation();

  if (!cart.order) {
    return null;
  }

  const nowTimeStamp = new Date().getTime();
  const checkIfPositive = (value) => (value >= 0 ? value : 0);

  return (
    <div className={classes.root}>
      {orderedPackageMenus.map((packageMenu) => {
        const {
          name,
          timeBoundDuration,
          // lastTimeToOrder,
          packageStartTime,
          id,
        } = packageMenu;
        return (
          <div className={classes.row} key={id}>
            {name && (
              <Typography className={classes.label} variant="body2">
                {typeof name === 'string'
                  ? name
                  : name[languageCode] + ' ' + t('menus:TimeLeft')}
              </Typography>
            )}

            <Typography className={classes.timer} variant="body2">
              <NxtTimer
                initialTime={checkIfPositive(
                  packageStartTime +
                    minuteToMilliSecond(timeBoundDuration) -
                    nowTimeStamp,
                )}
                direction={'backward'}
              ></NxtTimer>
            </Typography>
          </div>
        );
      })}
    </div>
  );
}

export default NextPackageMenuTimer;

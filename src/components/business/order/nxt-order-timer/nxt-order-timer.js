import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import IxCountDown from '../../../basic/ix-count-down';
import { minuteToMilliSecond } from '../../../../services/utility';
import {
  ALL_YOU_CAN_EAT,
  ALL_YOU_CAN_DRINK,
} from '../../../../constants/order-status';

const useStyles = makeStyles((theme) => ({
  packageMenuTimerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  countUpTimer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    color: theme.palette.text.commonSecondaryColor,
    fontSize: '1.5em',
    display: 'flex',
    textAlign: 'center',
  },
  timerBoxWrapper: {
    width: '170px',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const NxtOrderTimer = ({ order }) => {
  const classes = useStyles();
  const { t } = useTranslation(['orderr']);
  const [
    timeBoundMaxDurationAllYouCanEat,
    setTimeBoundMaxDurationAllYouCanEat,
  ] = React.useState(0);
  const [
    reminderTimeAllYouCanEat,
    setReminderTimeAllYouCanEat,
  ] = React.useState(0);
  const [
    lastTimeToOrderAllYouCanEat,
    setLastTimeToOrderAllYouCanEat,
  ] = React.useState(0);

  const [
    timeBoundMaxDurationAllYouCanDrink,
    setTimeBoundMaxDurationAllYouCanDrink,
  ] = React.useState(0);
  const [
    reminderTimeAllYouCanDrink,
    setReminderTimeAllYouCanDrink,
  ] = React.useState(0);
  const [
    lastTimeToOrderAllYouCanDrink,
    setLastTimeToOrderAllYouCanDrink,
  ] = React.useState(0);

  const [
    isAllYouCanEatPresentInOrder,
    setIsAllYouCanEatPresentInOrder,
  ] = React.useState();
  const [
    isAllYouCanDrinkPresentInOrder,
    setIsAllYouCanDrinkPresentInOrder,
  ] = React.useState();

  React.useEffect(() => {
    if (order) {
      const checkForPackageMenu = (orderMenus) => {
        let isAllYouCanEatPresentInMenu = false,
          isAllYouCanDrinkPresentInMenu = false,
          timeBoundMaxDurationAllYouCanEat = 0,
          timeBoundMaxDurationAllYouCanDrink = 0;

        orderMenus.map((menu) => {
          if (menu.isPackage) {
            if (menu.menuType === ALL_YOU_CAN_EAT) {
              // eat
              isAllYouCanEatPresentInMenu = true;
              const { reminderTime, lastTimeToOrder, timeBoundDuration } = menu;
              setReminderTimeAllYouCanEat(reminderTime);
              setLastTimeToOrderAllYouCanEat(lastTimeToOrder);
              if (timeBoundDuration > timeBoundMaxDurationAllYouCanEat) {
                timeBoundMaxDurationAllYouCanEat = timeBoundDuration;
              }
            }

            if (menu.menuType === ALL_YOU_CAN_DRINK) {
              // drink
              isAllYouCanDrinkPresentInMenu = true;
              const { reminderTime, lastTimeToOrder, timeBoundDuration } = menu;
              setReminderTimeAllYouCanDrink(reminderTime);
              setLastTimeToOrderAllYouCanDrink(lastTimeToOrder);
              if (timeBoundDuration > timeBoundMaxDurationAllYouCanDrink) {
                timeBoundMaxDurationAllYouCanDrink = timeBoundDuration;
              }
            }
          }
          return menu;
        });

        setTimeBoundMaxDurationAllYouCanEat(timeBoundMaxDurationAllYouCanEat);
        setTimeBoundMaxDurationAllYouCanDrink(
          timeBoundMaxDurationAllYouCanDrink,
        );
        setIsAllYouCanEatPresentInOrder(isAllYouCanEatPresentInMenu);
        setIsAllYouCanDrinkPresentInOrder(isAllYouCanDrinkPresentInMenu);
      };

      if (order.orderMenus) {
        checkForPackageMenu(order.orderMenus);
      }
    }
  }, [order]);

  const pageLoadTimeStamp = new Date().getTime();

  const { packageStartTime } = order;
  // remaining time in milisecond
  let packageMenuRemainingTimeAllYouCanEat =
    packageStartTime +
    minuteToMilliSecond(timeBoundMaxDurationAllYouCanEat) -
    pageLoadTimeStamp;
  let lastTimeToOrderTimeStampAllYouCanEat =
    packageStartTime + minuteToMilliSecond(lastTimeToOrderAllYouCanEat);
  let reminderTimeStampAllYouCanEat =
    packageStartTime + minuteToMilliSecond(reminderTimeAllYouCanEat);

  if (packageMenuRemainingTimeAllYouCanEat <= 0) {
    packageMenuRemainingTimeAllYouCanEat = 0;
  }

  let packageMenuRemainingTimeAllYouCanDrink =
    packageStartTime +
    minuteToMilliSecond(timeBoundMaxDurationAllYouCanDrink) -
    pageLoadTimeStamp;
  let lastTimeToOrderTimeStampAllYouCanDrink =
    packageStartTime + minuteToMilliSecond(lastTimeToOrderAllYouCanDrink);
  let reminderTimeStampAllYouCanDrink =
    packageStartTime + minuteToMilliSecond(reminderTimeAllYouCanDrink);

  if (packageMenuRemainingTimeAllYouCanDrink <= 0) {
    packageMenuRemainingTimeAllYouCanDrink = 0;
  }

  return (
    <Grid className={classes.packageMenuTimerWrapper}>
      {order && isAllYouCanEatPresentInOrder && (
        <div className={classes.timerBoxWrapper}>
          <IxCountDown
            primaryText={t('common:AllYouCanEatTimerLabel')}
            packageMenuRemainingTime={packageMenuRemainingTimeAllYouCanEat}
            packageMenuTimeBoundDuration={minuteToMilliSecond(
              timeBoundMaxDurationAllYouCanEat,
            )}
            pageLoadTimeStamp={pageLoadTimeStamp}
            lastTimeToOrderTimeStamp={lastTimeToOrderTimeStampAllYouCanEat}
            reminderTimeStamp={reminderTimeStampAllYouCanEat}
          ></IxCountDown>
        </div>
      )}
      {order && isAllYouCanDrinkPresentInOrder && (
        <div className={classes.timerBoxWrapper}>
          <IxCountDown
            primaryText={t('common:AllYouCanDrinkTimerLabel')}
            packageMenuRemainingTime={packageMenuRemainingTimeAllYouCanDrink}
            packageMenuTimeBoundDuration={minuteToMilliSecond(
              timeBoundMaxDurationAllYouCanDrink,
            )}
            pageLoadTimeStamp={pageLoadTimeStamp}
            lastTimeToOrderTimeStamp={lastTimeToOrderTimeStampAllYouCanDrink}
            reminderTimeStamp={reminderTimeStampAllYouCanDrink}
          ></IxCountDown>
        </div>
      )}
    </Grid>
  );
};

export default NxtOrderTimer;

// {
//   const timeElapsedFromOrder = pageLoadTimeStamp - packageStartTime;
//   return (
//     <Grid className={classes.countUpTimer} container justify="center" item direction="row">
//       <NxtTimer initialTime={timeElapsedFromOrder >= 0 ? timeElapsedFromOrder : 0} direction="forward"></NxtTimer>
//     </Grid>
//   );
// }

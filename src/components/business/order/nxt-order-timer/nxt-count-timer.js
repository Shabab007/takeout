import React from 'react';
import IxCountDown from '../../../basic/ix-count-down';
import IxCountUp from '../../../basic/ix-count-up';
// import { timeStampToCalculationHourMinSec } from '../../../basic/ix-count-time-create';
import { timeCreator } from '../../../basic/ix-count-time-create';
import moment from 'moment';

function CountTimer({ order }) {
  const presentTime = new Date();
  const { orderStartTime: orderStartTimeStamp, orderMenus } = order;

  // const remainingTime = timeStampToCalculationHourMinSec(orderStartTimeStamp);
  // const countDownTime = timeStampToCountDown(orderEndTime);

  let timeElapsedInSeconds = 0,
    totalMins = 0,
    countDownHours = 0,
    countDownMins = 0,
    countDownSecs = 0;

  const orderItemsIsPackageTrue = (orderMenus) => {
    let isTrue = false;
    orderMenus.map((item) => {
      if (item.isPackage === true) {
        isTrue = true;
      }
      return null;
    });
    return isTrue;
  };

  const countTimeBound = (orderMenus) => {
    let timeBoundMax = 0;
    if (orderMenus && orderMenus.length) {
      orderMenus.map((item) => {
        if (item.timeBoundDuration > timeBoundMax) {
          timeBoundMax = item.timeBoundDuration;
        }
        return null;
      });
    }
    return timeBoundMax;
  };

  if (orderStartTimeStamp) {
    let orderStartTime = new Date(orderStartTimeStamp);
    // let ms = moment(presentTime, 'DD/MM/YYYY HH:mm:ss').diff(moment(orderStartTime, 'DD/MM/YYYY HH:mm:ss'));
    // let d = moment.duration(ms);
    let timeDiffBetweenOrderAndNow = moment
      .utc(moment(presentTime, 'DD/MM/YYYY HH:mm:ss').diff(moment(orderStartTime, 'DD/MM/YYYY HH:mm:ss')))
      .format('HH:mm:ss');

    let a = timeDiffBetweenOrderAndNow.split(':'); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    let hourToSec = Math.floor(a[0] * 60 * 60);
    let minToSec = Math.floor(a[1] * 60);
    let secToSec = Math.floor(a[2]);

    totalMins = Math.floor(timeElapsedInSeconds / 60);
    timeElapsedInSeconds = hourToSec + minToSec + secToSec;
  }

  let timeBound = countTimeBound(orderMenus);
  let leftTime = timeBound - totalMins;
  if (leftTime > 0) {
    let tt = moment(leftTime).format('HH:mm:ss');
    let b = tt.split(':'); // split it at the colons
    countDownHours = b[0].substr(-1);
    countDownMins = b[1];
    countDownSecs = b[2];
  }

  // const hour = remainingTime.hours,
  //   minute = remainingTime.mins,
  //   second = remainingTime.secs;

  const wwwTime = timeCreator(Number(countDownHours), Number(countDownMins), Number(countDownSecs));
  const countUp = <IxCountUp initialTime={timeElapsedInSeconds}></IxCountUp>;

  const countDown = (
    <IxCountDown
      hour={Number(countDownHours)}
      minute={Number(countDownMins)}
      second={Number(countDownSecs)}
      wwwTime={wwwTime}
    ></IxCountDown>
  );

  let hasPackageItems = orderItemsIsPackageTrue(orderMenus);

  return <div>{hasPackageItems ? countDown : countUp}</div>;
}

export default CountTimer;

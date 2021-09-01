export const timeCreator = (hour, minute, second) => {
  const readyTime = new Date();

  const newHour = readyTime.getHours() + hour;
  const newMin = readyTime.getMinutes() + minute;
  const newSec = readyTime.getSeconds() + second;

  readyTime.setMinutes(newMin);
  readyTime.setHours(newHour);
  readyTime.setSeconds(newSec);

  const gottenTime =
    readyTime.getFullYear() +
    '-' +
    ('0' + (readyTime.getUTCMonth() + 1)).slice(-2) +
    '-' +
    readyTime.getDate() +
    ' ' +
    readyTime.getHours() +
    ':' +
    readyTime.getMinutes() +
    ':' +
    readyTime.getSeconds();

  return gottenTime;
};

export const timeStampToCalculationHourMinSec = (timestamp) => {
  //let date = new Date(timestamp);
  let date = new Date(timestamp); // 1593575352854
  let readyTime = new Date();

  if (readyTime > date) {
    let hours = date.getHours();
    let minutes = '0' + date.getMinutes();
    let seconds = '0' + date.getSeconds();

    let presentHours = readyTime.getHours();
    let presentMins = '0' + readyTime.getMinutes();
    let presentSecs = '0' + readyTime.getSeconds();

    let presentAllHoursInMins = presentHours * 60;
    let presentAllHourToSec = presentAllHoursInMins * 60;
    let presentAllMinsToSec = Number(presentMins) * 60;
    let presentSec = presentAllMinsToSec + presentAllHourToSec + seconds;

    let oldAllHoursInMins = hours * 60;
    let oldAllHoursInSec = oldAllHoursInMins * 60;
    let oldllMinsToSec = Number(minutes) * 60;
    let oldSec = oldAllHoursInSec + oldllMinsToSec + seconds;

    let secs = presentSec - oldSec;

    // let PresentFormattedTime =
    //   presentHours +
    //   ':' +
    //   presentMins.substr(-2) +
    //   ':' +
    //   presentSecs.substr(-2);

    let substractHours = presentHours - hours;
    let substractMins = presentMins - minutes;
    let substractSecs = presentSecs;

    return {
      hours: substractHours,
      mins: substractMins,
      secs: substractSecs,
      totalSec: secs,
    };
  } else {
    return {
      hours: 0,
      mins: 0,
      secs: 0,
      totalSec: 0,
    };
  }
};

export const timeStampToCountDown = (timestamp) => {
  let endTime = new Date(timestamp);
  let presentDate = new Date();
  let hours, mins, secs;
  if (endTime <= presentDate) {
    hours = 0;
    mins = 0;
    secs = 0;
  } else {
    let endHours = endTime.getHours();
    let endMinutes = '0' + endTime.getMinutes();
    let endSeconds = '0' + endTime.getSeconds();

    let presentHours = presentDate.getHours();
    let presentMins = '0' + presentDate.getMinutes();
    let presentSecs = '0' + presentDate.getSeconds();

    hours = presentHours - endHours;
    mins = presentMins - endMinutes;
    secs = presentSecs - endSeconds;
  }

  return {
    hours: hours,
    mins: mins,
    secs: secs,
  };
};

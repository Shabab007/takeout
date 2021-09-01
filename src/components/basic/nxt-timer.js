import React from 'react';
import Timer from 'react-compound-timer';

const NxtTimer = ({
  initialTime,
  direction,
  showHours = true,
  showMins = true,
  showSecs = true,
  //   showMiliSec = true,
}) => {
  const initialPadWithZero = (num) => {
    if (num < 10) {
      return '0' + num.toString();
    } else {
      return num.toString();
    }
  };

  return (
    <Timer initialTime={initialTime} direction={direction}>
      {showHours && <Timer.Hours formatValue={(value) => initialPadWithZero(value)} />}
      {showHours && showMins ? ':' : ''}
      {showMins && <Timer.Minutes formatValue={(value) => initialPadWithZero(value)} />}
      {(showHours || showMins) && showSecs ? ':' : ''}
      {showSecs && <Timer.Seconds formatValue={(value) => initialPadWithZero(value)} />}
      {/* {showMiliSec && <Timer.Milliseconds formatValue={(value) => initialPadWithZero(value)} />} */}
    </Timer>
  );
};

export default NxtTimer;

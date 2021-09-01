// Timer library used https://www.npmjs.com/package/react-compound-timer
//https://www.npmjs.com/package/react-moment

import React from 'react';
import Timer from 'react-compound-timer';

function TimerUp({ initialTime }) {
  return (
    <div className="timer">
      <Timer initialTime={initialTime * 1000} direction="forward">
        {() => (
          <React.Fragment>
            <Timer.Hours /> :
            <Timer.Minutes /> :
            <Timer.Seconds />
          </React.Fragment>
        )}
      </Timer>
    </div>
  );
}

export default TimerUp;

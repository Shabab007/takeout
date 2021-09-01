import React, { useEffect, useState } from 'react';

function TimerDown({ waitingTime }) {
  const calculateTimeLeft = () => {
    let difference = +new Date(waitingTime) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        ' : ': Math.floor(difference / (1000 * 60 * 60 * 24)),
        ': ': Math.floor((difference / (1000 * 60 * 60)) % 24),
        ':': Math.floor((difference / 1000 / 60) % 60),
        '': Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {interval}{' '}
      </span>
    );
  });

  return <div>{timerComponents.length ? timerComponents : '00:00'}</div>;
}

export default TimerDown;

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import NxtTimer from './nxt-timer';

const useStyles = makeStyles((theme) => ({
  roundTimerRoot: {
    display: 'block',
    position: 'relative',
    width: '120px !important',
    height: '120px !important',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    '& .MuiCircularProgress-root': {
      display: 'block',
      width: '100% !important',
      height: '100% !important',
    },
  },
  progressText: {
    position: 'absolute',
    top: '3em',
    left: '19%',
  },
  secondaryText: {
    fontSize: '8px',
    color: 'blue',
    opacity: '0.5',
    margin: '0',
  },
  primaryText: {
    fontSize: '10px',
    color: 'blue',
    fontWeight: 'bold',
    marginTop: '-0.4em',
  },
  remaining: {
    textAlign: 'center',
    fontSize: '1em',
    color: 'blue',
    fontWeight: 'bold',
    paddingLeft: '0.5em',
  },
  secondaryCircleWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  secondaryCircle: {
    opacity: '0.1',
  },
  lastTimeToOrderPassed: {
    color: '#000000',
    opacity: 1,
  },
}));

function IxCountDown({
  packageMenuRemainingTime,
  packageMenuTimeBoundDuration,
  lastTimeToOrderTimeStamp,
  reminderTimeStamp,
  primaryText,
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [completed, setCompleted] = React.useState();
  const [showReminder, setShowReminder] = React.useState(false);
  const [lastTimeToOrderPassed, setLastTimeToOrderPassed] = React.useState(false);

  React.useEffect(() => {
    let progress;
    if (packageMenuRemainingTime <= 0) {
      progress = 100;
    } else {
      progress = ((packageMenuTimeBoundDuration - packageMenuRemainingTime) / packageMenuTimeBoundDuration) * 100;
    }
    setCompleted(progress);

    const timer = setInterval(() => {
      setCompleted((completed) => {
        if (completed < 100) {
          return completed + 1 / 60;
        } else {
          return 100;
        }
      });
      const currentTimeStamp = new Date().getTime();
      if (currentTimeStamp > reminderTimeStamp && currentTimeStamp < lastTimeToOrderTimeStamp) {
        setShowReminder(true);
      } else {
        setShowReminder(false);
      }
      if (currentTimeStamp > lastTimeToOrderTimeStamp) {
        setLastTimeToOrderPassed(true);
      }
    }, 1000); // updates every one second

    return () => {
      clearInterval(timer);
    };
  }, [lastTimeToOrderTimeStamp, packageMenuRemainingTime, packageMenuTimeBoundDuration, reminderTimeStamp]);

  return (
    <>
      <div className={classes.roundTimerRoot}>
        <Typography className={classes.progressText} variant="caption" display="block" gutterBottom>
          <Typography className={classes.secondaryText} variant="caption" display="block" gutterBottom>
            {t('countDownSecondaryText')}
          </Typography>
          <Typography className={classes.primaryText} variant="caption" display="block" gutterBottom>
            {primaryText}
          </Typography>
          <Typography className={classes.remaining} variant="caption" display="block" gutterBottom>
            {/* <TimerDown hours={hour} minutes={minute} seconds={second} waitingTime={wwwTime}></TimerDown> */}
            <NxtTimer initialTime={packageMenuRemainingTime} direction="backward" showSecs={false}></NxtTimer>
          </Typography>
        </Typography>

        <div className={classes.secondaryCircleWrapper}>
          <CircularProgress
            className={showReminder ? 'package-order-reminder' : classes.secondaryCircle}
            // className={clsx(
            //   !showReminder && !lastTimeToOrderPassed && classes.secondaryCircle,
            //   showReminder && !lastTimeToOrderPassed && 'package-order-reminder',
            //   lastTimeToOrderPassed && classes.lastTimeToOrderPassed
            // )}
            thickness={1.5}
            variant="static"
            value={100}
          />
        </div>

        <CircularProgress
          thickness={1.5}
          variant="static"
          value={completed}
          className={lastTimeToOrderPassed ? classes.lastTimeToOrderPassed : ''}
        />
      </div>

      <div>
        {showReminder && (
          <Typography variant="body2" align="center">
            {t('orderr:packageMenuOrderCountDownPrefix') + ' '}
            <NxtTimer
              initialTime={lastTimeToOrderTimeStamp - new Date().getTime()}
              direction="backward"
              showHours={false}
              showSecs={false}
            ></NxtTimer>
            {' ' + t('orderr:packageMenuOrderCountDownSuffix')}
          </Typography>
        )}
      </div>
    </>
  );
}

export default IxCountDown;

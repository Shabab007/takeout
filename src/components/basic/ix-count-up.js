import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import TimerUp from './ix-timer-up';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  processCircularStyle: {
    position: 'relative',
    '& .MuiCircularProgress-root': {
      width: '120px !important',
      height: '120px !important',
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
    fontSize: '1em',
    color: 'blue',
    fontWeight: 'bold',
    paddingLeft: '0.5em',
  },
  secondaryCircle: {
    position: 'absolute',
    opacity: '0.1',
  },
}));

function IxCountUp({ initialTime }) {
  const classes = useStyles();

  return (
    <div className={classes.processCircularStyle + ' countUp'}>
      <Typography className={classes.progressText} variant="caption" display="block" gutterBottom>
        <Typography className={classes.remaining} variant="caption" display="block" gutterBottom>
          <TimerUp initialTime={initialTime}></TimerUp>
        </Typography>
      </Typography>
    </div>
  );
}

export default IxCountUp;

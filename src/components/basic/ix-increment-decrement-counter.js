import React from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: '3px',
    background: 'white',
  },
  buttonRoot: {
    minWidth: '32px',
    paddingTop: '0',
    paddingBottom: '0',
  },
}));

const IxIncrementDecrementCounter = ({
  count,
  operatorOne = '-',
  operatorTwo = '+',
  handleCount = () => {},
  countVariant = 'h6',
  countColor = 'textPrimary',
  buttonColor = 'primary',
  buttonIconSize = 'small',
  buttonOneDisabled = false,
  buttonTwoDisabled = false,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Button
        onClick={() => {
          handleCount(operatorOne);
        }}
        className={classes.buttonRoot}
        color={buttonColor}
        disabled={buttonOneDisabled}
      >
        <RemoveIcon fontSize={buttonIconSize} />
      </Button>
      <Typography variant={countVariant} color={countColor}>
        {count}
      </Typography>
      <Button
        onClick={() => {
          handleCount(operatorTwo);
        }}
        className={classes.buttonRoot}
        color={buttonColor}
        disabled={buttonTwoDisabled}
      >
        <AddIcon fontSize={buttonIconSize} />
      </Button>
    </div>
  );
};

export default IxIncrementDecrementCounter;

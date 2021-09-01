import React from 'react';
import { FormControlLabel, Checkbox, Typography, Box } from '@material-ui/core';

import { makeStyles } from '@material-ui/core';
import IxIncrementDecrementCounter from '../../basic/ix-increment-decrement-counter';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    paddingLeft: theme.spacing(1),
  },
  icon: {
    color: theme.palette.text.commonSecondaryColor,
    width: '1.25rem',
    height: '1.25rem',
  },
}));

const StaffCallOptionView = ({
  label,
  checked,
  name,
  value,
  handleChange,
  controlColor = 'primary',
  icon,
  count,
  operatorSubtract,
  operatorAddition,
  handleStaffCallOptionQuantityChange,
}) => {
  const classes = useStyles();

  const iconLabelElement = (
    <Box className={classes.labelWrapper}>
      <img src={icon} alt="icon" className={classes.icon} />
      <Typography className={classes.label}>{label}</Typography>
    </Box>
  );

  return (
    <Box className={classes.root}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            name={name}
            value={value}
            onChange={handleChange}
            color={controlColor}
          />
        }
        label={iconLabelElement}
      />
      {checked && (
        <IxIncrementDecrementCounter
          className={classes.countButton}
          operatorOne={operatorSubtract}
          operatorTwo={operatorAddition}
          count={count}
          handleCount={handleStaffCallOptionQuantityChange}
          //   buttonOneDisabled={bundleCount <= minimumFoodItemCount}
        />
      )}
    </Box>
  );
};

export default StaffCallOptionView;

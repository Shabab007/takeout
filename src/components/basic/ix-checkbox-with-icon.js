import React from 'react';
import { FormControlLabel, Checkbox, Typography, Box } from '@material-ui/core';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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

const IxCheckboxWithIcon = ({
  label,
  checked,
  name,
  value,
  handleChange,
  controlColor = 'primary',
  icon,
}) => {
  const classes = useStyles();

  const iconLabelElement = (
    <Box className={classes.labelWrapper}>
      <img src={icon} alt="icon" className={classes.icon} />
      <Typography className={classes.label}>{label}</Typography>
    </Box>
  );

  return (
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
  );
};

export default IxCheckboxWithIcon;

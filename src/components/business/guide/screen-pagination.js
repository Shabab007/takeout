import React from 'react';
import { RadioGroup, FormControlLabel, Radio, makeStyles } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';

const useStyles = makeStyles((theme) => ({
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    '& .MuiFormControlLabel-root': {
      marginRight: 0,
    },
  },
}));

function StyledRadio(props) {
  return (
    <Radio
      color="primary"
      checkedIcon={<FiberManualRecordIcon color="primary" fontSize="small" />}
      icon={<FiberManualRecordOutlinedIcon color="primary" fontSize="small" />}
      {...props}
    />
  );
}

const ScreenPagination = ({ values, value, handleChange }) => {
  const classes = useStyles();
  return (
    <RadioGroup
      className={classes.radioGroup}
      value={value}
      onChange={(event) => {
        handleChange(Number(event.target.value));
      }}
    >
      {values.map((value) => {
        return <FormControlLabel key={value} value={value} control={<StyledRadio />} />;
      })}
    </RadioGroup>
  );
};

export default ScreenPagination;

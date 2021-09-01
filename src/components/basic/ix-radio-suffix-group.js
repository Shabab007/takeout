import React from 'react';
import IxRadioSuffix from './ix-radio-suffix';
import { makeStyles, RadioGroup } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    width: '100%',
    padding: 0,
    margin: 0,
  },
}));

// params:
// name, onChange, items {label, value, suffix}
const IxRadioSuffixGroup = ({ name, value, onChange = () => {}, items }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <RadioGroup
        name={name}
        value={value}
        onChange={onChange}
        aria-label={name}
      >
        {items.map((item, index) => (
          <IxRadioSuffix
            key={index}
            label={item.label}
            value={item.value}
            suffix={item.suffix}
          ></IxRadioSuffix>
        ))}
      </RadioGroup>
    </div>
  );
};

export default IxRadioSuffixGroup;

import React from 'react';
import IxCheckBoxSuffix from './ix-check-box-suffix';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'block',
    width: '100%',
    padding: 0,
    margin: 0,
  },
}));

const IxCheckBoxSuffixGroup = ({ items, onChange = () => {} }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {items.map((item, index) => (
        <IxCheckBoxSuffix
          key={index}
          name={item.name}
          value={item.value}
          label={item.label}
          checked={item.checked}
          handleChange={onChange}
          suffix={item.suffix}
        ></IxCheckBoxSuffix>
      ))}
    </div>
  );
};

export default IxCheckBoxSuffixGroup;

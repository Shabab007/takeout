import React from 'react';
import { ButtonGroup, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const IxIncrementDecrement = ({
  className,
  operatorOne = '-',
  operatorTwo = '+',
  handleCount = () => {},
}) => {
  return (
    <div className={className}>
      <ButtonGroup
        variant="outlined"
        color="primary"
        aria-label="outlined increment decrement button group"
      >
        <Button
          onClick={() => {
            handleCount(operatorOne);
          }}
        >
          <RemoveIcon fontSize="small" />
        </Button>
        <Button
          onClick={() => {
            handleCount(operatorTwo);
          }}
        >
          <AddIcon fontSize="small" />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default IxIncrementDecrement;

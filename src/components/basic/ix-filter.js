import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& button': {
      marginRight: '0.5rem',
    },
    '& .MuiToggleButtonGroup-root': {
      // backgroundColor: 'white',
    },
  },
  filterDropdown: {
    '& .MuiInputLabel-shrink': {
      display: 'none',
    },
    '& .MuiInputLabel-filled': {
      transform: 'translate(12px, 10px) scale(1)',
    },
    '& .MuiFilledInput-input': {
      padding: '6px 18px 7px',
    },
    '& .MuiSelect-iconFilled': {
      right: '0px',
    },
  },
}));

const useFilterButtonStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: 'white',

    '& .MuiButtonBase-root': {
      height: '25px',
      padding: '3px 8px',
      fontSize: '0.7em',
      borderRadius: '3px',
      marginLeft: '0.1rem !important',
      border: '1px solid rgba(0, 0, 0, 0.12)',
      textTransform: 'capitalize',
    },
  },
}));

const IxFilter = ({ filterItems, selectedFilterItem, handleFilterChange }) => {
  const handleOnChange = (event, value) => {
    handleFilterChange(value);
  };

  const classes = useStyles();
  const filterButtonClasses = useFilterButtonStyles();
  return (
    <div className={classes.root}>
      <ToggleButtonGroup
        exclusive
        classes={filterButtonClasses}
        value={selectedFilterItem}
        onChange={handleOnChange}
      >
        {filterItems &&
          filterItems.length &&
          filterItems.map((filterItem, index) => {
            return (
              <ToggleButton
                classes={filterButtonClasses}
                key={index}
                variant="contained"
                color="default"
                value={filterItem.value}
              >
                {filterItem.label}
              </ToggleButton>
            );
          })}
      </ToggleButtonGroup>
    </div>
  );
};

export default IxFilter;

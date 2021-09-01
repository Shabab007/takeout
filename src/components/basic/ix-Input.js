import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import { theme } from '../../utils/themes';
import { MenuItem } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    '& .MuiFormHelperText-root': {
      color: theme.palette.text.errorMeg,
    },
  },
}));

const IxInput = ({
  isRrequired = false,
  isSelect = false,
  options = [],
  variant = 'outlined',
  id,
  label,
  placeholder,
  type = 'text',
  defaultValue,
  adornment,
  onChangeTextField,
  isError,
  className,
  multiline = false,
  rows = 0,
  helperText = '',
  disabled = false,
}) => {
  const classes = useStyles();
  const [text, setText] = useState('');
  useEffect(() => {
    if (defaultValue) {
      setText(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setText(newValue);
    if (onChangeTextField) {
      onChangeTextField(newValue);
    }
  };
  return (
    <div className={className}>
      <TextField
        className={classes.root}
        type={type}
        select={isSelect}
        placeholder={placeholder}
        id={id}
        label={label}
        variant={variant}
        onChange={handleChange}
        InputProps={
          adornment && {
            endAdornment: <InputAdornment position="end">{adornment}</InputAdornment>,
          }
        }
        InputLabelProps={{
          shrink: true,
        }}
        value={text}
        error={isError}
        required={isRrequired}
        multiline={multiline}
        rows={rows}
        helperText={helperText}
        disabled={disabled}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default IxInput;

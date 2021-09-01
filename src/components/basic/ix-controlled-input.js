import React from 'react';
import TextField from '@material-ui/core/TextField';
// import InputAdornment from '@material-ui/core/InputAdornment';
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

const IxControlledInput = ({
  isRrequired = false,
  isSelect = false,
  options = [],
  variant = 'outlined',
  id,
  label,
  placeholder,
  type = 'text',
  adornment,
  isError,
  className,
  multiline = false,
  rows = 0,
  helperText = '',
  disabled = false,
  value,
  onChange,
  InputProps,
}) => {
  const classes = useStyles();

  const handleChange = (event) => {
    const newValue = event.target.value;
    if (typeof onChange == 'function') {
      onChange(newValue);
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
          InputProps
          // {endAdornment: <InputAdornment position="end">{adornment}</InputAdornment>},
        }
        InputLabelProps={{
          shrink: true,
        }}
        value={value}
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

export default IxControlledInput;

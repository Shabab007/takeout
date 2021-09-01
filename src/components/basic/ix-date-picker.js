import React from 'react';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TodayOutlinedIcon from '@material-ui/icons/TodayOutlined';
import { InputAdornment } from '@material-ui/core';

const IxDatePicker = ({
  id = '',
  label = '',
  placeholder = '',
  format,
  openTo = 'year',
  value = null,
  onChange = () => {},
  disableToolbar = false,
  className,
  okLabel,
  cancelLabel,
  locale,
}) => {
  const handleChange = (newDate) => {
    onChange(newDate);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
      <DatePicker
        className={className}
        disableToolbar={disableToolbar}
        inputVariant="outlined"
        id={id}
        label={label}
        placeholder={placeholder}
        format={format}
        value={value}
        onChange={handleChange}
        animateYearScrolling={true}
        autoOk={true}
        openTo={openTo}
        disableFuture={true}
        okLabel={okLabel}
        cancelLabel={cancelLabel}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {<TodayOutlinedIcon color="primary" />}
            </InputAdornment>
          ),
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default IxDatePicker;

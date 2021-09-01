import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormLabel from '@material-ui/core/FormLabel';
import IxFromHelper from './ix-form-helper';

const useStyles = makeStyles(theme => ({
  form: {
    '& .MuiFormLabel-root': {
      fontSize: '10px'
    },
    '& .MuiFormGroup-root': {
      flexDirection: 'column'
    },
    width: "100%",
    marginLeft: theme.spacing(1)
  }
}));

const IxRadioGroup = ({ input, label, meta: { touched, invalid, error }, children, ...rest }) => {
  const classes = useStyles();
  return (
    <FormControl error={touched && error} variant="outlined" className={classes.form}>
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <RadioGroup {...input} {...rest}>
        {children}
      </RadioGroup>
      {IxFromHelper({ touched, error })}
    </FormControl>
  )
}

export default IxRadioGroup
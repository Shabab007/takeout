import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { blueColor } from '../../constants/theme-colors';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const GreenCheckbox = withStyles({
  root: {
    color: blueColor,
    '&$checked': {
      color: blueColor,
    },
    '& .MuiFormControlLabel-root': {
      color: blueColor,
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
  text: {
    color: blueColor,
  },
}));

const IxCheckbox = ({ input, label, id, onChangeCheckbox }) => {
  const classes = useStyles();
  return (
    <div>
      <FormControlLabel
        className={classes.text}
        control={
          <GreenCheckbox
            id={id}
            checked={input.value ? true : false}
            onChange={input.onChange}
            name=""
          />
        }
        label={label}
      />
    </div>
  );
};
export default IxCheckbox;

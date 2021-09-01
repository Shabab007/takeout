import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { blueColor } from '../../constants/theme-colors';
import { fontDropdown } from '../../constants/theme-font-size';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  dropDownCom: {
    marginLeft: '2em',
    '& .MuiFormControl-root': {
      minWidth: '8em',
    },
    '& .MuiInputBase-root': {
      borderRadius: '25px',
      color: blueColor,
      height: '2em',
    },
    '& .MuiSelect-root': {
      background: '#ffff',
      borderBottom: 'none',
    },
    '& .MuiSelect-root:focus': {
      border: 'none',
    },

    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: blueColor,
      color: blueColor,
    },
    '& .MuiSvgIcon-root': {
      color: blueColor,
    },
    '& .MuiFormLabel-root': {
      color: blueColor,
      fontSize: fontDropdown,
      top: '-0.7em',
    },
    '& .MuiOutlinedInput-root:hover, .MuiOutlinedInput-notchedOutline ': {
      borderColor: blueColor,
    },
  },
  select: {
    '& .MuiFormControl-root': {
      color: blueColor,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function IxDropdown({ inputName, label, children, onChangeTextField }) {
  const classes = useStyles();
  return (
    <div className={classes.dropDownCom}>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="outlined-age-native-simple">Age</InputLabel>
        <Select
          native
          displayEmpty
          onChange={onChangeTextField}
          label={label}
          inputProps={{
            name: inputName,
            id: 'ix-dropdown',
          }}
        >
          {children}
        </Select>
      </FormControl>
    </div>
  );
}

export default IxDropdown;

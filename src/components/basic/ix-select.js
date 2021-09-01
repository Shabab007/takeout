import React from 'react';
import { blueColor, whiteBaseColor } from '../../constants/theme-colors';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0.2em',
    borderColor: blueColor,
    borderRadius: '1.5em',
    height: '2em',
    background: '#FFFFFF',
    '&:hover': {
      background: '#b9d5ee',
    },
    '& .Mui-selected': {
      background: '#FFFFFF',
    },
    '& .MuiToggleButton-root, .Mui-selected': {
      background: whiteBaseColor,
    },
  },
  text: {
    borderColor: blueColor,
    borderRadius: '1.5em',
    color: blueColor,
    fontSize: '10px',
  },
  label: {
    padding: '3px 15px',
    color: blueColor,
    fontSize: '10px',
    textTransform: 'capitalize',
  },
  selectbtn: {
    '& .Mui-selected:hover': {
      backgroundColor: whiteBaseColor,
    },
  },
}));

function IxSelectButton({ text }) {
  const classes = useStyles();
  const [alignment, setAlignment] = React.useState('left');
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const children = [
    <ToggleButton
      classes={{
        root: classes.root, // class name, e.g. `classes-nesting-root-x`
        label: classes.label, // class name, e.g. `classes-nesting-label-x`
      }}
      variant="outlined"
      color="secondary"
      key={1}
      value=""
    >
      {text}
    </ToggleButton>,
  ];

  return (
    <div>
      <ToggleButtonGroup className={classes.selectbtn} size="small" value={alignment} exclusive onChange={handleChange}>
        {children}
      </ToggleButtonGroup>
    </div>
  );
}

export default IxSelectButton;

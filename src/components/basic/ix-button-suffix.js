import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: 'left',
  },
  label: { textAlign: 'left' },
  endIcon: {
    position: 'absolute',
    right: '1rem',
  },
}));

const IxButtonSuffix = ({ children, classes = {}, ...otherProps }) => {
  let buttonClasses = useStyles();
  buttonClasses = { ...buttonClasses, ...classes };
  return (
    <Button {...otherProps} classes={buttonClasses}>
      {children}
    </Button>
  );
};

export default IxButtonSuffix;

//usage
// {
/* <IxButtonSuffix fullWidth={true} endIcon={'$0.75'}>
  Add to Cart
</IxButtonSuffix>; */
// }

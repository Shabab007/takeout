import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 'bold',
  },
}));

const IxTitle = ({ children, text, alignment, variant = 'h5', className, id }) => {
  const classes = useStyles();
  return (
    <Typography id={id} className={className || classes.title} variant={variant} align={alignment}>
      {children || text}
    </Typography>
  );
};

export default IxTitle;

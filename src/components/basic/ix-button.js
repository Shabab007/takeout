import React from 'react';
import { Button, makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  iconRoot: {
    marginLeft: theme.spacing(0.2),
    display: 'inline-block',
  },
  iconRootHidden: {
    // marginLeft: theme.spacing(0.2),
    visibility: 'hidden',
  },
}));

const IxButton = ({
  children,
  classes,
  size = 'medium',
  isLoading = false,
  type = '',
  variant,
  color = 'primary',
  fullWidth = false,
  className = '',
  onClick = () => {},
  disabled,
}) => {
  const classList = useStyles();
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className={className}
      classes={classes}
      type={type}
      variant={variant}
      size={size}
      color={color}
      fullWidth={fullWidth}
    >
      {children}{' '}
      {isLoading && (
        <CircularProgress
          classes={{ root: classList.iconRoot }}
          color={variant === 'contained' ? 'white' : color}
          size={10}
        ></CircularProgress>
      )}
    </Button>
  );
};

export default IxButton;

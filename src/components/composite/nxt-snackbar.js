import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  snackbarRoot: {
    zIndex: theme.zIndex.snackbar,
    width: '100%',
    backgroundColor: theme.palette.background.default,
    borderRadius: '4px',
  },
  alertRoot: {
    // border: `1px solid ${theme.palette.primary.main}`,
  },
  alertTitle: {
    color: theme.palette.text.primary,
    // overflow: 'hidden',
    // whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis',
  },
  alertMessage: {
    color: theme.palette.text.secondary,
    fontWeight: '400',
    display: 'block',
    width: '100%',
    // overflow: 'hidden',
    // whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis',
  },
  alertIcon: {
    // color: `${theme.palette.primary.main} !important`,
  },
  alertActionIcon: {
    alignItems: 'flex-start',
    color: theme.palette.text.secondary,
  },
}));

const NxtSnackbar = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { closeSnackbar } = useSnackbar();
  const handleDismiss = () => {
    closeSnackbar(props.id);
  };

  const {
    title,
    message,
    variant = 'outlined',
    severity = 'success',
    hideIconVariant,
  } = props.settings;

  return (
    <div className={classes.snackbarRoot} ref={ref}>
      <Alert
        elevation={6}
        variant={variant}
        severity={severity}
        classes={{
          root: classes.alertRoot,
          icon: classes.alertIcon,
          message: classes.alertMessage,
          action: classes.alertActionIcon,
        }}
        onClose={hideIconVariant ? null : () => handleDismiss()}
      >
        {title && (
          <AlertTitle classes={{ root: classes.alertTitle }}>
            {title}
          </AlertTitle>
        )}
        {message}
      </Alert>
    </div>
  );
});

export default NxtSnackbar;

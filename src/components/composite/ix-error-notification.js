import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { HIDE_ERROR } from '../../action-types/error-types';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function ErrorNotification(props) {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(true);
  const isOpen = useSelector((state) => state.error.isOpen);
  const error = useSelector((state) => state.error.error);
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    dispatch({ type: HIDE_ERROR });
    if (reason === 'clickaway') {
      return;
    }
    //setOpen(false);
  };

  return (
    <>
      {error && error.message && (
        <div className={classes.root}>
          <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {error.message}
            </Alert>
          </Snackbar>
        </div>
      )}
    </>
  );
}

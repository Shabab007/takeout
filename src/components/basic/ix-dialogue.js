import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IxButton from './ix-button';

function IxDialogue(props) {
  const {
    open,
    onClose = () => {},
    onOk = () => {},
    title,
    children,
    okText,
    isLoadingOkAction,
    cancelText,
    maxWidth,
    ...other
  } = props;

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onOk();
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth={maxWidth}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <IxButton autoFocus onClick={!isLoadingOkAction ? handleCancel : undefined} color="primary">
          {cancelText}
        </IxButton>
        <IxButton onClick={!isLoadingOkAction ? handleOk : undefined} color="primary" isLoading={isLoadingOkAction}>
          {okText}
        </IxButton>
      </DialogActions>
    </Dialog>
  );
}

export default IxDialogue;

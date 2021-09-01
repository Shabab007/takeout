import React from 'react';
import IconButton from '@material-ui/core/IconButton';

export default function IxIconButton({ className, children, ...others }) {
  return (
    <IconButton aria-label="nxt-icon-button" className={className} {...others}>
      {children}
    </IconButton>
  );
}

import React from 'react';
import { Grid, makeStyles, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import IxTxtBox from './ix-txt-box';
import IxIncrementDecrementCounter from './ix-increment-decrement-counter';

const useStyles = makeStyles((theme) => ({
  root: {
    boxSizing: 'border-box',
    paddingTop: '.5rem',
    paddingBottom: '.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  imageContainer: {
    '& > img': {
      width: '100%',
      height: 'auto',
    },
  },
  detailContainer: {
    position: 'relative',
  },
  titleContainer: {
    paddingLeft: '8px',
    marginBottom: '1rem',
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: theme.palette.text.secondary,
    '& :hover': {
      cursor: 'pointer',
    },
  },
}));

const NxtOrderItem = ({
  img,
  title,
  subtitle,
  count,
  handleCount,
  handleClose,
}) => {
  const classes = useStyles();
  return (
    <Grid container spacing={0} className={classes.root}>
      <Grid item xs={4} className={classes.imageContainer}>
        <img src={img} alt="ordered item" />
      </Grid>
      <Grid item xs={8}>
        <Grid container className={classes.detailContainer} spacing={0}>
          <Grid item xs={11} className={classes.titleContainer}>
            <IxTxtBox
              primary={title}
              primaryVariant="h6"
              secondary={subtitle}
              secondaryVariant="subtitle1"
              align="left"
            ></IxTxtBox>
          </Grid>
          <Grid item xs={11}>
            <IxIncrementDecrementCounter
              count={count}
              handleCount={handleCount}
            ></IxIncrementDecrementCounter>
          </Grid>
          <IconButton
            className={classes.closeIcon}
            onClick={handleClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NxtOrderItem;

import React from 'react';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import IxTitle from './ix-title';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: '3px',
    '& :hover': {
      cursor: 'pointer',
    },
  },
  disabled: {
    opacity: 0.5,
  },
  cardImage: {
    display: 'block',
    width: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '.2rem',
  },
  captionWrapper: {
    display: 'block',
    padding: '.2rem .5rem',
  },
  subtitleWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const NxtCard = ({
  size = 4,
  img,
  imgAlt,
  caption,
  captionAlign = 'center',
  captionVariant = 'subtitle1',
  subtitle1,
  subtitle2,
  disabled,
  onClick,
}) => {
  const classes = useStyles();
  return (
    <Grid item xs={size} className={classes.root} onClick={disabled ? undefined : onClick}>
      <img className={classes.cardImage} src={img} alt={imgAlt} />

      <div className={classes.captionWrapper}>
        <IxTitle align={captionAlign} variant={captionVariant}>
          {caption}
        </IxTitle>
        <div className={classes.subtitleWrapper}>
          <Typography variant="subtitle2" color="textSecondary">
            {subtitle1}
          </Typography>
          {/* <IxCurrency variant="h5">{subtitle2}</IxCurrency> */}
        </div>
      </div>
    </Grid>
  );
};

export default NxtCard;

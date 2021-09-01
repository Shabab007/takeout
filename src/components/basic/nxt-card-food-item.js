import React from 'react';
import { makeStyles, Grid, Typography, Box } from '@material-ui/core';
import IxTitle from './ix-title';
import NxtTxtApart from './nxt-text-apart';

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
    maxHeight: '4.5em',
    //marginBottom: '.2rem',
  },
  captionWrapper: {
    display: 'block',
    padding: '.2rem .5rem',
  },
  subtitleWrapper: {
    display: 'block',
    justifyContent: 'space-between',
    alignItems: 'left',
    marginLeft: '-0.5em',
  },
}));

function NxtFoodItemCard({
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
  tags,
  price,
}) {
  const classes = useStyles();
  return (
    <Grid item xs={size} className={classes.root} onClick={disabled ? undefined : onClick}>
      <img className={classes.cardImage} src={img} alt={imgAlt} />
      {/* <Box className="itemTg" component="span"> */}
      <div className={classes.captionWrapper + ' itemTg'}>
        <IxTitle align={captionAlign} variant={captionVariant}>
          {caption}
        </IxTitle>
        <div className={classes.subtitleWrapper}>
          <Typography variant="h6" color="textSecondary">
            {subtitle1}
          </Typography>
        </div>
        <Box component="span">
          <NxtTxtApart
            left={tags}
            right={price}
            leftVariant="subtitle2"
            rightVariant="h6"
            leftColor="textPrimary"
            rightColor="textPrimary"
          ></NxtTxtApart>
        </Box>
      </div>
      {/* </Box> */}
    </Grid>
  );
}

export default NxtFoodItemCard;

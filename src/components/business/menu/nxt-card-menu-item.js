import React from 'react';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import IxTitle from '../../basic/ix-title';
import RenderSmoothImage from '../../basic/nxt-render-smooth-image';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    position: 'relative',
    width: '100%',
    height: '100%'

    // marginRight: theme.spacing(1),
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    height: '100%',
    position: 'relative',
    border: `1px solid ${theme.palette.border.main}`,
    boxSizing: 'border-box',
    borderRadius: '10px',
    '& :hover': {
      cursor: 'pointer'
    },
    overflow: 'hidden'
  },
  disabled: {
    opacity: 0.5
  },
  cardImage: {
    //display: 'block',
    //objectFit: 'cover',
    width: '100%',
    //height: 'auto',
    //height: '75%',
    height: '300px',
    [theme.breakpoints.only("xs")]: {
      height: '100px'
    },
    [theme.breakpoints.only("sm")]: {
      height: '200px'
    },
    maxWidth: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px'
  },
  captionWrapper: {
    display: 'block',
    padding: '0 .5rem'
  },
  menuTitle: {
    textAlign: 'left',
    fontWeight: 500,
    fontSize: '0.9rem'
  },
  categoryTitle: {
    textAlign: 'left',
    fontWeight: 800,
    fontSize: '1rem'
  },
  // cardTitleForMenu: {
  //   marginRight: '80%',
  //   fontWeight: 'bold',
  //   whiteSpace: 'nowrap'
  // },
  prepareTime: {
    fontWeight: '500',
    color: 'rgb(127,129,149)',
    fontSize: '0.7em',
    paddingTop: '3px'
  },
  numOfItem: {
    fontWeight: '500',
    paddingRight: '80%',
    whiteSpace: 'nowrap',
    color: 'rgb(127,129,149)',
    fontSize: '0.7em',
    paddingTop: '3px',
    textAlign: 'left'
  },
  foodPrice: {
    //fontWeight: 'bold'
  },
  cardBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  subtitleWrapper: {
    display: 'block',
    position: 'relative',
    paddingBottom: '0.5rem',
    //bottom: 0,
    //alignItems: 'left',
    //marginLeft: '-0.5em',
    minHeight: '1.2em',
    '& .MuiTypography-root': {
      textAlign: 'left'
    }
  }
}));

function NxtMenuItemCard({
  size = 4,
  img,
  imgAlt,
  caption,
  captionAlign = 'center',
  menuCaption = false,
  captionVariant = 'subtitle1',
  subtitle1,
  subtitle2,
  disabled,
  onClick,
  recommended = false,
  prepareDuration,
  priceIncludingTax,
  foodItemCount,
  tags,
  price
}) {
  const classes = useStyles();
  const { t } = useTranslation(['menus']);
  return (
    <Grid
      item
      xs={size}
      className={classes.root}
      onClick={disabled ? undefined : onClick}
    >
      <div className={classes.contentWrapper}>
        {/* <img className={classes.cardImage} src={img} alt={imgAlt} /> */}
        <RenderSmoothImage
          className={classes.cardImage}
          src={img}
          alt={imgAlt}
        ></RenderSmoothImage>
        {/* <Box className="itemTg" component="span"> */}
        <div className={classes.captionWrapper + ' itemTg'}>
          <IxTitle align={captionAlign} variant={captionVariant}>
            {caption}
          </IxTitle>
          <div className={classes.subtitleWrapper}>
            <Typography
              className={
                recommended ? classes.menuTitle : classes.categoryTitle
              }
            >
              {subtitle1}
            </Typography>
            {recommended && (
              <div className={classes.cardBottom}>
                <Typography className={classes.prepareTime}>
                  {prepareDuration} Min
                </Typography>
                <Typography className={classes.foodPrice}>
                  <small>￥</small>
                  {priceIncludingTax}
                </Typography>
              </div>
            )}
            {!recommended && (
              <Typography className={classes.numOfItem}>
                {foodItemCount} {t('Items')}
              </Typography>
            )}
          </div>
          {/* <Box component="span">
          <NxtTxtApart
            left={tags}
            right={price}
            leftVariant="subtitle2"
            rightVariant="h6"
            leftColor="textPrimary"
            rightColor="textPrimary"
          ></NxtTxtApart>
        </Box> */}
        </div>
        {/* </Box> */}
      </div>
    </Grid>
  );
}

export default NxtMenuItemCard;

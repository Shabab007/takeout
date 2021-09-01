import React from 'react';
import { makeStyles, Grid, Typography, Box } from '@material-ui/core';
import IxTitle from '../../basic/ix-title';
// import IxCurrency from '../../basic/ix-currency';
// import NxtTxtApart from '../../basic/nxt-text-apart';
import { useTranslation } from 'react-i18next';
import RenderSmoothImage from '../../basic/nxt-render-smooth-image';
// import NxtElementSpaceBetween from '../../basic/nxt-element-space-between';
import NxtPriceDisplay from '../../composite/nxt-price-display';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'block',
    // overflow: 'hidden',
    // // border: `1px solid ${theme.palette.border.main}`,
    // borderRadius: '5px',
  },
  disabled: {
    opacity: 0.5,
  },
  cardImageWrapper: {
    display: 'block',
    objectFit: 'contain',
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  captionWrapper: {
    display: 'block',
    padding: '0 .5rem .2rem',
    '& span h6': {
      color: theme.palette.text.commonSecondary,
    },
  },
  subtitleWrapper: {
    display: 'block',
    justifyContent: 'space-between',
    alignItems: 'left',
    marginLeft: '-0.5em',
    minHeight: '2em',
    '& .MuiTypography-root': {
      marginTop: '0.5em',
      color: theme.palette.text.commonPrimaryColor,
    },
  },
  priceWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cookingTime: {
    flexGrow: 1,
    textAlign: 'left',
  },
  priceDisplayRoot: {
    textAlign: 'left',
  },
  priceDisplayRow: {
    justifyContent: 'flex-start !important',
  },
  soldOutTag: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: theme.palette.text.white,
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadiusSecondary,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.4),
    paddingBottom: theme.spacing(0.4),
  },
}));

function NxtItemCard({
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
  isPackage,
  price,
  priceIncludingTax,
  priceDisplayOption,
  isSoldOut,
}) {
  const classes = useStyles();
  const [t] = useTranslation();
  return (
    <Grid
      item
      xs={size}
      className={classes.root}
      onClick={disabled ? undefined : onClick}
    >
      {/* <img className={classes.cardImageWrapper} src={img} alt={imgAlt} /> */}
      <RenderSmoothImage
        className={classes.cardImageWrapper}
        src={img}
        alt={imgAlt}
      ></RenderSmoothImage>
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
          <div className={classes.priceWrapper}>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className={classes.cookingTime}
            >
              {tags}
            </Typography>
            <NxtPriceDisplay
              price={price}
              priceIncludingTax={priceIncludingTax}
              shouldApplyCompanyConfigPriceRounding={false}
              option={priceDisplayOption}
              rootClassName={classes.priceDisplayRoot}
              rowClassName={classes.priceDisplayRow}
            ></NxtPriceDisplay>
          </div>

          {/* <NxtTxtApart
            left={tags}
            right={isPackage ? '' : <IxCurrency value={price} variant="body2"></IxCurrency>}
            leftVariant="subtitle2"
            rightVariant="h5"
            leftColor="textPrimary"
            rightColor="textPrimary"
          ></NxtTxtApart> */}
        </Box>
      </div>
      {isSoldOut && (
        <Typography variant="caption" className={classes.soldOutTag}>
          {t('common:SoldOut')}
        </Typography>
      )}
    </Grid>
  );
}

export default NxtItemCard;

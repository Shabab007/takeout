import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IxTitle from '../basic/ix-title';
// import IxCurrency from '../basic/ix-currency';
import IxDisplayCount from '../basic/ix-display-count';
import NxtImage from '../basic/nxt-image';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import companyConfigEnum from '../../constants/company-config-enum';
import NxtPriceDisplay from './nxt-price-display';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    //flexWrap: 'wrap',
    width: '100%',
    boxSizing: 'border-box',
    alignItems: 'top',
    paddingLeft: theme.spacing(1)
  },
  itemImage: {
    flex: '.5',
    maxWidth: '10rem',
    minWidth: '7rem',
    marginRight: '0.5rem',
  },
  itemPropertiesWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
    //flex: 1,
    // display: 'block',
    //overflow: 'hidden',
    height: 'auto',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    flexGrow: 1,
  },
  itemTitle: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginBottom: '-20px',
    marginTop: '-20px',
    marginLeft: '-5px',
    fontWeight: '400',
  },
  itemDescription: {
    color: theme.palette.text.commonSecondary,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: '400',
    marginTop: '-15px',
    marginLeft: '-5px',
  },
  currency: {
    '& .MuiTypography-root': {
      fontWeight: 'bold',
      lineHeight: '25px',
      marginTop: '5px'
    },
  },
  attributesWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexGrow: 1,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    marginTop: '-60px',
    marginLeft:'-10px',
    //paddingBottom: '50px'
  },
  unitAmoutWrapper: {
    display: 'flex',
    //flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column'
    },
    marginLeft: '5px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    '& p': {
      fontSize: '.8rem',
      lineHeight: '25px',
      marginLeft: theme.spacing(1),
      fontWeight: '400',
    },
    '& h6': {
      fontSize: '.8rem',
      lineHeight: '25px',
      fontWeight: '400',
    },
  },
  itemCalorie: {
    color: '#000000',
    display: 'inline'
  },
  soldOutTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: theme.palette.text.white,
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadiusSecondary,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.4),
    paddingBottom: theme.spacing(0.4),
  },
  priceDisplayRow: {
    justifyContent: 'center !important',
  },
  priceDisplayClassName: {
    fontSize: '1.1rem',
  },
  priceDisplaySuffixClassName: {
    fontSize: '.9rem',
  },
  subtotalDisplayClassName: {
    fontSize: '.9rem !important',
  },
  subtotalDisplaySuffixClassName: {
    fontSize: '.7rem !important',
  },
  subtotalDisplayRow: {
    justifyContent: 'flex-end !important',
  },
}));

function NxtMenuItem({
  img,
  vdo,
  imgAlt = 'img',
  itemName,
  description,
  countTime,
  countUnit,
  calorie,
  calorieUnit,
  amountWithUnit,
  tag,
  price,
  priceIncludingTax,
  isPackage,
  currency = '¥',
  isSoldOut,
}) {
  const classes = useStyles();
  const [t] = useTranslation();
  const handleClick = (e) => {};
  const companyConfig = useSelector((state) => state.appState.companyConfig);
  const companyConfigData = companyConfig.data;

  let displayItemCookingTime, displayItemCalories;
  try {
    displayItemCookingTime =
      companyConfigData[companyConfigEnum.DISPLAY_ITEM_COOKING_TIME];
    displayItemCalories =
      companyConfigData[companyConfigEnum.DISPLAY_ITEM_CALORIES];
  } catch (e) {
    console.warn(e);
  }

  return (
    <div className={classes.root}>
      <div className={classes.itemImage}>
        <NxtImage
          src={img}
          vdo={vdo}
          vdoClassName={'itemVideoSmall'}
          alt="order item image alt"
          onClick={handleClick}
        ></NxtImage>
      </div>

      <div className={classes.itemPropertiesWrapper}>
        <Box>
          <IxTitle
            className={classes.itemTitle}
            text={itemName}
            //alignment="right"
            variant="h6"
          ></IxTitle>
        </Box>
        <Box>
          <IxTitle
            className={classes.itemDescription}
            text={description}
            //alignment="right"
            variant="subtitle1"
          ></IxTitle>
        </Box>

        <Box className={classes.attributesWrapper}>
          <Box className={classes.unitAmoutWrapper}>
            {displayItemCookingTime == 'true' && (
              <IxDisplayCount
                value={countTime}
                unit={countUnit}
                variant="caption"
              ></IxDisplayCount>
            )}
            {displayItemCalories == 'true' && (
              <IxDisplayCount
                value={calorie}
                unit={calorieUnit}
                variant="caption"
                itemCalorie={classes.itemCalorie}
              ></IxDisplayCount>
            )}
            {/* <IxTitle text={amountWithUnit} alignment="left" variant="body2"></IxTitle> */}
          </Box>
          <Box style={{marginLeft: '-10px'}}>
            <Box className={classes.currency}>
              {/* <IxCurrency value={price} currency={currency} variant="body1"></IxCurrency> */}
              <NxtPriceDisplay
                price={isPackage ? 0 : price}
                priceIncludingTax={isPackage ? 0 : priceIncludingTax}
                option={
                  companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]
                }
                rootClassName={classes.priceDisplayRoot}
                rowClassName={classes.subtotalDisplayRow}
                className={classes.subtotalDisplayClassName}
                suffixClassName={classes.subtotalDisplaySuffixClassName}
              ></NxtPriceDisplay>
            </Box>
          </Box>
        </Box>
      </div>
      {isSoldOut && (
        <Typography variant="caption" className={classes.soldOutTag}>
          {t('common:SoldOut')}
        </Typography>
      )}
    </div>
  );
}

export default NxtMenuItem;

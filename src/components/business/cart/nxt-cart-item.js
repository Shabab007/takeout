import React from 'react';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import LanguageNamespaces from '../../../constants/language-namespaces';
import NxtImage from '../../basic/nxt-image';
import { useTranslation } from 'react-i18next';
import IxTxtBox from '../../basic/ix-txt-box';
// import IxIncrementDecrementCounter from '../../../basic/ix-increment-decrement-counter';
import IxIncrementDecrementCounterRedBordered from '../../basic/ix-increment-decrement-counter-red-bordered';
// import IxCurrency from '../../basic/ix-currency';

import { IMAGE_URL } from '../../../constants/ix-image-links';
import { setFoodItem } from '../../../actions/food-detail-actions';
// import IxButton from '../../basic/ix-button';
import {
  getPriceIncludingTax,
  findFoodItemInMenu,
  redirectToFoodDetail,
} from '../../../services/utility';
import EditIcon from '@material-ui/icons/Edit';
import IxIconButton from '../../basic/ix-icon-button';
import NxtPriceDisplay from '../../composite/nxt-price-display';
import companyConfigEnum from '../../../constants/company-config-enum';
import { getGuestConfigFromSessionStorage } from '../../../actions/nxt-local-storage';
const mapDispatchToProps = { setFoodItem }; // of food detail store

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
    boxSizing: 'border-box',
    alignItems: 'top',
    flexWrap: 'wrap',
  },
  itemImage: {
    flex: '.5',
    maxWidth: '10rem',
    minWidth: '5rem',
    marginRight: '0.5rem',
  },
  itemPropertiesWrapper: {
    flex: 1,
    height: 'auto',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  itemTitle: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingRight: theme.spacing(2.8),
  },
  itemSubtitle: {
    color: 'textSecondary',
  },
  countWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    '& .root': {
      border: '1px solid red',
    },
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  soldOutTag: {
    position: 'absolute',
    top: theme.spacing(5),
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
  updateOrderedItemRoot: {
    height: '30px',
  },
  priceDisplayRoot: {
    textAlign: 'center',
  },
  priceDisplayRow: {
    justifyContent: 'flex-end !important',
  },
  priceDisplayClassName: {
    fontSize: '.9rem',
  },
  priceDisplaySuffixClassName: {
    fontSize: '.7rem',
  },
}));

const NxtCartItem = ({
  restaurantTable,
  item,
  handleQuantityCounter,
  handleRemoveItem,
  disableUpdate,
  setFoodItem,
  menuList,
  history,
  readOnly,
  enableEditOrderedItemButton,
}) => {
  const classes = useStyles();
  const [t] = useTranslation([LanguageNamespaces.orderr]);
  const operatorSubtract = '-';
  const operatorAddition = '+';

  const languageCode = useSelector((state) => state.language.code);
  const companyConfig = useSelector((state) => state.appState.companyConfig);
  const companyConfigData = companyConfig.data;

  const foodItemExistsInMenu = findFoodItemInMenu(menuList, item);

  const companyId =
    restaurantTable && restaurantTable.company && restaurantTable.company.id;

  const diningGuests = JSON.parse(getGuestConfigFromSessionStorage());

  const totalGuestCount =
    diningGuests.female +
    diningGuests.male +
    diningGuests.others +
    diningGuests.kid;

  const {
    name,
    isPackage,
    price,
    priceIncludingTax,
    tax,
    quantity,
    orderItemChoices,
    specialInstruction,
    isLimitedQtyPerOrder,
  } = item;
  const toppingCount =
    orderItemChoices && orderItemChoices.length ? orderItemChoices.length : 0;
  let bundlePrice = price;
  let bundlePriceIncludingTax = getPriceIncludingTax(
    priceIncludingTax,
    price,
    tax,
  );
  orderItemChoices &&
    orderItemChoices.map((item) => {
      const { price, priceIncludingTax, tax } = item;
      bundlePrice += price;
      bundlePriceIncludingTax += getPriceIncludingTax(
        priceIncludingTax,
        price,
        tax,
      );
    });

  let subtitle = '';

  if (toppingCount) {
    subtitle = toppingCount.toString() + ' ' + t('ExtraToppingsMessage');
    if (specialInstruction) {
      subtitle += ' ' + t('SpecialInstructionSuffixMessage');
    }
  } else if (specialInstruction) {
    subtitle = t('SpecialInstructionMessage');
  } else {
    subtitle = t('NoSpecialInstructionMessage');
  }

  const handleUpdateOrderedFoodItem = () => {
    setFoodItem(item);
    redirectToFoodDetail(history);
  };

  const handleLoadFoodItemDetail = () => {
    setFoodItem({ ...item, id: item.foodItemId, orderItemChoices: null });
    redirectToFoodDetail(history);
  };

  const { photo } = item;
  const imageSrc = photo ? IMAGE_URL + companyId + '/images/' + photo : null;

  return (
    <div className={classes.root + ' cartBorder'}>
      <div className={classes.itemImage}>
        <NxtImage
          // src={imgLink[item.photo] ? imgLink[item.photo] : sampleImg}
          src={imageSrc}
          alt={t('order item image alt')}
        ></NxtImage>
      </div>
      <div className={classes.itemPropertiesWrapper}>
        {/* (disableUpdate || !menuList.length ? {} : handleUpdateOrderedFoodItem()) */}
        <div
          onClick={() => {
            menuList.length &&
              foodItemExistsInMenu &&
              !disableUpdate &&
              handleLoadFoodItemDetail();
          }}
        >
          <IxTxtBox
            primary={
              name ? (typeof name === 'string' ? name : name[languageCode]) : ''
            }
            primaryVariant="h6"
            primaryClassName={classes.itemTitle}
            secondaryClassName={classes.itemSubtitle}
            secondary={subtitle}
            align="left"
          ></IxTxtBox>
        </div>
        <div className={classes.countWrapper}>
          <IxIncrementDecrementCounterRedBordered
            count={quantity}
            operatorOne={operatorSubtract}
            operatorTwo={operatorAddition}
            handleCount={handleQuantityCounter}
            buttonOneDisabled={disableUpdate}
            buttonTwoDisabled={
              disableUpdate ||
              (isLimitedQtyPerOrder && quantity >= totalGuestCount)
            }
          ></IxIncrementDecrementCounterRedBordered>
          {enableEditOrderedItemButton && (
            // <IxButton
            //   variant="contained"
            //   color="primary"
            //   classes={{ root: classes.updateOrderedItemRoot }}
            //   disabled={disableUpdate || !menuList.length}
            //   onClick={handleUpdateOrderedFoodItem}
            // >
            //   {t('UpdateOrderItemBtnText')}
            // </IxButton>
            <IxIconButton
              // variant="contained"
              color="primary"
              classes={{ root: classes.updateOrderedItemRoot }}
              disabled={
                disableUpdate || !menuList.length || !foodItemExistsInMenu
              }
              onClick={handleUpdateOrderedFoodItem}
            >
              <EditIcon />
            </IxIconButton>
          )}

          {
            isPackage ? (
              ''
            ) : (
              <NxtPriceDisplay
                price={bundlePrice * quantity}
                priceIncludingTax={bundlePriceIncludingTax * quantity}
                option={
                  companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]
                }
                shouldApplyCompanyConfigPriceRounding={false}
                rootClassName={classes.priceDisplayRoot}
                rowClassName={classes.priceDisplayRow}
                className={classes.priceDisplayClassName}
                suffixClassName={classes.priceDisplaySuffixClassName}
              ></NxtPriceDisplay>
            )
            // <IxCurrency value={bundlePrice * quantity} variant="h6"></IxCurrency>
          }
        </div>
      </div>
      {handleRemoveItem && !readOnly && (
        <IconButton
          className={classes.closeButton}
          onClick={handleRemoveItem}
          disabled={disableUpdate}
        >
          <CloseIcon size="small" />
        </IconButton>
      )}
      {item.isSoldOut && (
        <Typography variant="caption" className={classes.soldOutTag}>
          {t('common:SoldOut')}
        </Typography>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { appState, menuState } = state;
  return {
    menuList: menuState.menus.data,
    restaurantTable: appState.restaurantTable.data,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NxtCartItem),
);

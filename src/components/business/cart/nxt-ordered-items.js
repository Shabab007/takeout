import React from 'react';
import { useSelector } from 'react-redux';
import styles from './style';
import NxtCartItem from './nxt-cart-item';
import NxtTxtApart from '../../basic/nxt-text-apart';
import { SENT_TO_KITCHEN } from '../../../constants/order-status';
import NxtPriceDisplay from '../../composite/nxt-price-display';
import companyConfigEnum from '../../../constants/company-config-enum';
import {
  getPriceIncludingTax,
  isOrderedPackageMenuExpired,
} from '../../../services/utility';
import nxtMenuTypes from '../../../constants/nxt-menu-types';
import { Typography } from '@material-ui/core'; //IconButton,
// import CloseIcon from '@material-ui/icons/Close';

function OrderedItems({
  items,
  orderedItemsTotal,
  decrementOrderedItemCount,
  incrementOrderedItemCount,
  removeFromCart,
  removePackageMenuFromCart,
  packageMenus,
  nonPackageMenus,
  distinctPackageMenus,

  readOnly,
  enableEditOrderedItemButton,
  companyConfigData,
  totalGuestCountWithoutKids,
}) {
  const classes = styles();
  // const [t] = useTranslation([LanguageNamespaces.orderr]);
  const operatorSubtract = '-';
  const operatorAddition = '+';

  const handleOrderedItemQuantityCounter = (operator, foodItemId) => {
    if (operator === operatorSubtract) {
      decrementOrderedItemCount(foodItemId);
    } else if (operator === operatorAddition) {
      incrementOrderedItemCount(foodItemId);
    }
  };
  const languageCode = useSelector((state) => state.language.code);

  const orderedPackageMenus = useSelector(
    (state) => state.cart.orderedPackageMenus,
  );

  return (
    <div>
      {nonPackageMenus.map((item, index) => {
        return (
          <div
            key={index + '-ordered-' + item.foodItemId}
            className={classes.orderedItemBorder}
          >
            {/* todo enable_cancel */}
            <NxtCartItem
              item={item}
              handleQuantityCounter={(operator) =>
                handleOrderedItemQuantityCounter(operator, item.id)
              }
              handleRemoveItem={null /*() => removeFromCart(item.id)*/}
              disableUpdate={readOnly || item.status !== SENT_TO_KITCHEN}
              readOnly={readOnly}
              enableEditOrderedItemButton={enableEditOrderedItemButton}
            ></NxtCartItem>
          </div>
        );
      })}

      {distinctPackageMenus.map((distinctMenu, index) => {
        const {
          menuId,
          menuName,
          quantity,
          packagePrice,
          packagePriceIncludingTax,
          taxDecimal,
        } = distinctMenu;
        let title = menuName
          ? typeof menuName === 'string'
            ? menuName
            : menuName[languageCode]
          : '';

        title ? (title += ` (x${totalGuestCountWithoutKids})`) : (title = '');

        return (
          <div className="cartDiningIn" key={index}>
            <div className="groupHeader">
              <NxtTxtApart
                left={<Typography>{title}</Typography>}
                // right={
                //   <IconButton
                //     className={classes.packageMenuRemoveBtn}
                //     onClick={() => removePackageMenuFromCart(menuId)}
                //     disabled={null}
                //   >
                //     <CloseIcon size="small" />
                //   </IconButton>
                // }
              ></NxtTxtApart>
              <NxtTxtApart
                left={
                  <NxtPriceDisplay
                    price={packagePrice}
                    priceIncludingTax={getPriceIncludingTax(
                      packagePriceIncludingTax,
                      packagePrice,
                      taxDecimal,
                    )}
                    shouldApplyCompanyConfigPriceRounding={false}
                    option={
                      companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]
                    }
                    rootClassName={classes.priceDisplayRoot}
                    rowClassName={classes.packageMenuPriceDisplayRow}
                    className={classes.subtotalDisplayClassName}
                    suffixClassName={classes.subtotalDisplaySuffixClassName}
                  ></NxtPriceDisplay>
                }
                right={
                  <NxtPriceDisplay
                    price={packagePrice * totalGuestCountWithoutKids}
                    priceIncludingTax={
                      getPriceIncludingTax(
                        packagePriceIncludingTax,
                        packagePrice,
                        taxDecimal,
                      ) * totalGuestCountWithoutKids
                    }
                    shouldApplyCompanyConfigPriceRounding={false}
                    option={
                      companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]
                    }
                    rootClassName={classes.priceDisplayRoot}
                    rowClassName={classes.packageMenuTotalPriceDisplayRow}
                    className={classes.subtotalDisplayClassName}
                    suffixClassName={classes.subtotalDisplaySuffixClassName}
                  ></NxtPriceDisplay>
                }
              ></NxtTxtApart>
              {/* <NxtTxtApart
                left={title}
                leftVariant="h6"
                leftColor="textPrimary"
                right={
                  // <IxCurrency
                  //   value={distinctMenu.packagePrice * quantity}
                  //   variant="h6"
                  //   color="textPrimary"
                  // ></IxCurrency>
                  <NxtPriceDisplay
                    price={packagePrice * quantity}
                    priceIncludingTax={
                      getPriceIncludingTax(
                        packagePriceIncludingTax,
                        packagePrice,
                        packagePriceTax,
                      ) * quantity
                    }
                    shouldApplyCompanyConfigPriceRounding={false}
                    option={
                      companyConfigData[companyConfigEnum.PRICE_DISPLAY_OPTION]
                    }
                    rootClassName={classes.priceDisplayRoot}
                    rowClassName={classes.priceDisplayRow}
                    className={classes.allYouCanEatPriceDisplayClassName}
                    suffixClassName={
                      classes.allYouCanEatPriceDisplaySuffixClassName
                    }
                  ></NxtPriceDisplay>
                }
              ></NxtTxtApart> */}
            </div>

            {packageMenus.map((item, index) => {
              const { menuId, itemCode } = item;
              if (
                menuId === distinctMenu.id &&
                itemCode !== nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE
              ) {
                return (
                  <div
                    key={index + '-ordered-' + item.foodItemId}
                    className={classes.orderedItemBorder}
                  >
                    {/* todo enable_cancel */}
                    <NxtCartItem
                      item={item}
                      handleQuantityCounter={(operator) =>
                        handleOrderedItemQuantityCounter(operator, item.id)
                      }
                      handleRemoveItem={null /*() => removeFromCart(item.id) */}
                      disableUpdate={
                        readOnly ||
                        item.status !== SENT_TO_KITCHEN ||
                        isOrderedPackageMenuExpired(menuId, orderedPackageMenus)
                      }
                      readOnly={readOnly}
                      enableEditOrderedItemButton={enableEditOrderedItemButton}
                    ></NxtCartItem>
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default OrderedItems;

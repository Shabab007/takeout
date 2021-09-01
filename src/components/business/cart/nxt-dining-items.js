import React from 'react';
import { useSelector } from 'react-redux';
import styles from './style';
import NxtCartItem from './nxt-cart-item';
import NxtTxtApart from '../../basic/nxt-text-apart';
// import IxCurrency from '../../basic/ix-currency';
import NxtPriceDisplay from '../../composite/nxt-price-display';
import companyConfigEnum from '../../../constants/company-config-enum';
import { getPriceIncludingTax } from '../../../services/utility';
import nxtMenuTypes from '../../../constants/nxt-menu-types';
import { IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

function DiningItems({
  items,
  decrementCartItemCount,
  incrementCartItemCount,
  removeFromCart,
  packageMenus,
  nonPackageMenus,
  distinctPackageMenus,
  companyConfigData,
  removePackageMenuFromCart,
  totalGuestCountWithoutKids,
}) {
  const classes = styles();
  const operatorSubtract = '-';
  const operatorAddition = '+';
  const languageCode = useSelector((state) => state.language.code);
  const handleCartItemQuantityCounter = (operator, foodItemId) => {
    if (operator === operatorSubtract) {
      decrementCartItemCount(foodItemId);
    } else if (operator === operatorAddition) {
      incrementCartItemCount(foodItemId);
    }
  };

  return (
    <div>
      {nonPackageMenus.map((item, index) => {
        return (
          <div key={index} className={classes.cartItemBorder}>
            <NxtCartItem
              item={item}
              handleQuantityCounter={(operator) =>
                handleCartItemQuantityCounter(operator, item.index)
              }
              handleRemoveItem={() => removeFromCart(item.index)}
            ></NxtCartItem>
          </div>
        );
      })}

      {distinctPackageMenus.map((distinctMenu, index) => {
        const {
          menuId,
          menuName,
          packagePrice,
          packagePriceIncludingTax,
          packagePriceTax,
          quantity,
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
                right={
                  <IconButton
                    className={classes.packageMenuRemoveBtn}
                    onClick={() => removePackageMenuFromCart(menuId)}
                    disabled={null}
                  >
                    <CloseIcon size="small" />
                  </IconButton>
                }
              ></NxtTxtApart>
              <NxtTxtApart
                left={
                  <NxtPriceDisplay
                    price={packagePrice}
                    priceIncludingTax={getPriceIncludingTax(
                      packagePriceIncludingTax,
                      packagePrice,
                      packagePriceTax,
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
                        packagePriceTax,
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
            </div>

            {packageMenus.map((item, index) => {
              // packageMenus actually contains food item.
              if (
                item.menuId === distinctMenu.id &&
                item.itemCode !==
                  nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE
              ) {
                return (
                  <div key={index} className={classes.cartItemBorder}>
                    <NxtCartItem
                      item={item}
                      handleQuantityCounter={(operator) =>
                        handleCartItemQuantityCounter(operator, item.index)
                      }
                      handleRemoveItem={() => removeFromCart(item.index)}
                    ></NxtCartItem>
                  </div>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
}

export default DiningItems;

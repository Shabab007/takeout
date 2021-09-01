import React, { Suspense } from 'react';
import styles from './style';
// import NxtCartItem from './nxt-cart-item';
import NxtFallback from '../../basic/nxt-fallback';
import IxTxtBox from '../../basic/ix-txt-box';
import CartCollapsePanel from './nxt-cart-collapse-panel';
// import IxCurrency from '../../../basic/ix-currency';
import { useTranslation } from 'react-i18next';
import LanguageNamespaces from '../../../constants/language-namespaces';
import OrderedItems from './nxt-ordered-items';

function OrderedCollapsItems({
  items,
  itemCount,
  orderedItemsTotal,
  decrementOrderedItemCount,
  incrementOrderedItemCount,
  removeFromCart,
  packageMenus,
  nonPackageMenus,
  distinctPackageMenus,
  enableEditOrderedItemButton,
  companyConfigData,
  totalGuestCountWithoutKids,
}) {
  const classes = styles();
  const [t] = useTranslation([LanguageNamespaces.orderr]);
  // const operatorSubtract = '-';
  // const operatorAddition = '+';

  // const handleOrderedItemQuantityCounter = (operator, foodItemId) => {
  //   if (operator === operatorSubtract) {
  //     decrementOrderedItemCount(foodItemId);
  //   } else if (operator === operatorAddition) {
  //     incrementOrderedItemCount(foodItemId);
  //   }
  // };

  return (
    <div className="orderedCollapsItems">
      {items && items.length ? (
        <div className={classes.orderedItemsWrapper}>
          <CartCollapsePanel
            className="orderedItemsHeader"
            id="ordered-items"
            name={
              <>
                <IxTxtBox
                  primary={t('alreadyOrdered', {
                    itemCount,
                  })}
                  primaryVariant="h6"
                ></IxTxtBox>
              </>
            }
          >
            <Suspense fallback={<NxtFallback />}>
              {/* {items.map((item, index) => {
                return (
                  <div className={classes.orderedItemBorder}>
                    <NxtCartItem
                      key={index + '-ordered-' + item.foodItemId}
                      item={item}
                      handleQuantityCounter={(operator) => handleOrderedItemQuantityCounter(operator, index)}
                      handleRemoveItem={() => removeFromCart({ foodItemId: item.foodItemId, menuId: item.menuId })}
                    ></NxtCartItem>
                  </div>
                );
              })} */}
              <OrderedItems
                packageMenus={packageMenus}
                nonPackageMenus={nonPackageMenus}
                distinctPackageMenus={distinctPackageMenus}
                items={items}
                orderedItemsTotal={orderedItemsTotal}
                decrementOrderedItemCount={decrementOrderedItemCount}
                incrementOrderedItemCount={incrementOrderedItemCount}
                removeFromCart={removeFromCart}
                enableEditOrderedItemButton={enableEditOrderedItemButton}
                companyConfigData={companyConfigData}
                totalGuestCountWithoutKids={totalGuestCountWithoutKids}
              ></OrderedItems>
            </Suspense>
          </CartCollapsePanel>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default OrderedCollapsItems;

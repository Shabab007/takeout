import React, { Suspense } from 'react';
import styles from './style';
import NxtCartItem from './nxt-cart-item';
import NxtFallback from '../../basic/nxt-fallback';
import IxTxtBox from '../../basic/ix-txt-box';

function TakeOutItems({
  items,
  decrementCartItemCount,
  incrementCartItemCount,
  removeFromCart,
}) {
  const classes = styles();
  const operatorSubtract = '-';
  const operatorAddition = '+';

  const handleCartItemQuantityCounter = (operator, foodItemId) => {
    if (operator === operatorSubtract) {
      decrementCartItemCount(foodItemId);
    } else if (operator === operatorAddition) {
      incrementCartItemCount(foodItemId);
    }
  };

  if (!items.length) {
    return ' ';
  }

  return (
    <div className="cartTakeAway">
      <Suspense fallback={<NxtFallback />}>
        <div className="groupHeader">
          {/* todo use translated language key */}
          <IxTxtBox primary="Take out" primaryVariant="h6"></IxTxtBox>
        </div>
        {items.map((item, index) => {
          return (
            <div className={classes.cartItemBorder}>
              <NxtCartItem
                // className="cartItemBorder"
                key={index + '-' + item.foodItemId}
                item={item}
                handleQuantityCounter={(operator) =>
                  handleCartItemQuantityCounter(operator, {
                    foodItemId: item.id,
                    menuId: item.menuId,
                  })
                }
                handleRemoveItem={() => removeFromCart(item.index)}
              ></NxtCartItem>
            </div>
          );
        })}
      </Suspense>
    </div>
  );
}

export default TakeOutItems;

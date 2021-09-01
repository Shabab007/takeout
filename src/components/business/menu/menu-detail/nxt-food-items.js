import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';

import NxtMenuItem from '../../../composite/nxt-menu-item.js';

import { setFoodItem } from '../../../../actions/food-detail-actions';
import { IMAGE_URL } from '../../../../constants/ix-image-links';

import { redirectToFoodDetail } from '../../../../services/utility.js';
import styles from './style.js';

function CatFoodItems({
  history,
  appState,
  category,
  img,
  setFoodItem,
  menuId,
  handleAddMenuIdToOrderState,
  disablePackageMenuFoodItemBeforeOrder,
}) {
  const classes = styles();
  const [t] = useTranslation();
  var companyId;

  try {
    companyId = appState.restaurantTable.data.company.id;
  } catch (e) {
    console.warn(e);
  }

  const handleFoodItemClick = (item) => {
    setFoodItem(item);
    handleAddMenuIdToOrderState(menuId);
    redirectToFoodDetail(history);
  };

  return (
    <div className={classes.foodItemWrapperInListPage}>
      <div className={classes.items}>
        {category && category.foodItems && category.foodItems.length ? (
          category.foodItems.map((item, index) => {
            const {
              name,
              description,
              prepareDuration,
              photo,
              video,
              calorie,
              isSoldOut,
              price,
              priceIncludingTax,
              isPackage,
            } = item;

            const imageSrc = photo
              ? IMAGE_URL + companyId + '/images/' + photo
              : null;
            
              const videoSrc = video
              ? IMAGE_URL + companyId + '/images/' + video
              : null;
              
            return (
              <div
                key={index}
                onClick={() =>
                  !isSoldOut && !disablePackageMenuFoodItemBeforeOrder
                    ? handleFoodItemClick(item)
                    : {}
                }
              >
                <Grid className={classes.foodItemRow} container direction="row">
                  <NxtMenuItem
                    img={imageSrc}
                    vdo={videoSrc}
                    imgAlt="img"
                    itemName={name}
                    description={description}
                    countTime={prepareDuration}
                    countUnit={t('menus:Mins')}
                    calorie={calorie}
                    calorieUnit={t('menus:CalorieShorthand')}
                    tag="H"
                    price={price}
                    priceIncludingTax={priceIncludingTax}
                    isPackage={isPackage}
                    currency="¥"
                    isSoldOut={isSoldOut}
                  ></NxtMenuItem>
                </Grid>
                <Divider />
              </div>
            );
          })
        ) : (
          <Typography> {t('common:noItemsDisplayMessage')}</Typography>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ appState }) => {
  return { appState };
};
const mapDispatchToProps = { setFoodItem }; // of food detail store

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CatFoodItems),
);

import React from 'react';
import styles from '../menu-detail/style';
import { useTranslation } from 'react-i18next';
import { IconButton, InputBase, Box, Grid, Icon } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import NxtTopBar from '../../../basic/nxt-top-bar.js';
import NxtMenuItem from '../../../composite/nxt-menu-item.js';
import IxBottomNav from '../../../basic/ix-bottom-nav';
import { IMAGE_URL } from '../../../../constants/ix-image-links';

import { withRouter } from 'react-router-dom';

import {
  getFoodItemListFromMenuList,
  isOrderedPackageMenuExpired,
  redirectToFoodDetail,
} from '../../../../services/utility.js';
import nxtMenuTypes from '../../../../constants/nxt-menu-types';
import { useSnackbar } from 'notistack';
import snackbarTypes from '../../../../constants/snackbar-types';

function SearchFoodItems(props) {
  const { appState, menuState, cart, setFoodItem, history, language } = props;
  const classes = styles();
  const { t } = useTranslation(['menus']);
  const { enqueueSnackbar } = useSnackbar();
  let items = [];

  const [isSearchShow, setIsSearchShow] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  const { orderedPackageMenus } = cart;
  var companyId,
    languageCode,
    menuData = [];
  try {
    companyId = appState.restaurantTable.data.company.id;
    languageCode = language.code;
    menuData = menuState.menus.data;
  } catch (e) {
    console.warn(e);
  }

  if (menuData.length) {
    items = getFoodItemListFromMenuList(menuData).filter(
      // filtering out fake food item
      (item) =>
        item.itemCode !== nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE,
    );
  }

  const searchStyle = {
    marginTop: '4.5em',
  };

  const handleReset = () => {
    setSearchText('');
    setIsSearchShow(false);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value.substr(0, 30));
    setIsSearchShow(true);
  };

  const filteredItems = items
    .filter((item) => {
      return item.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
    })
    .sort((a, b) => {
      return a.isPackage &&
        orderedPackageMenus.find((orderedMenu) => orderedMenu.id === a.menuId)
        ? -1
        : 1;

      // if (a.isPackage === b.isPackage) {
      //   return 0;
      // } else {
      //   return a.isPackage ? -1 : 1;
      // }
      // return 0;
    });

  const handleDisplayNotification = (message) => {
    enqueueSnackbar(
      {
        title: message,
        message: '',
        variant: 'outlined',
        severity: snackbarTypes.error,
      },
      {
        persist: true,
        // autoHideDuration: 4000,
      },
    );
  };

  const handleItemClick = (item) => {
    const { menuId, menuName, isPackage } = item;

    const name = menuName
      ? typeof menuName === 'string'
        ? menuName
        : menuName[languageCode]
      : '';

    const isItemExistsInOrder = orderedPackageMenus.find(
      (orderedMenu) => orderedMenu.id === menuId,
    );

    if (isPackage) {
      if (!isItemExistsInOrder) {
        handleDisplayNotification(
          t('menus:NeedToOrderPackageMenuFirstMessage', { name }),
        );
        return;
      } else if (isOrderedPackageMenuExpired(menuId, orderedPackageMenus)) {
        handleDisplayNotification(
          t('menus:LastTimeToOrderPassedMessage', { name }),
        );

        return;
      }
    }

    setFoodItem(item);
    redirectToFoodDetail(history);
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.searchHeader} container>
        <Box className={classes.searchOption}>
          <NxtTopBar>
            <Box className={classes.search}>
              <InputBase
                autoFocus={true}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                value={searchText}
                onChange={handleSearchChange}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Box>
          </NxtTopBar>
        </Box>
        <Box className={classes.searchBottomNav} component="span">
          <IxBottomNav
            props={props}
            className={classes.searchBottomNav}
          ></IxBottomNav>
        </Box>
        <Box className={classes.searchCloseIcon}>
          <IconButton
            edge="start"
            className={classes.iconButtons}
            color="inherit"
            aria-label="shopping cart"
            onClick={handleReset}
          >
            <Icon>close</Icon>
          </IconButton>
        </Box>
      </Grid>
      <Box style={searchStyle} className={classes.bodyCat}>
        <Grid container item direction="row">
          {t('totalSearchedItems', {
            count: isSearchShow && searchText !== '' ? filteredItems.length : 0,
          })}
        </Grid>
        {isSearchShow && searchText !== ''
          ? filteredItems.map((item, index) => {
              const { photo } = item;
              const imageSrc = photo
                ? IMAGE_URL + companyId + '/images/' + photo
                : null;
              return (
                <span key={index} onClick={() => handleItemClick(item)}>
                  <Grid
                    className={classes.foodItemRow}
                    container
                    direction="row"
                  >
                    <NxtMenuItem
                      img={imageSrc}
                      imgAlt="img"
                      itemName={
                        item.name.length > 18
                          ? item.name.substring(0, 18) + '..'
                          : item.name
                      }
                      description={
                        item.description.length > 25
                          ? item.description.substring(0, 25) + '..'
                          : item.description
                      }
                      countTime={item.prepareDuration}
                      countUnit="mins"
                      amountWithUnit="110 Col."
                      tag="H"
                      price={item.price}
                      priceIncludingTax={item.priceIncludingTax}
                      isPackage={item.isPackage}
                      currency="¥"
                      isSoldOut={item.isSoldOut}
                    ></NxtMenuItem>
                  </Grid>
                  <Divider />
                </span>
              );
            })
          : null}
      </Box>
    </div>
  );
}

export default withRouter(SearchFoodItems);

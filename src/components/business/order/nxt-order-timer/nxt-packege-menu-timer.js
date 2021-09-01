import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Grid, Box, Typography, makeStyles } from '@material-ui/core';

import OrderTopbarWithBorder from '../../../basic/nxt-topbar-with-bottom-border.js';
import IxTxtBox from '../../../basic/ix-txt-box.js';
import IxBottomNav from '../../../basic/ix-bottom-nav';
import IxButton from '../../../basic/ix-button';

import { redirectToMenu } from '../../../../services/utility.js';
import NxtOrderTimer from './nxt-order-timer.js';

const styles = makeStyles((theme) => ({
  root: {
    margin: '0 1rem',
    '& .MuiTypography-body1': {
      color: theme.palette.text.commonSecondaryColor,
      marginBottom: '0.5em',
    },
  },
  bodyWrapper: {
    marginTop: '3.5rem', //theme.spacing(7),
    paddingBottom: '6rem', // theme.spacing(12),
    height: 'calc(100vh - 9.5rem)',
    display: 'flex',
    alignItems: 'center',
  },

  bottomNav: {
    bottom: '0',
    position: 'fixed',
    width: '105%',
    marginLeft: '-1.7em',
    zIndex: theme.zIndex.bottomNav,
  },
  order: {
    marginTop: '1.5em',
    marginBottom: '1.2em',
  },

  btnReorder: {
    height: '3.2em',
  },
  buttonGd: {
    marginTop: '1em',
    marginBottom: '0.5em',
    '& button': {
      width: '100%',
    },
  },

  noOrderMessage: {
    margin: '2rem .5rem',
    textAlign: 'center',
  },
  createOrderBtnWrapper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

function PackageMenuTimer(props) {
  const { order, history, appState, language } = props;
  let restaurantTableData = appState.restaurantTable.data;

  let tableNumber, restaurantName, sectionName;

  try {
    tableNumber = restaurantTableData.tableNo;
    restaurantName = restaurantTableData.branch.name;
    sectionName =
      restaurantTableData.section.name[language.code] || '';
    sectionName = sectionName ? ' - ' + sectionName : sectionName;
  } catch (e) {
    console.warn(e);
  }
  const classes = styles();
  const { t } = useTranslation(['orderr']);

  return (
    <div className={classes.root}>
      {/* <NxtTopBar>
        <NxtTopBarItems handleSearchButton={openSearchOption}></NxtTopBarItems>
      </NxtTopBar> */}
      <OrderTopbarWithBorder isOnlyMenu={false}>
        <IxTxtBox
          className={classes.attributeItem}
          align="left"
          primary={restaurantName + sectionName}
          primaryVariant="caption"
          secondary={t('tableName') + tableNumber}
          secondaryVariant="h6"
        ></IxTxtBox>
      </OrderTopbarWithBorder>

      <Box className={classes.bottomNav} component="span">
        <IxBottomNav props={props}></IxBottomNav>
      </Box>

      <div className={classes.bodyWrapper}>
        {order ? (
          <>
            <Grid container justify="center" item direction="row">
              <NxtOrderTimer order={order}></NxtOrderTimer>
            </Grid>
          </>
        ) : (
          <Grid container>
            <Grid item xs={12}>
              <Typography className={classes.noOrderMessage}>
                {t('orderr:noCurrentOrderMessage')}
              </Typography>
            </Grid>
            <Grid item className={classes.createOrderBtnWrapper} xs={12}>
              <IxButton
                color="primary"
                size="small"
                variant="contained"
                onClick={() => redirectToMenu(history)}
              >
                {t('BrowseMenu')}
              </IxButton>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({ appState, cart, language }) => {
  return {
    appState,
    // menuState,
    // editOrderedItems: state.cart.editOrderedItems,
    // orderPayment: state.order,
    order: cart.order,
    language,
  };
};

export default connect(mapStateToProps, null)(PackageMenuTimer);

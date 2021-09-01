import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress, Grid, makeStyles } from '@material-ui/core';

import { checkTableStatus, getOrderById } from '../../../services/guest';
import {
  redirectToGuestConfig,
  redirectToOrderHome,
} from '../../../services/utility';
import { setOrder } from '../../../actions/cart';
import { CANCELLED } from '../../../constants/order-status';
import { fetchMenus } from '../menu/menuSlice';

const useStyles = makeStyles((theme) => ({
  progressSpinner: {
    position: 'fixed',
    top: 'calc(50% - 20px)',
    left: 'calc(50% - 20px)',
    zIndex: theme.zIndex.progressSpinner,
  },
}));

const NxtRestaurantHome = ({ history }) => {
  const classes = useStyles();
  const session = useSelector((state) => state.appState.session);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchExistingOrder = async (existingOrderId) => {
      const response = await getOrderById(existingOrderId);
      if (response && response.success && response.data) {
        // setting order to redux

        let filteredResponse = response; // filter out cancelled items
        try {
          const filteredOrderMenus = response.data.orderMenus.map((menu) => {
            menu.orderItems = menu.orderItems.filter(
              (orderItem) => orderItem.status !== CANCELLED,
            );
            return menu;
          });

          filteredResponse.data.orderMenus = filteredOrderMenus;
        } catch (e) {
          console.warn(e);
        }

        dispatch(setOrder(filteredResponse));
        // setGuests(response.data.orderGuests);
        redirectToOrderHome(history);
      } else {
        // redirectToMenu(history);
        redirectToGuestConfig(history);
      }
    };
    const checkLiveTableStatus = async (tableCode) => {
      const tableOrderRes = await checkTableStatus(tableCode);
      if (tableOrderRes && tableOrderRes.success && tableOrderRes.data) {
        await dispatch(fetchMenus());

        // order exist on table
        fetchExistingOrder(tableOrderRes.data.id);
      } else {
        // no order placed on table
        // redirectToMenu(history);
        redirectToGuestConfig(history);
      }
    };
    if (session.data && session.data.tableCode) {
      checkLiveTableStatus(session.data.tableCode);
    }
  }, [history, dispatch, session]);

  return (
    <Grid container justify="center" alignItems="center">
      <Grid item xs={12}>
        <CircularProgress className={classes.progressSpinner} color="primary" />
      </Grid>
    </Grid>
  );
};

export default NxtRestaurantHome;

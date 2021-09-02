import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SockJsClient from 'react-stomp';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { isEqual } from 'lodash';

import { setOrder, setCart } from '../../../actions/cart';
import { CANCELLED, PAID, HAPPY_HOUR } from '../../../constants/order-status';
import { PAYMENT_UNSUCCESSFUL } from '../../../constants/error-code-enum';

import snackbarTypes from '../../../constants/snackbar-types';
import {
  getTimeStampFromTimeString,
  minuteToMilliSecond,
  redirectToHomeForTableBook,
  redirectToMenu,
  redirectToOrderHome,
  redirectToPaymentHome,
} from '../../../services/utility';

import { fetchLanguages } from '../language-selector/languagesSlice';
import {
  fetchStaffCallOptions,
  setCurrentCallData,
} from '../staff-call/staff-call-slice';
import { getOrderFromSessionStorage } from '../../../actions/nxt-local-storage';
import {
  fetchLiveRestaurantTableStatus,
  resetAppState,
  setOrderMergedAndMoved,
  setOrderTransferred,
  setMenuStaleBecauseOfPublish,
  setScreenBlocker,
} from '../home/appStateSlice';
import ScreenBlocker from './screen-blocker';
import IxButton from '../../basic/ix-button';
import { makeStyles } from '@material-ui/core';
import { fetchInvoice } from '../payment/paymentSlice';
import { fetchMenus, rearrangeMenuWithOrderedMenu } from '../menu/menuSlice';
// import apiRequestStatusEnum from '../../../constants/api-request-status-enum';
import nxtMenuTypes from '../../../constants/nxt-menu-types';
import { OCCUPIED } from '../../../constants/nxt-table-statuses';

const useStyles = makeStyles((theme) => ({
  checkoutButtonWrapper: {
    paddingTop: theme.spacing(5),
  },
  checkoutButton: {},
}));
const AppUtility = ({
  appState,
  menuState,
  order,
  setOrder,
  setCart,
  history,
  orderedPackageMenus,
  language,
  staffCall,
  error,
}) => {
  const classes = useStyles();
  const { code: languageCode, data: languageList } = language;
  const {
    restaurantTable,
    orderTransferred,
    orderMergedAndMoved,
    menuStaleBecauseOfPublish,
    screenBlocker,
  } = appState;

  var companyId, branchId, restaurantTableId, menus; // menusStatus
  try {
    companyId = restaurantTable && restaurantTable.data && restaurantTable.data.company.id;
    branchId = restaurantTable && restaurantTable.data && restaurantTable.data.branch.id;
    restaurantTableId = restaurantTable && restaurantTable.data && restaurantTable.data.id;
    const { menus: menusInState } = menuState;
    const { data } = menusInState; // status
    menus = data;
    // menusStatus = status;
  } catch (e) {
    console.warn(e);
  }

  const dispatch = useDispatch();
  const [
    isHappyHourNotificationTimerInitialized,
    setIsHappyHourNotificationTimerInitialized,
  ] = React.useState(false);

  const [
    happyHourReminderRefList,
    setHappyHourReminderRefList,
  ] = React.useState([]);

  const [packageMenuTimers, setPackageMenuTimers] = React.useState([]);
  const [menuSyncTimer, setMenuSyncTimer] = React.useState(null);

  const [t] = useTranslation();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // App initialization logic,

  // App initial data fetch, that do not require api_key
  React.useEffect(() => {
    if (!languageList.length) {
      dispatch(fetchLanguages());
    }

    // load order from sessionStorage.
    const order = getOrderFromSessionStorage();
    if (order) {
      setOrder(order);
    }

    // we only ran this block once on app init.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Data fetch that require api_key
  React.useEffect(() => {
    // after we get branch data we load these data
    if (restaurantTable.data) {
      if (!staffCall.options.data) {
        dispatch(fetchStaffCallOptions());
      }

      // if (menusStatus === apiRequestStatusEnum.idle) {
      //   dispatch(fetchMenus());
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantTable.data, dispatch]);

  // whenever order is updated, rearrange menu with ordered menu
  React.useEffect(() => {
    dispatch(rearrangeMenuWithOrderedMenu());
  }, [order, dispatch]);

  // menu sync with optSlot end

  React.useEffect(() => {
    if (menus && menus.length && !menuSyncTimer) {
      const {
        name,
        optSlotTimeStart,
        optSlotTimeEnd,
        isEndTimeInNextDay,
        menuType,
      } = menus[0];
      const shouldPadAMinute = true;

      let startTimestamp = getTimeStampFromTimeString(optSlotTimeStart);
      let nowTimestamp = new Date().getTime();
      let endTimestamp = getTimeStampFromTimeString(
        optSlotTimeEnd,
        shouldPadAMinute,
      );

      if (isEndTimeInNextDay) {
        const oneDayInMilliSecond = 24 * 60 * 60 * 1000; // hour * min * sec * milli
        if (nowTimestamp > startTimestamp) {
          // add one day with end
          endTimestamp = endTimestamp + oneDayInMilliSecond;
        }
      }

      var closestMenuToExpire = {
        name,
        menuType,
        optSlotEndTimestamp: endTimestamp,
      };

      menus.map((menu) => {
        const {
          name,
          optSlotTimeStart,
          optSlotTimeEnd,
          isEndTimeInNextDay,
          menuType,
        } = menu;

        let startTimestamp = getTimeStampFromTimeString(optSlotTimeStart);
        let nowTimestamp = new Date().getTime();
        let endTimestamp = getTimeStampFromTimeString(
          optSlotTimeEnd,
          shouldPadAMinute,
        );

        if (isEndTimeInNextDay) {
          const oneDayInMilliSecond = 24 * 60 * 60 * 1000; // hour * min * sec * milli
          if (nowTimestamp > startTimestamp) {
            // add one day with end
            endTimestamp = endTimestamp + oneDayInMilliSecond;
          }
        }

        const tempMenu = {
          name,
          menuType,
          optSlotEndTimestamp: endTimestamp,
        };

        if (
          closestMenuToExpire.optSlotEndTimestamp > tempMenu.optSlotEndTimestamp
        ) {
          closestMenuToExpire = tempMenu;
        }

        return null;
      });

      if (closestMenuToExpire) {
        const { name, optSlotEndTimestamp, menuType } = closestMenuToExpire;
        const nowTimeStamp = new Date().getTime();
        let timeout = optSlotEndTimestamp - nowTimeStamp;
        let remindBefore = 5;
        let reminderTimeout = timeout - minuteToMilliSecond(remindBefore);

        if (reminderTimeout > 0 && menuType !== HAPPY_HOUR) {
          setTimeout(() => {
            enqueueSnackbar(
              {
                title: t('common:MenuWillExpireMessage', {
                  name: name,
                  remainingMinutes: remindBefore,
                }),
                message: '',
                variant: 'outlined',
                severity: snackbarTypes.info,
              },
              {
                persist: true,
                // autoHideDuration: 6000,
              },
            );
          }, reminderTimeout);
        }

        if (timeout < 0) {
          timeout = 0;
        }

        let menuSyncTimerRef = setTimeout(() => {
          dispatch(setScreenBlocker(true));

          enqueueSnackbar(
            {
              title: t('common:MenuExpiredMessage', { name }),
              message: (
                <div className={classes.checkoutButtonWrapper}>
                  <IxButton
                    classes={{
                      root: classes.checkoutButton,
                    }}
                    onClick={handleMenuSync}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {t('common:OK')}
                  </IxButton>
                </div>
              ),
              variant: 'outlined',
              hideIconVariant: true,
              severity: snackbarTypes.warning,
            },
            {
              persist: true,
              // autoHideDuration: 6000,
            },
          );
        }, timeout);

        setMenuSyncTimer(menuSyncTimerRef);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus]);

  // order transfer
  React.useEffect(() => {
    if (orderTransferred) {
      handleDisplayCheckoutNotification(t('common:orderTransferMessage'));
    } else if (orderMergedAndMoved) {
      handleDisplayCheckoutNotification(t('common:orderMergedMessage'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderTransferred, orderMergedAndMoved, t]);

  // menu sync after publish
  React.useEffect(() => {
    if (menuStaleBecauseOfPublish) {
      dispatch(setScreenBlocker(true));
      enqueueSnackbar(
        {
          title: t('menus:StaleMenuMessage'),
          message: (
            <div className={classes.checkoutButtonWrapper}>
              <IxButton
                classes={{
                  root: classes.checkoutButton,
                }}
                onClick={handleMenuSyncAfterPublish}
                variant="contained"
                color="primary"
                fullWidth
              >
                {t('common:OK')}
              </IxButton>
            </div>
          ),
          variant: 'outlined',
          hideIconVariant: true,
          severity: snackbarTypes.warning,
        },
        {
          persist: true,
          // autoHideDuration: 6000,
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuStaleBecauseOfPublish]);

  // displaying notification if order fails. TODO refactor
  React.useEffect(() => {
    if (error && error.error === PAYMENT_UNSUCCESSFUL) {
      enqueueSnackbar(
        {
          title: t('common:PaymentUnsuccessfulMessage'),
          message: '',
          variant: 'outlined',
          severity: snackbarTypes.error,
        },
        {
          persist: true,
          // autoHideDuration: 6000,
        },
      );
    }
  }, [error, enqueueSnackbar, t]);

  // Happy hour timer
  React.useEffect(() => {
    if (menus && menus.length ) {
      setIsHappyHourNotificationTimerInitialized(true);
      happyHourReminderRefList.map((ref) => clearInterval(ref));
      setHappyHourReminderRefList([]);
      const refList = [];

      menus.map((menu) => {
        if (menu.menuType === HAPPY_HOUR) {
          const now = new Date();

          let happyHourTimer;
          const {
            name,
            reminderTime,
            optSlotTimeStart,
            optSlotTimeEnd,
            isEndTimeInNextDay,
          } = menu;
          const menuName =
            name && typeof name === 'string' ? name : name[languageCode];

          const [startHours, startMinutes] = optSlotTimeStart.split(':');
          const [endHours, endMinutes] = optSlotTimeEnd.split(':');
          const nowHour = now.getHours();
          const nowMinute = now.getMinutes();

          let optSlotStartTimeInMinutes = +startHours * 60 + +startMinutes;
          let optSlotEndTimeInMinutes = +endHours * 60 + +endMinutes;
          let nowTimeInMinutes = +nowHour * 60 + +nowMinute;

          if (isEndTimeInNextDay) {
            const oneDayInMinutes = 24 * 60; // hour * min
            if (nowTimeInMinutes > optSlotStartTimeInMinutes) {
              // add one day with end
              optSlotEndTimeInMinutes =
                optSlotEndTimeInMinutes + oneDayInMinutes;
            } else {
              // subtract one day from start
              optSlotStartTimeInMinutes =
                optSlotStartTimeInMinutes - oneDayInMinutes;
            }
          }

          const reminderTimeInMinutes =
            optSlotStartTimeInMinutes + +reminderTime;

          if (nowTimeInMinutes < optSlotEndTimeInMinutes) {
            // on this condition we run a timer

            happyHourReminder();
            happyHourTimer = setInterval(() => {
              happyHourReminder();
            }, 120000); // updates every two minutes

            refList.push(happyHourTimer);
            function happyHourReminder() {
              if (
                nowTimeInMinutes >= reminderTimeInMinutes &&
                nowTimeInMinutes <= optSlotEndTimeInMinutes
              ) {
                const remainingMinutes =
                  optSlotEndTimeInMinutes - nowTimeInMinutes;

                enqueueSnackbar(
                  {
                    title: t('common:MenuWillExpireMessage', {
                      name: menuName,
                      remainingMinutes,
                    }),
                    message: '',
                    variant: 'outlined',
                    severity: snackbarTypes.info,
                  },
                  {
                    persist: true,
                    // autoHideDuration: 6000,
                  },
                );
              }
              nowTimeInMinutes += 2;
            }
          } else if (happyHourTimer) {
            clearInterval(happyHourTimer);
          }
        }
        return null;
      });

      setHappyHourReminderRefList(refList);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus]); // only depends on menus

  // package menu reminder
  React.useEffect(() => {
    if (packageMenuTimers.length) {
      packageMenuTimers.map((timer) => timer && clearTimeout(timer));
      setPackageMenuTimers([]); // resetting timer array
    }
    let timerRefs = [];
    if (orderedPackageMenus.length) {
      orderedPackageMenus.map((menu) => {
        if (menu.isTimeBound) {
          const now = new Date();
          const {
            name,
            packageStartTime,
            // timeBoundDuration,
            lastTimeToOrder,
            reminderTime,
          } = menu;
          const menuName =
            name && typeof name === 'string' ? name : name[languageCode];

          const reminderTimeStamp =
            packageStartTime + minuteToMilliSecond(reminderTime);
          const nowTimeStamp = now.getTime();

          if (nowTimeStamp <= reminderTimeStamp) {
            const timeTillNotification = reminderTimeStamp - nowTimeStamp;
            const remainingMinutes = lastTimeToOrder - reminderTime;

            const timer = setTimeout(() => {
              enqueueSnackbar(
                {
                  title: t('common:PackageMenuReminder', {
                    name: menuName,
                    remainingMinutes,
                  }),
                  message: '',
                  variant: 'outlined',
                  severity: snackbarTypes.info,
                },
                {
                  persist: true,
                  // autoHideDuration: 6000,
                },
              );
            }, timeTillNotification);

            timerRefs.push(timer);
          }
        }

        return null;
      });
    }
    setPackageMenuTimers(timerRefs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderedPackageMenus]); // only depends on orderedPackageMenus

  // closeSnackbar
  const getPreviousOrderedItems = () => {
    let previousOrderedItems = [];
    if (order && order.orderMenus) {
      order.orderMenus.map((menu) => {
        const modifiedOrderItems = menu.orderItems.map((item) => {
          return {
            ...item,
            menuId: menu.id,
            isPackage: menu.isPackage,
            packagePrice: menu.packagePrice,
            menuName: menu.name || item.menuName,
          };
        });
        previousOrderedItems = [...previousOrderedItems, ...modifiedOrderItems];
        return menu;
      });
    }
    return previousOrderedItems;
  };

  const handleDisplayCheckoutNotification = (title) => {
    enqueueSnackbar(
      {
        title,
        message: (
          <div className={classes.checkoutButtonWrapper}>
            <IxButton
              classes={{
                root: classes.checkoutButton,
              }}
              onClick={() => handleCheckOut()}
              variant="contained"
              color="primary"
              fullWidth
            >
              {t('common:checkoutBtnLebel')}
            </IxButton>
          </div>
        ),
        variant: 'outlined',
        hideIconVariant: true,
        severity: snackbarTypes.warning,
      },
      {
        persist: true,
        // autoHideDuration: 6000,
      },
    );
  };

  function handleMenuSync() {
    happyHourReminderRefList.map((ref) => clearInterval(ref));
    setIsHappyHourNotificationTimerInitialized(false);
    setHappyHourReminderRefList([]);

    menuSyncTimer && clearTimeout(menuSyncTimer);
    setMenuSyncTimer(null);

    dispatch(fetchMenus());
    redirectToMenu(history);
    setCart();
    closeSnackbar();
    dispatch(setScreenBlocker(false));
  }

  function handleMenuSyncAfterPublish() {
    happyHourReminderRefList.map((ref) => clearInterval(ref));
    setHappyHourReminderRefList([]);
    setIsHappyHourNotificationTimerInitialized(false);

    menuSyncTimer && clearTimeout(menuSyncTimer);
    setMenuSyncTimer(null);

    dispatch(fetchMenus());
    dispatch(setMenuStaleBecauseOfPublish(false));
    history.location.pathname != "/guest-configuration" && redirectToMenu(history);
    setCart();
    closeSnackbar();
    dispatch(setScreenBlocker(false));
  }

  function handleCheckOut() {
    sessionStorage.clear();
    dispatch(resetAppState());
    dispatch(setOrderTransferred(false));
    dispatch(setOrderMergedAndMoved(false));
    dispatch(setMenuStaleBecauseOfPublish(false));
    dispatch(setScreenBlocker(false));
    redirectToHomeForTableBook(history);
    closeSnackbar();
    window.location.reload();
    window.close();
  }

  const orderNotification = async (notifiedOrder) => {
    if (notifiedOrder.status === PAID) {
      dispatch(fetchInvoice());
      setOrder({ data: notifiedOrder, success: true });
      redirectToPaymentHome(history);
      enqueueSnackbar(
        {
          title: t('common:BillPaidMessage'),
          message: '',
          variant: 'outlined',
          severity: snackbarTypes.success,
        },
        {
          persist: true,
          // autoHideDuration: 6000,
        },
      );
    } else {
      if (notifiedOrder.status !== CANCELLED) {
        let updatedItems = [];
        let addedItems = [];
        let removedItems = [];
        let previousOrderedItems = getPreviousOrderedItems();
        if (
          previousOrderedItems &&
          previousOrderedItems.length &&
          notifiedOrder &&
          notifiedOrder.orderMenus
        ) {
          let notifiedOrderedItems = [],
            filteredOrderMenus = [];
          notifiedOrder.orderMenus.map((menu) => {
            if (menu.orderItems) {
              const filteredMenuOrderItems = menu.orderItems.filter(
                (item) => item.status !== CANCELLED,
              ); // filter out the cancelled items
              if (filteredMenuOrderItems.length) {
                filteredOrderMenus = [
                  ...filteredOrderMenus,
                  { ...menu, orderItems: filteredMenuOrderItems },
                ];
              }
              notifiedOrderedItems = [
                ...notifiedOrderedItems,
                ...filteredMenuOrderItems,
              ];
            }
            return null;
          });

          notifiedOrder.orderMenus = filteredOrderMenus; // filtered out the cancelled items

          const prevItems = previousOrderedItems.map((item) => {
            const { id, name } = item;
            return { id, name };
          });
          const notifiedItems = notifiedOrderedItems.map((item) => {
            const { id, name, menuName, itemCode } = item;
            return { id, name, menuName, itemCode };
          });

          let counts = {};
          const mergedItems = [...prevItems, ...notifiedItems];
          const mergedItemsLength = mergedItems.length;
          for (let i = 0; i < mergedItemsLength; i++) {
            counts[mergedItems[i].id] = (counts[mergedItems[i].id] || 0) + 1;
          }

          const uniqueItems = mergedItems.filter(
            (item) => counts[item.id] <= 1,
          );
          // uniqueItems are either added or removed. we will need to compare to find out the case

          // check for update.
          for (let i = 0; i < notifiedOrderedItems.length; i++) {
            const notifiedItem = notifiedOrderedItems[i];
            const prevItem = previousOrderedItems.find(
              (prevItem) => prevItem.id === notifiedItem.id,
            );

            if (
              prevItem &&
              (notifiedItem.quantity !== prevItem.quantity ||
                notifiedItem.specialInstruction !==
                prevItem.specialInstruction ||
                !isEqual(
                  notifiedItem.orderItemChoices,
                  prevItem.orderItemChoices,
                ))
            ) {
              updatedItems = [
                ...updatedItems,
                { id: prevItem.id, name: prevItem.name },
              ];
            }
          }

          // check for add removal
          uniqueItems.map((uniqueItem) => {
            // check for add
            if (
              notifiedItems.findIndex(
                (notifiedItem) => notifiedItem.id === uniqueItem.id,
              ) !== -1
            ) {
              addedItems = [...addedItems, uniqueItem];
            }
            // check for removal
            if (
              prevItems.findIndex(
                (prevItem) => prevItem.id === uniqueItem.id,
              ) !== -1
            ) {
              removedItems = [...removedItems, uniqueItem];
            }
            return uniqueItem;
          });
        }
        let updatedItemNames = '';
        updatedItems.map((item, index) => {
          const length = updatedItems.length;

          const { name: foodItemName, menuName, itemCode } = item;
          const name =
            itemCode === nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE
              ? menuName
              : foodItemName;
          if (name) {
            updatedItemNames +=
              typeof name === 'string' ? name : name[languageCode];
          }

          if (index < length - 1) {
            updatedItemNames += ', ';
          }
          return item;
        });

        let addedItemNames = '';

        addedItems.map((item, index) => {
          const length = addedItems.length;
          const { name: foodItemName, menuName, itemCode } = item;
          const name =
            itemCode === nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE
              ? menuName
              : foodItemName;
          if (name) {
            addedItemNames +=
              typeof name === 'string' ? name : name[languageCode];
          }

          if (index < length - 1) {
            addedItemNames += ', ';
          }
          return item;
        });

        let removedItemNames = '';
        removedItems.map((item, index) => {
          const length = removedItems.length;
          const { name: foodItemName, menuName, itemCode } = item;
          const name =
            itemCode === nxtMenuTypes.PACKAGE_MENU_DEFAULT_FOOD_ITEM_CODE
              ? menuName
              : foodItemName;
          if (name) {
            removedItemNames +=
              typeof name === 'string' ? name : name[languageCode];
          }

          if (index < length - 1) {
            removedItemNames += ', ';
          }
          return item;
        });

        // updating the order in redux store
        setOrder({ data: notifiedOrder, success: true });

        if (updatedItems.length) {
          enqueueSnackbar(
            {
              title: t('common:OrderUpdateTitle'),
              message: updatedItemNames,
              variant: 'outlined',
              severity: snackbarTypes.success,
            },
            {
              persist: true,
              // autoHideDuration: 6000,
            },
          );
        }

        if (addedItems.length) {
          enqueueSnackbar(
            {
              title: t('common:OrderItemAddTitle'),
              message: addedItemNames,
              variant: 'outlined',
              severity: snackbarTypes.success,
            },
            {
              persist: true,
              // autoHideDuration: 6000,
            },
          );
        }

        if (removedItems.length) {
          enqueueSnackbar(
            {
              title: t('common:OrderItemRemoveTitle'),
              message: removedItemNames,
              variant: 'outlined',
              severity: snackbarTypes.error,
            },
            {
              persist: true,
              // autoHideDuration: 6000,
            },
          );
        }
      } else {
        // order cancelled
        let restaurantTableStatus;
        const liveRestaurantInfo = await dispatch(
          fetchLiveRestaurantTableStatus(),
        );
        if (
          liveRestaurantInfo &&
          liveRestaurantInfo.data &&
          liveRestaurantInfo.data.data
        ) {
          restaurantTableStatus = liveRestaurantInfo.data.data.status;
        }

        if (restaurantTableStatus === OCCUPIED) {
          setOrder({});
          setCart();
          redirectToOrderHome(history);

          enqueueSnackbar(
            {
              title: t('common:OrderCancelTitle'),
              // message: t('common:OrderCancelMessage'),
              variant: 'outlined',
              severity: snackbarTypes.error,
            },
            {
              persist: true,
              // autoHideDuration: 6000,
            },
          );
        } else {
          dispatch(setScreenBlocker(true));
          handleDisplayCheckoutNotification(t('common:OrderCancelTitle'));
        }
      }
    }
  };

  const handleNotification = async (payload, topic) => {
    if (topic && topic.includes('order-transfer')) {
      dispatch(setOrderTransferred(true));

      return;
    }

    if (topic && topic.includes('order-merge')) {
      dispatch(setOrderMergedAndMoved(true));

      return;
    }

    if (topic && topic.includes('staff-call')) {
      dispatch(setCurrentCallData(payload));

      return;
    }

    if (topic && topic.includes('menu-publish')) {
      const { id, operationSlot } = payload;

      const isPublishedMenuPresent =
        menus && menus.length ? menus.some((menu) => menu.id === id) : false;

      if (isPublishedMenuPresent) {
        dispatch(setMenuStaleBecauseOfPublish(true));
      } else if (operationSlot && operationSlot.length) {
        for (let i = 0; i < operationSlot.length; i++) {
          const { startTime, endTime, isEndTimeInNextDay } = operationSlot[i];
          const shouldPadAMinute = true;

          let nowTimestamp = new Date().getTime();
          let startTimestamp = getTimeStampFromTimeString(startTime);
          let endTimestamp = getTimeStampFromTimeString(
            endTime,
            shouldPadAMinute,
          );

          if (isEndTimeInNextDay) {
            const oneDayInMilliSecond = 24 * 60 * 60 * 1000; // hour * min * sec * milli
            if (nowTimestamp > startTimestamp) {
              // add one day with end
              endTimestamp = endTimestamp + oneDayInMilliSecond;
            } else {
              // subtract one day from start
              startTimestamp = startTimestamp - oneDayInMilliSecond;
            }
          }

          if (nowTimestamp >= startTimestamp && nowTimestamp <= endTimestamp) {
            dispatch(setMenuStaleBecauseOfPublish(true));
            break;
          }
        }
      }

      return;
    }

    if (topic && topic.includes('order')) {
      await orderNotification(payload);
    }
  };

  return (
    <div>
      {branchId && restaurantTableId ? (
        <SockJsClient
          url={process.env.REACT_APP_BASE_URL + 'nxt-websocket'}
          topics={[
            `/ws-user/${restaurantTableId}/order`,
            `/ws-user/restaurant-table/${restaurantTableId}/order-item`,
            `/ws-user/${restaurantTableId}/order-create`,
            `/ws-user/${restaurantTableId}/order-transfer`,
            `/ws-user/${restaurantTableId}/order-merge`,
            `/ws-user/branch/${branchId}/restaurant-table/${restaurantTableId}/staff-call`,
            `/ws-user/company/${companyId}/branch/${branchId}/menu-publish`,
            `/ws-user/company/${companyId}/menu-publish`,
          ]}
          onMessage={handleNotification}
        />
      ) : (
          ''
        )}

      {(orderTransferred || orderMergedAndMoved || screenBlocker) && (
        <ScreenBlocker></ScreenBlocker>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { appState, menuState, cart, error, language, staffCall } = state;
  return {
    appState,
    menuState,
    language,
    staffCall,
    order: cart.order,
    orderedPackageMenus: cart.orderedPackageMenus,
    error: error,
  };
};
const mapDispatchToProps = {
  setOrder,
  setCart,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppUtility),
);

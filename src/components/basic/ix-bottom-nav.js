import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Badge, Box, CircularProgress } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import RestaurantOutlinedIcon from '@material-ui/icons/RestaurantOutlined';
import NotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';

import IxTitle from './ix-title';
import IxAnimatedBell from './animated-bell/ix-animated-bell';
import {
  bottomNavBackground,
  yellowBaseColor,
  blackLikeBackground
} from '../../constants/theme-colors';
import {
  redirectToMenu,
  redirectToOrderDetail,
  redirectToCart
} from '../../services/utility';

import './bottom-nav-style.css';
import NxtStaffCall from '../business/staff-call/staff-call';
import staffCallStatusEnum from '../../constants/staff-call-status-enum';
import {
  cancelStaffCall,
  resetCurrentCallState,
  setCurrentCallData
} from '../business/staff-call/staff-call-slice';
import apiRequestStatusEnum from '../../constants/api-request-status-enum';

const useStyles = makeStyles(theme => ({
  navLinks: {
    zIndex: theme.zIndex.bottomNav,
    background: bottomNavBackground,
    '& .MuiSvgIcon-root': {
      marginTop: '0.5em'
    },
    '& .MuiGrid-root': {
      textAlign: 'center'
    },

    '& a': {
      textDecoration: 'none',
      color: theme.palette.text.commonSecondaryColor
    },
    '& p': {
      marginBottom: '0.6em',
      fontSize: '0.7rem',
      color: theme.palette.text.commonSecondaryColor
    },
    '& .MuiToggleButton-root, .MuiButtonBase-root': {
      border: 'none !important',
      padding: '0 !important',
      fontSize: '0',
      '& span p': {
        marginTop: '0.4em',
        textTransform: 'capitalize'
      }
    }
  },
  toggledTrue: {
    background: 'red',
    color: 'white',
    '& .MuiSvgIcon-root': {
      color: 'white'
    },
    '& p': {
      color: 'white'
    }
  },
  active: {
    backgroundColor: blackLikeBackground,
    '& .MuiSvgIcon-root': {
      color: yellowBaseColor
    },
    '& .MuiTypography-root': {
      color: yellowBaseColor
    }
  },
  regular: {
    backgroundColor: blackLikeBackground,
    color: theme.palette.text.commonSecondaryColor,
    '& .MuiSvgIcon-root': {
      color: theme.palette.text.commonSecondaryColor
    }
  },
  cartBadge: {
    '& .MuiBadge-badge': {
      top: '.7rem'
    }
  },
  staffCallBtnSpinner: {
    position: 'absolute',
    top: '10px',
    right: '18px',
    color: theme.palette.text.white
  }
}));

function IxBottomNav(props) {
  const dispatch = useDispatch();
  const [staffCallModalOpen, setStaffCallModalOpen] = React.useState(false);
  const [callReceiveAnimation, setCallReceiveAnimation] = React.useState(false);

  const { currentCall } = props;

  React.useEffect(() => {
    if (currentCall.data) {
      const { status, isReceivedAnimationDisplayed } = currentCall.data;

      if (
        status === staffCallStatusEnum.ACCEPTED &&
        !isReceivedAnimationDisplayed
      ) {
        setCallReceiveAnimation(true);
        const updatedCurrentCallData = {
          ...currentCall.data,
          isReceivedAnimationDisplayed: true
        };
        // updating the staff call state so that we do not display the call received animation multiple time
        dispatch(setCurrentCallData(updatedCurrentCallData));
      }
    }
  }, [currentCall.data, dispatch]);

  const { t } = useTranslation(['common']);
  const classes = useStyles();

  const pathname =
    props.props.history &&
    props.props.history.location &&
    props.props.history.location.pathname
      ? props.props.history.location.pathname
      : '';

  const { cartItemCount } = props;
  const history = useHistory();

  const handleStaffCallModalOpen = () => {
    dispatch(resetCurrentCallState());
    setStaffCallModalOpen(true);
  };

  return (
    <div className={classes.navLinks}>
      <Grid container direction='row'>
        <Grid
          item
          xs={3}
          className={
            pathname.includes('/menus') ? classes.active : classes.regular
          }
        >
          <Box
            onClick={() => {
              redirectToMenu(history);
            }}
          >
            {/* <Icon>restaurant</Icon> */}
            <RestaurantOutlinedIcon>restaurant</RestaurantOutlinedIcon>
            <IxTitle
              text={t('navBottomMenu')}
              alignment='center'
              variant='body2'
            ></IxTitle>
          </Box>
        </Grid>
        <Grid
          item
          xs={3}
          className={
            pathname.includes('/cart') ? classes.active : classes.regular
          }
        >
          <Box
            onClick={() => {
              redirectToCart(history);
            }}
          >
            <Badge
              color='primary'
              badgeContent={cartItemCount}
              className={classes.cartBadge}
            >
              <ShoppingCartOutlinedIcon />
            </Badge>

            <IxTitle
              text={t('navBottomCart')}
              alignment='center'
              variant='body2'
            ></IxTitle>
          </Box>
        </Grid>
        <Grid
          item
          xs={3}
          className={
            pathname.includes('/order-detail')
              ? classes.active
              : classes.regular
          }
        >
          <Box
            onClick={() => {
              redirectToOrderDetail(history);
            }}
          >
            {/* <Icon>list_alt</Icon> */}
            <ListAltOutlinedIcon></ListAltOutlinedIcon>
            <IxTitle
              text={t('navBottomOrder')}
              alignment='center'
              variant='body2'
            ></IxTitle>
          </Box>
        </Grid>

        {currentCall.data &&
        currentCall.data.status === staffCallStatusEnum.WAITING ? (
          <Grid className={classes.toggledTrue} item xs={3}>
            <Box
              onClick={() =>
                currentCall.status !== apiRequestStatusEnum.loading &&
                dispatch(cancelStaffCall())
              }
            >
              {/* <NotificationsActiveOutlinedIcon></NotificationsActiveOutlinedIcon> */}
              <IxAnimatedBell></IxAnimatedBell>
              {currentCall.status === apiRequestStatusEnum.loading && (
                <CircularProgress
                  classes={{ root: classes.staffCallBtnSpinner }}
                  size={10}
                ></CircularProgress>
              )}

              <IxTitle
                text={t('navBottomStaffCall')}
                alignment='center'
                variant='body2'
              ></IxTitle>
            </Box>
          </Grid>
        ) : (
          <Grid item xs={3} className={classes.regular}>
            <Box
              onClick={handleStaffCallModalOpen}
              className={callReceiveAnimation ? 'call-received-by-staff' : ''}
            >
              <NotificationsActiveOutlinedIcon
                classes={{ root: classes.regular }}
              ></NotificationsActiveOutlinedIcon>
              <IxTitle
                text={t('navBottomStaffCall')}
                alignment='center'
                variant='body2'
              ></IxTitle>
            </Box>
          </Grid>
        )}
      </Grid>

      <NxtStaffCall
        open={staffCallModalOpen}
        onClose={() => {
          setStaffCallModalOpen(false);
        }}
      ></NxtStaffCall>
    </div>
  );
}

const mapStateToProps = state => {
  let cartItemCount = 0;
  if (state.cart.items && state.cart.items.length) {
    cartItemCount += state.cart.items.length;
  }

  return {
    order: state.cart && state.cart.order,
    cartItemCount,
    currentCall: state.staffCall.currentCall
  };
};
export default connect(mapStateToProps, null)(IxBottomNav);

import React from 'react';
import SockJsClient from 'react-stomp';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Avatar from '../../../assets/imgs/common/avatar.png';
import PageFeatureImg from '../../../assets/imgs/order/next_user_onboarding_scan_table_code_2x.png';
import IxButton from '../../basic/ix-button';
import { Typography } from '@material-ui/core';
import NxtTopBar from '../../basic/nxt-top-bar';
import StaticBottom from '../../basic/ix-static-bottom-nav';
import NotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';
import { getStaffCallId, getTableInformationFromSessionStorage } from '../../../actions/nxt-local-storage';
import { connect } from 'react-redux';
import { addStaffCall, cancelStaffCall } from '../../../actions/nxt-order-action';
import IxAnimatedBell from '../../basic/animated-bell/ix-animated-bell';
import '../../basic/bottom-nav-style.css';

const useStyles = makeStyles((theme) => ({
  thisRoot: {
    textAlign: 'center',
  },
  imgGrid: {
    //margin: '1.5em 1em',
  },
  img: {
    paddingTop: '1em',
    paddingBottom: '2em',
    width: '20em',
  },
  logo: {
    paddingTop: '3em',
    width: '5.5em',
  },
  thisP: {
    marginBottom: '1.5em',
    padding: '0 1.5em',
    textAlign: 'center',
    color: theme.palette.border.commonSecondaryColor,
    fontSize: '0.85em',
  },
  thish2: {
    marginBottom: '0em',
    marginTop: '0.5em',
    color: theme.palette.border.secondary,
  },
  thisClickText: {
    fontWeight: 'bold',
    marginBottom: '0.5em',
    color: '#297fca',
  },
  thisLink: {
    textDecoration: 'none',
    color: '#297fca',
  },
  btnManually: {
    height: '3.2em',
  },

  thisButton: {
    padding: '1em 0',
    width: '100%',
    backgroundColor: '#3fa2f7',
    borderColor: '#3fa2f7',
    color: 'white',
  },
  thisOutlineButton: {
    padding: '1em 0',
    width: '100%',
    backgroundColor: '#ffffff',
    borderColor: '#3fa2f7',
    color: '#3fa2f7',
  },
  thisTop: {
    padding: '0 1em',
  },
  btnQrcode: {
    marginBottom: '1em',
  },
}));

function ChooseTableBookMethod(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const tableInfo = JSON.parse(getTableInformationFromSessionStorage());
  const { companyId, branchId, restaurantTableId } = tableInfo;
  const { addStaffCall, cancelStaffCall } = props;
  const formData = {
    companyId: companyId,
    branchId: branchId,
    restaurantTableId: restaurantTableId,
  };

  const handleToggleStaffCall = () => {
    if (calling === true) {
      setCalling(false);
      // setCallReceiveAnimation(false);
      const id = getStaffCallId();
      cancelStaffCall(id);
    }
    if (calling === false) {
      setCalling(true);
      addStaffCall(formData);
    }
  };

  const staffCallAnswered = (response) => {
    if (response.status === 'ACCEPTED') {
      setCalling(false);
      // setCallReceiveAnimation(true);
    }
  };

  const [calling, setCalling] = React.useState(false);
  // const [callReceiveAnimation, setCallReceiveAnimation] = React.useState(false);

  return (
    <div className={classes.thisRoot}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid className={classes.thisTop} item xs={12}>
          <NxtTopBar className={classes.topNav}></NxtTopBar>
        </Grid>
        <Grid className={classes.imgGrid} item xs={12}>
          <img className={classes.logo} src={Avatar} alt="" />
        </Grid>
        <Grid className="scan-title" item xs={12}>
          <Typography variant="h4">
            {t('scan:greeting')}
            {' ' + t('scan:Guest')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <p className={classes.thisP}>{t('scan:description')}</p>
        </Grid>
        <Grid className={classes.imgGrid} item xs={12}>
          <img className={classes.img} src={PageFeatureImg} alt="" />
        </Grid>
        <StaticBottom>
          <IxButton
            className={classes.btnQrcode}
            onClick={() => {
              props.history.push('/scan-qr-code');
            }}
            variant="contained"
            fullWidth
            color="primary"
          >
            {t('scan:btnScanCode')}
          </IxButton>

          <IxButton
            onClick={() => {
              handleToggleStaffCall();
            }}
            className={classes.btnManually}
            // className={callReceiveAnimation ? 'call-received-by-staff' : ''}
            endIcon={calling ? <IxAnimatedBell /> : <NotificationsActiveOutlinedIcon />}
            variant="contained"
            fullWidth
            color="primary"
          >
            {t('common:navBottomStaffCall')}
          </IxButton>
        </StaticBottom>
      </Grid>
      <SockJsClient
        url={process.env.REACT_APP_BASE_URL + 'nxt-websocket'}
        topics={[`/ws-user/branch/${branchId}/restaurant-table/${restaurantTableId}/staff-call`]}
        onMessage={(response) => staffCallAnswered(response)}
        // ref={(client) => { this.clientRef = client }}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    order: state.cart && state.cart.order,
  };
};

const mapDispatchToProps = {
  addStaffCall,
  cancelStaffCall,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseTableBookMethod);

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import NxtLayout from '../../composite/nxt-layout.js';
import IxTxtBox from '../../basic/ix-txt-box.js';
import OrderTopbarWithBorder from '../../basic/nxt-topbar-with-bottom-border.js';
import styles from './style.js';
import BasicBottomLinks from '../../basic/nxt-basic-bottom-links.js';
import BasicTipBottom from '../../basic/nxt-tip-bottom-bar.js';
import { setTipConfig } from '../../../actions/nxt-order-action';

function TipHome(props) {
  const classes = styles();
  const { t } = useTranslation(['common']);
  const [tipAmount, setTipAmount] = React.useState('No Tip');
  const [tipReceiver, setTipReceiver] = React.useState('RESTAURANT');
  const [tipConfigs, setTipConfigs] = React.useState(null);
  const [staffConfigs, setStaffConfigs] = React.useState(null);
  const [selectedStaff, setSelectedStaff] = React.useState(null);
  const [fixedAmount, setFixedAmount] = React.useState(0);
  const dispatch = useDispatch();

  const {
    appState,
    paymentState,
    order,
    history,
    handleGetTipConfigs,
    handleGetStaffConfigs
  } = props;

  let restaurantTableData,
    companyConfigData,
    companyId,
    branchId,
    tableCode,
    restaurantTableId,
    tableNumber;

  try {
    const { restaurantTable, companyConfig } = appState;
    restaurantTableData = restaurantTable.data;
    companyConfigData = companyConfig.data;
    restaurantTableId = restaurantTableData.id;
    tableNumber = restaurantTableData.tableNo;
    tableCode = restaurantTableData.tableCode;
    companyId = restaurantTableData.company.id;
    branchId = restaurantTableData.branch.id;
  } catch (e) {
    console.warn(e);
  }

  useEffect(() => {
    async function fetchTipsAPI() {
      let response = await handleGetTipConfigs(companyId, branchId);
      response && response.data && setTipConfigs(response.data.data);
    }

    async function fetchStaffAPI() {
      let response = await handleGetStaffConfigs(companyId, branchId);
      response && response.data && setStaffConfigs(response.data.data);
    }

    fetchTipsAPI();
    fetchStaffAPI();
  }, []);

  const { takeAwayTax = 0, eatInTax = 0, payable = 0 } = order ? order : {};

  const handleChangeTipAmount = event => {
    setTipAmount(event.target.value);
  };

  const handleChangeTipReceiver = event => {
    setTipReceiver(event.target.value);
  };

  const handleChangeSelectedStaff = event => {
    setSelectedStaff(parseInt(event.target.value));
  };

  const handleFixedTipAmount = event => {
    setFixedAmount(event.target.value);
  };
  const getTipType = tipAmount => {
    if (tipAmount === 'No Tip') {
      return 'NO_TIP';
    } else if (tipAmount === 'Fixed Tip') {
      return 'FIXED_AMOUNT';
    } else {
      return 'PERCENTAGE';
    }
  };

  const getTipAmount = (amount, tip) => {
    let tipAppliedAmount = amount;
    //let tipAppliedAmount = amount - eatInTax - takeAwayTax;
    let percentAmount = 0;

    if (tip === 'No Tip') {
      percentAmount = 0;
    } else if (tip === 'Fixed Tip') {
      percentAmount = fixedAmount ? parseInt(fixedAmount) : 0;
    } else {
      percentAmount = tip * (tipAppliedAmount / 100);
    }

    if (Number.isInteger(percentAmount)) {
      return percentAmount;
    } else {
      return parseFloat(percentAmount.toFixed(2));
    }
  };

  let tipRelatedPayload = {
    receiverStaffId: tipReceiver === 'RESTAURANT' ? 0 : selectedStaff, // this will be 0 if receiverOption = RESTAURANT
    receiverOption: tipReceiver, // or STAFF
    tipAmountOption: getTipType(tipAmount), // or NO_TIP or  PERCENTAGE
    tipPercentage: isNaN(parseInt(tipAmount)) ? 0 : parseInt(tipAmount), // or any % if tipAmountOption = PERCENTAGE
    // tipAmount: isNaN(parseInt(tipAmount))
    //   ? 0
    //   : getPercentageAmount(payable, parseInt(tipAmount))
    tipAmount: getTipAmount(payable, tipAmount)
  };

  useEffect(() => {
    dispatch(setTipConfig(tipRelatedPayload));
  }, [tipAmount, tipReceiver, selectedStaff, fixedAmount]);

  return (
    <div>
      <NxtLayout
        header={
          <OrderTopbarWithBorder isBackAro={true}>
            <IxTxtBox
              className={classes.attributeItem}
              align='left'
              primary={t('orderr:tableName') + ' ' + tableNumber}
              primaryVariant='caption'
              secondary={t('orderr:Order Number') + ' ' + order?.displayOrderNo}
              secondaryVariant='h6'
            ></IxTxtBox>
          </OrderTopbarWithBorder>
        }
      >
        <IxTxtBox
          className={classes.tipHeader}
          align='left'
          primary={t('orderr:addATip')}
          primaryVariant='h6'
        ></IxTxtBox>

        <div className={classes.tipsButtonContainer}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>
              <small>{t('orderr:chooseTipAmount')}</small>
            </FormLabel>
            <RadioGroup
              aria-label='tips'
              name='tipsAmount'
              onChange={handleChangeTipAmount}
            >
              {tipConfigs?.tipAmountOptions?.noTip && (
                <FormControlLabel
                  value={'No Tip'}
                  control={
                    <Radio color='primary' checked={tipAmount === 'No Tip'} />
                  }
                  label={t('orderr:noTip')}
                />
              )}
              {tipConfigs?.tipAmountOptions?.percentageOptions.length > 0 &&
                tipConfigs?.tipAmountOptions?.percentageOptions?.map(
                  (e, index) => (
                    <FormControlLabel
                      key={index}
                      value={e}
                      control={
                        <Radio
                          color='primary'
                          checked={tipAmount === e.toString()}
                        />
                      }
                      label={e + '%'}
                    />
                  )
                )}
              {tipConfigs?.tipAmountOptions?.fixedAmount && (
                <FormControlLabel
                  value={'Fixed Tip'}
                  control={
                    <Radio
                      color='primary'
                      checked={tipAmount === 'Fixed Tip'}
                    />
                  }
                  label={t('orderr:fixedAmount')}
                />
              )}
            </RadioGroup>
            {tipAmount === 'Fixed Tip' && (
              <TextField
                label={t('orderr:enterAmountHere')}
                type='number'
                value={fixedAmount}
                onChange={handleFixedTipAmount}
                variant='outlined'
                className={classes.staffTextField}
              />
            )}

            <FormLabel component='legend' className={classes.tipReceiverTitle}>
              <small>{t('orderr:chooseTipReceiver')}</small>
            </FormLabel>
            <RadioGroup
              aria-label='tips-receiver'
              name='tipsReceiver'
              onChange={handleChangeTipReceiver}
            >
              {tipConfigs?.receiverOptions?.RESTAURANT && (
                <FormControlLabel
                  value='RESTAURANT'
                  control={
                    <Radio
                      color='primary'
                      checked={tipReceiver === 'RESTAURANT'}
                    />
                  }
                  label={t('orderr:restaurant')}
                />
              )}
              {tipConfigs?.receiverOptions?.STAFF && (
                <FormControlLabel
                  value='STAFF'
                  control={
                    <Radio color='primary' checked={tipReceiver === 'STAFF'} />
                  }
                  label={t('orderr:staff')}
                />
              )}
            </RadioGroup>

            {tipReceiver === 'STAFF' && (
              <TextField
                //id='outlined-select-currency-native'
                select
                label={t('orderr:selectStaff')}
                value={selectedStaff}
                onChange={handleChangeSelectedStaff}
                // SelectProps={{
                //   native: true
                // }}
                variant='outlined'
                className={classes.staffTextField}
              >
                {staffConfigs?.map(option => (
                  <option key={option.id} value={option.id}>
                    {option?.user?.firstName} {''} {option?.user?.lastName}
                  </option>
                ))}
              </TextField>
            )}
          </FormControl>
        </div>
      </NxtLayout>

      <Grid container direction='column'>
        <BasicTipBottom order={order}></BasicTipBottom>
        <BasicBottomLinks
          history={history}
          rightChildText={t('Continue')}
          rightChildLink={'/order/payment'}
        ></BasicBottomLinks>
      </Grid>
    </div>
  );
}

export default TipHome;

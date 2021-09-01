import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import IxDialogue from '../../basic/ix-dialogue';

import icons from '../../../assets/imgs/staff-call-orange';
import { createStaffCall } from './staff-call-slice';
import apiRequestStatusEnum from '../../../constants/api-request-status-enum';
import StaffCallOptionView from './staff-call-option-view';

const minimumOptionItemCount = 1;
const maximumOptionItemCount = 999999999;
const operatorSubtract = '-';
const operatorAddition = '+';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: '80%',
    maxHeight: 435,
    zIndex: theme.zIndex.modal,
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function NxtStaffCall({ open, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const staffCallOptionsData = useSelector(
    (state) => state.staffCall.options.data,
  );
  let currentCall = useSelector((state) => state.staffCall.currentCall);
  let staffCallOptions = [];
  if (
    staffCallOptionsData &&
    staffCallOptionsData.staffCallOptions &&
    staffCallOptionsData.staffCallOptions.length
  ) {
    staffCallOptions = staffCallOptionsData.staffCallOptions;
  }

  const optionsObj = {};

  const getOptionsObj = (staffCallOptions) => {
    const optionsObj = {};
    staffCallOptions.map(
      (option) =>
        (optionsObj[option] = {
          displayLabel: t(option),
          value: false,
          count: minimumOptionItemCount,
        }),
    );
    return optionsObj;
  };

  const [options, setOptions] = useState(optionsObj);

  useEffect(() => {
    if (staffCallOptions && staffCallOptions.length) {
      const optionsObj = getOptionsObj(staffCallOptions);
      setOptions(optionsObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffCallOptions, t]);

  const handleStaffCallOptionChange = (e) => {
    const { name, checked } = e.target;
    setOptions({ ...options, [name]: { ...options[name], value: checked } });
  };

  const handleStaffCallOptionQuantityChange = (operator, key) => {
    let count = options[key].count;
    if (operator === operatorSubtract) {
      if (count > minimumOptionItemCount) {
        count = count - 1;
      }
    } else if (operator === operatorAddition) {
      if (count < maximumOptionItemCount) {
        count = count + 1;
      }
    }

    setOptions({ ...options, [key]: { ...options[key], count } });
  };

  const handlePlaceStaffCall = async () => {
    let selectedOptions = '';
    Object.entries(options).map(([key, value]) => {
      if (value.value) {
        selectedOptions += key + '|' + value.count + ',';
      }
      return null;
    });

    const response = await dispatch(createStaffCall(selectedOptions));
    if (response && response.data && response.data.success) {
      onClose();
      // resetting options
      if (staffCallOptions && staffCallOptions.length) {
        const optionsObj = getOptionsObj(staffCallOptions);
        setOptions(optionsObj);
      }
    }
  };

  return (
    <div className={classes.root}>
      <IxDialogue
        classes={{
          paper: classes.paper,
        }}
        id="staff-call-dialogue"
        keepMounted
        open={open}
        onClose={onClose}
        onOk={handlePlaceStaffCall}
        title={t('StaffCallModalTitle')}
        cancelText={t('StaffCallCancelBtnLabel')}
        okText={t('StaffCallOkBtnLabel')}
        isLoadingOkAction={currentCall.status === apiRequestStatusEnum.loading}
      >
        <div className={classes.contentWrapper}>
          {staffCallOptions.length ? (
            Object.entries(options).map(([key, value]) => (
              <StaffCallOptionView
                key={key}
                label={value.displayLabel}
                name={key}
                value={key}
                checked={value.value}
                handleChange={handleStaffCallOptionChange}
                icon={icons[key]}
                count={value.count}
                operatorSubtract={operatorSubtract}
                operatorAddition={operatorAddition}
                handleStaffCallOptionQuantityChange={(operator) =>
                  handleStaffCallOptionQuantityChange(operator, key)
                }
              />
            ))
          ) : (
            <Typography>{t('common:noStaffCallOptionsMessage')}</Typography>
          )}
        </div>
      </IxDialogue>
    </div>
  );
}

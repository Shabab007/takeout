import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import IxButton from '../../basic/ix-button';
import IxTitle from '../../basic/ix-title';
import { Grid, Typography } from '@material-ui/core';

import { IMAGE_URL } from '../../../constants/ix-image-links';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    margin: '0 1.5em',
    '& h4': {
      fontSize: '1.7rem',
    },
  },
  img: {
    width: '15em',
    marginTop: '4em',
    marginBottom: '1em',
  },
  address: {
    //marginTop: '0',
  },
  floorNo: {
    marginTop: '6em',
    marginBottom: '0.5em',
    color: theme.palette.text.commonSecondaryColor,
    '& .MuiTypography-subtitle1': {
      fontSize: '1rem',
    },
  },
  nextBtn: {
    marginTop: '6.5em',
  },
  btnReorder: {
    marginTop: '1em',
    height: '3.2em',
  },
}));

function TableHome(props) {
  const classes = useStyles();
  const { t } = useTranslation(['orderr']);
  const { history, appState } = props;

  let restaurantTableData = appState.restaurantTable.data;

  let companyId, address, imgId, tableNumber, restaurantName, sectionFloor;

  try {
    tableNumber = restaurantTableData.tableNo;
    restaurantName = restaurantTableData.branch.name;
    address = restaurantTableData.company.address;
    companyId = restaurantTableData.company.id;
    sectionFloor = restaurantTableData.section.id;
    imgId = restaurantTableData.company.logo;
  } catch (e) {
    console.warn(e);
  }

  const imageSrc = imgId ? IMAGE_URL + companyId + '/images/' + imgId : null;
  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid className={classes.imgGrid} item xs={12}>
          <img className={classes.img} src={imageSrc} alt="" />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes.thish2} variant="h4">
          {restaurantName}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <p className={classes.address}>{address}</p>
      </Grid>
      <Grid className={classes.floorNo} item xs={12}>
        <IxTitle variant="subtitle1">
          {t('Floor')} -{sectionFloor}
        </IxTitle>
      </Grid>
      <Grid className={classes.tableNo} item xs={12}>
        <IxTitle variant="h4">
          {t('tableName')}
          {tableNumber}
        </IxTitle>
      </Grid>
      <Grid className={classes.nextBtn} item xs={12}>
        <IxButton
          fullWidth
          onClick={() => history.push('/guest-configuration')}
          variant="contained"
          color="primary"
        >
          {t('enterNumberOfGuestBtn')}
        </IxButton>
      </Grid>
      <Grid item xs={12}>
        <IxButton
          fullWidth
          className={classes.btnReorder}
          variant="outlined"
          color="primary"
          onClick={() => window.close()}
        >
          {t('cancelAndCheckoutBtn')}
        </IxButton>
      </Grid>
    </div>
  );
}

export default TableHome;

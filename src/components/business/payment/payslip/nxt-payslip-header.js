import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, makeStyles } from '@material-ui/core';
import IxTxtBox from '../../../basic/ix-txt-box';
import { IMAGE_URL } from '../../../../constants/ix-image-links';

const useStyles = makeStyles((theme) => ({
  companyDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent:
  },
}));

function Header({ logo, header = {} }) {
  const classes = useStyles();
  let { branchName, companyName, branchAddress, phone, note } = header;

  branchName = branchName ? branchName: '';
  companyName = companyName ? companyName: '';
  branchAddress = branchAddress ? branchAddress : '';
  phone = phone? phone : '';
  note = note ? note : '';

  const name = branchName + ', ' + companyName;
  const restaurantTable = useSelector(
    (store) => store.appState.restaurantTable,
  );

  let companyId;
  try {
    companyId = restaurantTable.data.company.id;
  } catch (e) {
    console.warn(e);
  }

  const imageSrc = logo ? IMAGE_URL + companyId + '/images/' + logo : null;
  return (
    <Grid container>
      <Grid
        className="tradeMark"
        style={{ padding: '0 15%' }}
        container
        direction="row"
      >
        {imageSrc && (
          <img
            className="logo"
            style={{
              maxWidth: '90%',
              height: 'auto',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            src={imageSrc}
            alt="Logo"
          />
        )}
      </Grid>

      <Grid
        className={classes.companyDetails}
        justify="center"
        container
        direction="row"
        style={{ padding: '1em 1%' }}
      >
        {name && (
          <div>
            <IxTxtBox primary={name} primaryVariant="subtitle2"></IxTxtBox>
          </div>
        )}

        {branchAddress && (
          <div>
            <IxTxtBox
              primary={branchAddress}
              primaryVariant="subtitle2"
            ></IxTxtBox>
          </div>
        )}

        {phone && (
          <div>
            <IxTxtBox primary={phone} primaryVariant="subtitle2"></IxTxtBox>
          </div>
        )}

        {note && (
          <div>
            <IxTxtBox primary={note} primaryVariant="subtitle2"></IxTxtBox>
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default Header;

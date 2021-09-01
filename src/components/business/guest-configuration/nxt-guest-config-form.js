import React from 'react';
import { makeStyles, Grid, Box, Icon, Divider, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { updateGuestCount } from '../../../services/guest';
import { MALE, FEMALE, KIDS, OTHERS } from '../../../constants/order-status';
import IxButton from '../../basic/ix-button';
import IxTxtBox from '../../basic/ix-txt-box';

const useStyles = makeStyles((theme) => ({
  leftChild: {
    color: theme.palette.text.guestNameText,
    fontSize: theme.typography.guestConfig.fontSize,
    // fontWeight: 'bold',
    paddingLeft: '1.2em',
    marginBottom: '0.8em',
    marginTop: '0.8em',
  },
  rightChild: {
    paddingRight: '1.2em',
    display: 'flex',
    float: 'right',
    marginBottom: '0.8em',
    marginTop: '0.8em',
  },
  leftChildMale: {
    color: theme.palette.text.guestNameText,
    fontSize: theme.typography.guestConfig.fontSize,
    // fontWeight: 'bold',
    paddingLeft: '1.2em',
    marginBottom: '0.8em',
    marginTop: '1.8em',
  },
  rightChildMale: {
    paddingRight: '1.2em',
    display: 'flex',
    float: 'right',
    marginBottom: '0.8em',
    marginTop: '1.8em',
  },

  elements: {
    border: '1px solid #cccccc',
    borderRadius: '3px',
    padding: '0 3px',
  },
  icons: {
    color: 'red',
    fontSize: 20,
  },
  countNo: {
    color: theme.palette.text.secondary,
    fontSize: '22px',
    marginLeft: '0.7em',
    marginRight: '0.7em',
    marginBottom: '0.2em',
  },
  countNoUp: {
    color: theme.palette.text.primary,
    fontSize: '22px',
    marginLeft: '0.7em',
    marginRight: '0.7em',
    marginBottom: '0.2em',
  },
  BottomButton: {
    height: '2.5rem !important',
    float: 'right',
    marginTop: theme.spacing(1),
  },
  errorMessage: {
    color: theme.palette.text.primary,
  },
}));

const NxtGuestConfigForm = ({ guest, orderId, handleClose }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = React.useState();
  const [state, setState] = React.useState({
    male: 0,
    female: 0,
    kid: 0,
    others: 0,
  });

  React.useEffect(() => {
    let { male = 0, female = 0, kid = 0, others = 0 } = guest ? guest : {};
    setState({
      male: male,
      female: female,
      kid: kid,
      others: others,
    });
  }, [guest]);

  const handleRemove = (index) => {
    if (index === 'male') {
      if (state.male !== 0) {
        setState({
          ...state,
          male: state.male - 1,
        });
      }
    }
    if (index === 'female') {
      if (state.female !== 0) {
        setState({
          ...state,
          female: state.female - 1,
        });
      }
    }
    if (index === 'others') {
      if (state.others !== 0) {
        setState({
          ...state,
          others: state.others - 1,
        });
      }
    }
    if (index === 'kid') {
      if (state.kid !== 0) {
        setState({
          ...state,
          kid: state.kid - 1,
        });
      }
    }
  };

  const handleAdd = (index) => {
    if (index === 'male') {
      setState({
        ...state,
        male: state.male + 1,
      });
    }
    if (index === 'female') {
      setState({
        ...state,
        female: state.female + 1,
      });
    }
    if (index === 'others') {
      setState({
        ...state,
        others: state.others + 1,
      });
    }
    if (index === 'kid') {
      setState({
        ...state,
        kid: state.kid + 1,
      });
    }
  };

  const handleUpdateGuestSubmit = async () => {
    if (state.male === 0 && state.female === 0 && state.kid === 0 && state.others === 0) {
      setErrorMessage(t('common:requiredValidationGuestConfig'));
      return;
    }

    let orderGuests = [];
    if (state.female > 0) {
      orderGuests.push({
        guestCategory: FEMALE,
        noOfPerson: state.female,
      });
    }
    if (state.kid > 0) {
      orderGuests.push({ guestCategory: KIDS, noOfPerson: state.kid });
    }
    if (state.male > 0) {
      orderGuests.push({ guestCategory: MALE, noOfPerson: state.male });
    }
    if (state.others > 0) {
      orderGuests.push({ guestCategory: OTHERS, noOfPerson: state.others });
    }

    const response = await updateGuestCount(orderId, orderGuests);
    if (response && response.success) {
      console.log(response);
      handleClose();
    }
  };

  return (
    <div>
      <Grid container direction="row">
        <IxTxtBox
          className="errorMeg"
          secondary={errorMessage}
          secondaryVariant="subtitle2"
          secondaryClassName={classes.errorMessage}
        ></IxTxtBox>
        <Grid container className={classes.leftChildMale} justify="flex-start" item xs={6}>
          {t('orderr:guestConfigMaleLabel')}
        </Grid>
        <Grid container className={classes.rightChildMale} justify="flex-end" item xs={6} spacing={2}>
          <Box className={classes.elements}>
            <Icon onClick={() => handleRemove('male')} className={classes.icons}>
              remove
            </Icon>
            {state.male === 0 ? (
              <Box component="span" className={classes.countNo}>
                {state.male}
              </Box>
            ) : (
              <Box component="span" className={classes.countNoUp}>
                {state.male}
              </Box>
            )}

            <Icon onClick={() => handleAdd('male')} className={classes.icons}>
              add
            </Icon>
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <Grid container direction="row">
        <Grid container className={classes.leftChild} justify="flex-start" item xs={6}>
          {t('orderr:guestConfigFemaleLabel')}
        </Grid>
        <Grid container className={classes.rightChild} justify="flex-end" item xs={6} spacing={2}>
          <Box className={classes.elements}>
            <Icon onClick={() => handleRemove('female')} className={classes.icons}>
              remove
            </Icon>
            {state.female === 0 ? (
              <Box component="span" className={classes.countNo}>
                {state.female}
              </Box>
            ) : (
              <Box component="span" className={classes.countNoUp}>
                {state.female}
              </Box>
            )}
            <Icon onClick={() => handleAdd('female')} className={classes.icons}>
              add
            </Icon>
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <Grid container direction="row">
        <Grid container className={classes.leftChild} justify="flex-start" item xs={6}>
          {t('orderr:guestConfigOthersLabel')}
        </Grid>
        <Grid container className={classes.rightChild} justify="flex-end" item xs={6} spacing={2}>
          <Box className={classes.elements}>
            <Icon onClick={() => handleRemove('others')} className={classes.icons}>
              remove
            </Icon>
            {state.others === 0 ? (
              <Box component="span" className={classes.countNo}>
                {state.others}
              </Box>
            ) : (
              <Box component="span" className={classes.countNoUp}>
                {state.others}
              </Box>
            )}
            <Icon onClick={() => handleAdd('others')} className={classes.icons}>
              add
            </Icon>
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <Grid container direction="row">
        <Grid container className={classes.leftChild} justify="flex-start" item xs={6}>
          {t('orderr:guestConfigKidLabel')}
        </Grid>
        <Grid container className={classes.rightChild} justify="flex-end" item xs={6} spacing={2}>
          <Box className={classes.elements}>
            <Icon onClick={() => handleRemove('kid')} className={classes.icons}>
              remove
            </Icon>
            {state.kid === 0 ? (
              <Box component="span" className={classes.countNo}>
                {state.kid}
              </Box>
            ) : (
              <Box component="span" className={classes.countNoUp}>
                {state.kid}
              </Box>
            )}
            <Icon onClick={() => handleAdd('kid')} className={classes.icons}>
              add
            </Icon>
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <Grid className={classes.navBottom} container direction="row-reverse">
        {/* <IxButton variant="contained" color="primary" onClick={handleUpdateGuestSubmit}>
          update
        </IxButton> */}
        <IxButton
          className={classes.BottomButton}
          onClick={() => {
            handleUpdateGuestSubmit();
          }}
          variant="contained"
          color="primary"
        >
          <Box className={classes.btnLinks}></Box>
          <Typography variant="h6">{t('orderr:update')}</Typography>
          <Icon className={classes.nextLink}>navigate_next</Icon>
        </IxButton>
      </Grid>
    </div>
  );
};

export default NxtGuestConfigForm;

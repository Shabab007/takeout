import React, { Suspense, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { addOrderGuests } from '../../../actions/nxt-order-action';
import NxtFallback from '../../basic/nxt-fallback.js';
import {
  Box,
  Divider,
  Icon,
  IconButton,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import BasicBottomLinks from '../../basic/nxt-basic-bottom-links.js';
import IxTitle from '../../basic/ix-title';
import {
  setGuestConfigToSessionStorage,
  getGuestConfigFromSessionStorage
} from '../../../actions/nxt-local-storage';
import IxTxtBox from '../../basic/ix-txt-box.js';
import './style.js';
import {
  IS_FIRST_VISIT_ANSWER_NO,
  IS_FIRST_VISIT_ANSWER_YES,
  IS_FIRST_VISIT
} from '../../../constants/ix-enums';
import { isFirstVisitQA, getRecommendedMenus } from '../../../services/guest';
import { redirectToMenu } from '../../../services/utility';
import { yellowBaseColor } from '../../../constants/theme-colors';

const useStyles = makeStyles(theme => ({
  thisRoot: {
    textAlign: 'left'
  },
  MuiGridContainer: {
    display: 'block',
    marginTop: '3em'
  },
  thisTextField: {
    marginBottom: '0.5em',
    width: '100%',
    borderColor: '#297fca !important'
  },
  header: {
    borderBottom: '1px solid ' + theme.palette.border.guestBorder,
    backgroundColor: yellowBaseColor
  },
  headerRightChild: {
    paddingLeft: '1.5em',
    marginBottom: '0.8em',
    marginTop: '1em'
  },
  headerLeftChild: {
    color: theme.palette.text.guestNameText,
    fontSize: theme.typography.guestConfig.fontSize,
    marginLeft: '0.5em',
    marginBottom: '0.8em',
    marginTop: '1em'
  },
  resName: {
    color: theme.palette.text.guestDescription
  },
  tableNo: {},
  description: {
    marginTop: '1em',
    borderBottom: '1px solid' + theme.palette.border.guestBorder,
    textAlign: 'center',
    '& .errorMeg': {
      '& h6': {
        textAlign: 'center',
        marginLeft: '1em'
      },
      '& .MuiTypography-colorTextSecondary': {
        color: theme.palette.text.errorMeg
      }
    }
  },
  desText: {
    color: theme.palette.text.guestDescription,
    marginBottom: '1em'
  },
  formItems: {
    // margin: '0 1.5em',
  },
  leftChild: {
    color: theme.palette.text.guestNameText,
    fontSize: theme.typography.guestConfig.fontSize,
    // fontWeight: 'bold',
    paddingLeft: '1.2em',
    marginBottom: '0.8em',
    marginTop: '0.8em'
  },
  rightChild: {
    paddingRight: '1.2em',
    display: 'flex',
    float: 'right',
    marginBottom: '0.8em',
    marginTop: '0.8em'
  },
  leftChildMale: {
    color: theme.palette.text.guestNameText,
    fontSize: theme.typography.guestConfig.fontSize,
    // fontWeight: 'bold',
    paddingLeft: '1.2em',
    marginBottom: '0.8em',
    marginTop: '1.8em'
  },
  rightChildMale: {
    paddingRight: '1.2em',
    display: 'flex',
    float: 'right',
    marginBottom: '0.8em',
    marginTop: '1.8em'
  },

  elements: {
    border: '1px solid #cccccc',
    borderRadius: '3px',
    padding: '0 3px'
  },
  icons: {
    color: 'rgb(127,129,149)',
    fontSize: 20
  },
  countNo: {
    color: theme.palette.text.secondary,
    fontSize: '22px',
    marginLeft: '0.7em',
    marginRight: '0.7em',
    marginBottom: '0.2em'
  },
  countNoUp: {
    color: theme.palette.text.primary,
    fontSize: '22px',
    marginLeft: '0.7em',
    marginRight: '0.7em',
    marginBottom: '0.2em'
  },

  navBottom: {
    width: '100%',
    background: 'black'
  },
  customerQuestionWrapper: { margin: theme.spacing(1) },
  customerQuestion: {
    color: theme.palette.text.guestDescription,
    display: 'block',
    fontSize: '1rem'
  }
}));

function GuestConfiguration(props) {
  const classes = useStyles();
  const { t } = useTranslation(['orderr']);
  const guestConfig = JSON.parse(getGuestConfigFromSessionStorage());
  const { history, appState, language } = props;
  const dispatch = useDispatch();

  let restaurantTableData = appState.restaurantTable.data;

  let companyId, branchId, tableNumber, restaurantName, sectionName;

  try {
    tableNumber = restaurantTableData.tableNo;
    restaurantName = restaurantTableData.branch.name;
    companyId = restaurantTableData.company.id;
    branchId = restaurantTableData.branch.id;
    sectionName =
      restaurantTableData.section.name[language.code] || '';
    sectionName = sectionName ? ' - ' + sectionName : sectionName;
  } catch (e) {
    console.warn(e);
  }

  let {
    male = 0,
    female = 0,
    kid = 0,
    others = 0
  } = guestConfig ? guestConfig : {};
  const [state, setState] = React.useState({
    male: male,
    female: female,
    kid: kid,
    others: others
  });

  const [errorMeg, setErrorMeg] = useState('');
  const [isReturningCustomer, setIsReturningCustomer] = useState(
    IS_FIRST_VISIT_ANSWER_YES
  );

  const handleRemove = index => {
    if (index === 'male') {
      if (state.male !== 0) {
        setState({
          ...state,
          male: state.male - 1
        });
      }
    }
    if (index === 'female') {
      if (state.female !== 0) {
        setState({
          ...state,
          female: state.female - 1
        });
      }
    }
    if (index === 'others') {
      if (state.others !== 0) {
        setState({
          ...state,
          others: state.others - 1
        });
      }
    }
    if (index === 'kid') {
      if (state.kid !== 0) {
        setState({
          ...state,
          kid: state.kid - 1
        });
      }
    }
  };

  const handleAdd = index => {
    if (index === 'male') {
      setState({
        ...state,
        male: state.male + 1
      });
    }
    if (index === 'female') {
      setState({
        ...state,
        female: state.female + 1
      });
    }
    if (index === 'others') {
      setState({
        ...state,
        others: state.others + 1
      });
    }
    if (index === 'kid') {
      setState({
        ...state,
        kid: state.kid + 1
      });
    }
  };

  function handleCustomerQuestion(event) {
    setIsReturningCustomer(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (
      state.male === 0 &&
      state.female === 0 &&
      state.kid === 0 &&
      state.others === 0
    ) {
      setErrorMeg(t('common:requiredValidationGuestConfig'));
    } else {
      setGuestConfigToSessionStorage(state);
      const firstVisitQAPayload = {
        companyId,
        branchId,
        questionKey: IS_FIRST_VISIT,
        answerValue: isReturningCustomer
      };

      await isFirstVisitQA(firstVisitQAPayload);

      let response = await getRecommendedMenus(
        companyId,
        branchId,
        language.code
      );

      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        //redirect to recommneded
        history.push(`/recommended`);
      } else {
        redirectToMenu(history);
      }
    }
  }
  return (
    <div className={classes.thisRoot}>
      <Suspense fallback={<NxtFallback />}>
        <Grid className={classes.header} container direction='row'>
          <Grid
            container
            className={classes.headerLeftChild}
            justify='flex-start'
            item
            xs={2}
            spacing={2}
          >
            <IconButton onClick={() => history.goBack()}>
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid
            container
            className={classes.headerRightChild}
            justify='flex-start'
            item
            xs={10}
            spacing={2}
          >
            <Grid className={classes.resName} container direction='row'>
              <IxTitle variant='caption'>
                {restaurantName + sectionName}
              </IxTitle>
            </Grid>
            <Grid className={classes.tableNo} container direction='row'>
              <IxTitle variant='h5'>{t('tableName') + tableNumber}</IxTitle>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.description} container direction='row'>
          <Box className={classes.desText}>{t('guestConfigDescription')}</Box>
          <IxTxtBox
            className='errorMeg'
            secondary={errorMeg}
            secondaryVariant='subtitle2'
          ></IxTxtBox>
        </Grid>
        <Box className={classes.formItems}>
          <form onSubmit={handleSubmit}>
            <Grid container direction='row'>
              <Grid
                container
                className={classes.leftChildMale}
                justify='flex-start'
                item
                xs={6}
              >
                {t('guestConfigMaleLabel')}
              </Grid>
              <Grid
                container
                className={classes.rightChildMale}
                justify='flex-end'
                item
                xs={6}
                spacing={2}
              >
                <Box className={classes.elements}>
                  <Icon
                    onClick={() => handleRemove('male')}
                    className={classes.icons}
                  >
                    remove
                  </Icon>
                  {state.male === 0 ? (
                    <Box component='span' className={classes.countNo}>
                      {state.male}
                    </Box>
                  ) : (
                    <Box component='span' className={classes.countNoUp}>
                      {state.male}
                    </Box>
                  )}

                  <Icon
                    onClick={() => handleAdd('male')}
                    className={classes.icons}
                  >
                    add
                  </Icon>
                </Box>
              </Grid>
            </Grid>
            <Divider />
            <Grid container direction='row'>
              <Grid
                container
                className={classes.leftChild}
                justify='flex-start'
                item
                xs={6}
              >
                {t('guestConfigFemaleLabel')}
              </Grid>
              <Grid
                container
                className={classes.rightChild}
                justify='flex-end'
                item
                xs={6}
                spacing={2}
              >
                <Box className={classes.elements}>
                  <Icon
                    onClick={() => handleRemove('female')}
                    className={classes.icons}
                  >
                    remove
                  </Icon>
                  {state.female === 0 ? (
                    <Box component='span' className={classes.countNo}>
                      {state.female}
                    </Box>
                  ) : (
                    <Box component='span' className={classes.countNoUp}>
                      {state.female}
                    </Box>
                  )}
                  <Icon
                    onClick={() => handleAdd('female')}
                    className={classes.icons}
                  >
                    add
                  </Icon>
                </Box>
              </Grid>
            </Grid>
            <Divider />
            <Grid container direction='row'>
              <Grid
                container
                className={classes.leftChild}
                justify='flex-start'
                item
                xs={6}
              >
                {t('guestConfigKidLabel')}
              </Grid>
              <Grid
                container
                className={classes.rightChild}
                justify='flex-end'
                item
                xs={6}
                spacing={2}
              >
                <Box className={classes.elements}>
                  <Icon
                    onClick={() => handleRemove('kid')}
                    className={classes.icons}
                  >
                    remove
                  </Icon>
                  {state.kid === 0 ? (
                    <Box component='span' className={classes.countNo}>
                      {state.kid}
                    </Box>
                  ) : (
                    <Box component='span' className={classes.countNoUp}>
                      {state.kid}
                    </Box>
                  )}
                  <Icon
                    onClick={() => handleAdd('kid')}
                    className={classes.icons}
                  >
                    add
                  </Icon>
                </Box>
              </Grid>
            </Grid>
            <Divider />
            <Grid container direction='row'>
              <Grid
                container
                className={classes.leftChild}
                justify='flex-start'
                item
                xs={6}
              >
                {t('guestConfigOthersLabel')}
              </Grid>
              <Grid
                container
                className={classes.rightChild}
                justify='flex-end'
                item
                xs={6}
                spacing={2}
              >
                <Box className={classes.elements}>
                  <Icon
                    onClick={() => handleRemove('others')}
                    className={classes.icons}
                  >
                    remove
                  </Icon>
                  {state.others === 0 ? (
                    <Box component='span' className={classes.countNo}>
                      {state.others}
                    </Box>
                  ) : (
                    <Box component='span' className={classes.countNoUp}>
                      {state.others}
                    </Box>
                  )}
                  <Icon
                    onClick={() => handleAdd('others')}
                    className={classes.icons}
                  >
                    add
                  </Icon>
                </Box>
              </Grid>
            </Grid>
            <Divider />

            {/* <Box className={classes.customerQuestionWrapper}>
              <Typography
                variant="caption"
                className={classes.customerQuestion}
              >
                {t('orderr:IsCustomerReturningSurveyQuestion')}
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="isReturningCustomer"
                  name="isReturningCustomer"
                  value={isReturningCustomer}
                  onChange={handleCustomerQuestion}
                  color="primary"
                >
                  <FormControlLabel
                    value={IS_FIRST_VISIT_ANSWER_YES}
                    control={<Radio color="primary" />}
                    label={t('orderr:Yes')}
                  />
                  <FormControlLabel
                    value={IS_FIRST_VISIT_ANSWER_NO}
                    control={<Radio color="primary" />}
                    label={t('orderr:No')}
                  />
                </RadioGroup>
              </FormControl>
            </Box> */}

            <Grid className={classes.navBottom} container direction='row'>
              <BasicBottomLinks
                history={history}
                rightChildText={t('Continue')}
                isSubmit={true}
              ></BasicBottomLinks>
            </Grid>
          </form>
        </Box>
      </Suspense>
    </div>
  );
}

const mapStateToProps = ({ appState, language }) => {
  return { appState, language };
};
const mapDispatchToProps = dispatch => {
  return {
    addOrderGuests: guests => dispatch(addOrderGuests(guests))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GuestConfiguration);

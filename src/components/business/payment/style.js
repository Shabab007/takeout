import { makeStyles } from '@material-ui/styles';

const styles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    height: `calc(100% - 140px)`,
    '& h4': {
      fontSize: '2rem',
      textAlign: 'center',
      color: theme.palette.text.commonSecondary,
    },
  },
  orderNumber: {
    marginTop: '0.5em',
  },
  orderDescription: {
    marginBottom: '2em',
    padding: '0 1em',
  },
  paymentMethods: {
    '& .MuiBox-root': {
      width: '100%',
      maxWidth: '100%',
    },
    '& .MuiButtonBase-root': {
      marginBottom: '7px',
      height: '5em',
    },
    paddingBottom: '6em',
  },
  btnPaymentSubmit: {
    marginTop: '1em',
  },
  orderResultMessageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    //paddingTop: theme.spacing(8),
    '& .MuiTypography-colorTextPrimary': {
      fontSize: '1.5em',
      fontWeight: theme.typography.body1.fontWeight,
      marginTop: '0.2em',
    },
  },
  orderResultIcon: {
    //marginTop: '0.6em',
    fontSize: '5rem',
    border: '3px solid',
    borderRadius: '50%',
    color: theme.palette.border.successTag,
    //color: 'green',
  },
  transactionRef: {
    padding: '1.2em',
    color: theme.palette.text.commonSecondary,
    margin: '1.5em 0.8em',
    // border: '1px solid' + theme.palette.text.commonSecondary,
    border: '1px solid #7f8195',
    borderRadius: '5px',
  },
  btnBottom: {
    position: 'fixed',
    bottom: '0',
    paddingRight: '2em',
    marginBottom: '2em',
  },
  nxtBtnPrimary: {
    marginBottom: '0.5em',
  },
  formContainer: {
    // marginBottom: '100px',
  },
  paymentMethodsWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  SupportedPaymentMethodsWrapper: {
    marginBottom: '52px',
  },
  priceDisplayRoot: {
    textAlign: 'center',
  },
  priceDisplayRow: {
    justifyContent: 'center !important',
  },
  priceDisplayClassName: {
    fontSize: '1.5rem',
  },
  priceDisplaySuffixClassName: {
    fontSize: '1rem',
  },
  tipsButtonContainer: {
    overflowY: 'auto', 
    width:'auto', 
    height: '45%',
    paddingLeft: '1.4em',
    '& .MuiRadio-colorPrimary.Mui-checked': {
      color: '#000000'
    },
    '& .MuiFormLabel-root': {
      color: 'rgb(127,129,149)'
    }
  },
  tipHeader: {
    paddingTop: '1em',
    paddingBottom: '1.5em',
    paddingLeft: '1.4em'
  },
  tipReceiverTitle: {
    paddingTop: '1em',
    paddingBottom: '1em'
  },
  staffTextField: {
    width: 310
  }
}));

export default styles;

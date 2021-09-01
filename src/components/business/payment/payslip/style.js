import { makeStyles } from '@material-ui/styles';

const styles = makeStyles((theme) => ({
  root: {
    margin: '1em',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Oswald,sans-serif',

    flexGrow: 1,
    '& .tradeMark': {
      padding: '0 15%',
    },
    '& .logo': {
      width: '80%',
      float: 'left',
    },
    '& .companyDetails': {
      padding: '1em 1%',
    },
    '& .items': {
      fontSize: '0.9em',
      '& h6': {
        fontSize: '1em', /////////////////////////////
      },
    },
    '& .information': {
      fontWeight: 'bold',
      marginBottom: '0.5em',
    },
    '& .informationRes': {},
    '& .informationOrderNo': { textTransform: 'capitalize' },
    '& .tableNo': {
      textTransform: 'capitalize',
      paddingBottom: '0.2em',
    },
    '& .space2': {
      ////////////
      textTransform: 'lowercase',
      paddingLeft: '0.5em',
    },
    '& .tableNoNo': {},
    '& .tableDateTime': {},
    '& .borderTopSingle': {
      borderTop: '1px solid rgba(0,0,0,0.54)',
      // borderTop: '1px solid ' + theme.palette.text.commonSecondary,
    },
    '& .borderTopDouble': {
      borderTop: '2px solid rgba(0,0,0,0.54)',
      // borderTop: '2px solid ' + theme.palette.text.commonSecondary,
    },
    '& .foodItem': {},
    '& .foodItemTitle': {
      fontWeight: 'bold',
      marginTop: '0.3em',
    },
    '& .foodItemDineTitle': {
      marginTop: '1em',
      marginBottom: '0.3em',
      fontWeight: 'bold',
    },

    '& .itemPrice': {},
    '& .subtotalCharges': {
      '& .MuiTypography-root': {
        marginTop: '-0.2em',
      },
    },
    '& .allYouCanEatItemsRow': {
      marginBottom: '0.5em',
      width: '100%',
    },
    '& .allCalculation': {
      fontSize: '0.8em',
      // marginTop: '0.2em',
      marginLeft: '0.2em',
      marginRight: '0.2em',
    },
    '& .operants': {
      marginTop: '0.4em',
    },
    '& .allCalculationItemPrice': {
      '& .MuiTypography-root': {
        fontSize: '1.1em',
        fontWeight: 'bold',
      },
    },
    '& .allCalculationItemTotalPrice, .subtotal': {
      '& .MuiTypography-root': {
        fontWeight: '600',
      },
    },
    '& .paidTotal': {
      fontSize: '1.2em',
    },
    '& .totalPrice': {
      '& .MuiTypography-root': {
        fontSize: '1.1em',
        fontWeight: '800',
      },
    },
    '& .footer': {
      fontSize: '0.8em',
    },
    '& .footerRefNo': {},
    '& .refText': {
      textTransform: 'capitalize',
    },
    '& .footerSign': {},
    '& .signText': {},
  },
  // paper: {
  //   padding: theme.spacing(2),
  //   textAlign: 'center',
  //   color: 'rgb(127,129,149)',
  // },
}));

export default styles;

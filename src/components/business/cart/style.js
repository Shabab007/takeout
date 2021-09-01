import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    // height: '100vh',
    position: 'relative',
    '& .footerBtns': {
      '& .MuiButtonBase-root': {
        textTransform: 'uppercase',
        fontSize: '1em',
        height: '3.2em',
      },
      '& .MuiTouchRipple-root': {
        border: 'none',
      },
      '& .MuiButton-outlined.Mui-disabled': {
        border: 'none',
      },
    },
  },
  body: {
    marginTop: theme.spacing(7),
    // height: '100%',
    '& .MuiTouchRipple-root': {
      border: 'none',
    },
  },
  orderDetailBody: {
    marginTop: theme.spacing(7),
    // paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(2),
    height: '100%',
    '& .MuiTouchRipple-root': {
      border: 'none',
    },
  },
  orderBtnRoot: {
    fontSize: '1em',
  },

  myDiolog: {
    '& .MuiDialogActions-root': {
      justifyContent: 'center',
    },
  },
  orderNumberWrapper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderBottom: '1px solid ' + theme.palette.border.primary + ' !important',
  },
  cartItemsWrapper: {
    '& .groupHeader': {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(2.5),
      paddingBottom: theme.spacing(1),
      background: theme.palette.background.cartHeader,
      '& h6': {
        textAlign: 'left',
        // paddingLeft: '1em',
      },
    },
  },
  packageMenuHeaderLeftPart: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  packageMenuHeaderRightPart: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  packageMenuPriceDisplayRow: {
    justifyContent: 'flex-start !important',
  },
  packageMenuTotalPriceDisplayRow: {
    justifyContent: 'flex-end !important',
  },
  packageMenuRemoveBtn: {
    width: theme.spacing(5),
    paddingTop: 0,
  },
  cartItemBorder: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    // borderBottom: '1px solid',
    // borderBottomColor: theme.palette.border.primary,
    '&:last-of-type': {
      // borderBottom: '1px solid',
      // borderBottomColor: theme.palette.border.primary,
    },
    '& .itemPropertiesWrapper': {
      marginLeft: '2.3em',
      marginBottom: '0.5em',
    },
    '& .cartBorder': {
      borderBottom: '2px solid',
      borderBottomColor: theme.palette.border.primary,
      paddingTop: '0.5em',
      paddingBottom: '0.5em',
    },
  },
  orderedItemBorder: {
    // padding: theme.spacing(2),
    // borderTop: '1px solid',
    // borderTopColor: theme.palette.border.primary,

    '& .cartBorder': {
      borderBottom: '2px solid',
      borderBottomColor: theme.palette.border.primary,
      paddingTop: '0.5em',
      paddingBottom: '0.5em',
    },
  },
  orderedItemsWrapper: {
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(2),
    '& .orderedItemsHeader': {},
    '& .MuiPaper-root': {
      border: 'none',
    },
    '& .collapsPanelRoot': {
      width: '106%',
      marginLeft: '-0.8em',
      background: theme.palette.background.cartHeader,
      '& .cartBorder': {
        margin: '0 1.2em',
        borderBottom: '2px solid white',
        // borderBottomColor: theme.palette.border.white,
        paddingTop: '0.5em',
        paddingBottom: '0.5em',
      },
    },
  },
  summaryWrapper: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(20),
  },
  total: {
    paddingBottom: theme.spacing(2),
  },
  emptyCartMessage: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(5),
  },
  updateSection: {
    display: 'flex',
    width: '100%',
  },
  progressSpinner: {
    position: 'fixed',
    top: 'calc(50% - 20px)',
    left: 'calc(50% - 20px)',
    zIndex: theme.zIndex.progressSpinner,
  },
  noOrderMessageWrapper: {
    paddingTop: theme.spacing(3),
    width: '100%',
    textAlign: 'center',
  },
  summaryRow: {
    display: 'flex',
    // flexDirection: 'column',
    justifyContent: 'space-between',
  },
  totalLabel: {},
  priceDisplayRoot: {
    textAlign: 'center',
  },
  priceDisplayRow: {
    justifyContent: 'flex-end !important',
  },
  priceDisplayClassName: {
    fontSize: '1.1rem',
  },
  priceDisplaySuffixClassName: {
    fontSize: '.9rem',
  },
  subtotalDisplayClassName: {
    fontSize: '.9rem !important',
  },
  subtotalDisplaySuffixClassName: {
    fontSize: '.7rem !important',
  },
  subtotalDisplayRow: {
    justifyContent: 'flex-end !important',
  },
  allYouCanEatPriceDisplayClassName: {
    fontSize: '.9rem',
  },
  allYouCanEatPriceDisplaySuffixClassName: {
    fontSize: '.7rem',
  },
}));

export default useStyles;

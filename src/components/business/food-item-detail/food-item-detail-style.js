import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    position: 'relative',
    '& .MuiTab-textColorPrimary': {
      textTransform: 'capitalize',
    },
  },
  bodyWrapper: {
    marginTop: theme.spacing(11),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(16),

    '& .MuiTab-root': {
      padding: '6px 8px',
      minHeight: '32px',
      marginTop: '0.8em',
    },
  },
  attributesWrapper: {
    marginTop: '1em',
    [theme.breakpoints.up("sm")]: {
      marginTop: '1.4em'
    },
    display: 'flex',
    // alignItems: 'center',
    borderBottom: '2px solid',
    borderBottomColor: theme.palette.border.primary,
    marginBottom: theme.spacing(1),
    width: '100%',
    marginLeft: '-1em',
    paddingRight: '2em',
    position: 'fixed',
    zIndex: 9000,
    background: '#ffffff'
  },
  itemDescription: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(10),
  },
  itemName: {
    fontSize: '20px !important',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  attributeItem: {
    paddingRight: theme.spacing(2),
    marginLeft: '1em',
  },
  footerButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cancelBtnRoot: {
    fontSize: '1em',
    border: 'none',
    textTransform: 'uppercase',
  },
  OkBtnRoot: {
    fontSize: '1em',
    textTransform: 'uppercase',
    height: '2.78em !important',
  },
  counterWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  count: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  countText: { paddingRight: theme.spacing(1) },
  countButton: {},
  tabContentWrapper: {
    minHeight: theme.spacing(25),
    paddingTop: theme.spacing(2),
  },
  priceDisplayRoot: {
    textAlign: 'left',
    marginLeft: '1rem',
  },
  priceDisplayRow: {
    justifyContent: 'flex-start !important',
  },
  priceDisplayClassName: {
    fontSize: '.9rem',
  },
  priceDisplaySuffixClassName: {
    fontSize: '.7rem',
  },
  totalPriceDisplayClassName: {
    fontSize: '1.2rem',
  },
}));

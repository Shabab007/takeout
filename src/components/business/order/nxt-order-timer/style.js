import { makeStyles } from '@material-ui/styles';

const styles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    height: `calc(100% - 140px)`,
    // height: '100vh',
    // paddingTop: theme.spacing(7),
    // paddingBottom: theme.spacing(8.5),
    // margin: '0 1em',
    '& .MuiTypography-body1': {
      color: theme.palette.text.commonSecondaryColor,
      marginBottom: '0.5em',
    },
  },

  bodyWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  guests: {
    // marginTop: '5em',
    '& .MuiTypography-h6': {
      fontWeight: theme.typography.body1.fontWeight,
    },
    '& .MuiTypography-subtitle1': {
      fontSize: '1em',
      color: 'red',
    },
  },

  bottomNav: {
    bottom: '0',
    position: 'fixed',
    width: '105%',
    marginLeft: '-1.7em',
    zIndex: theme.zIndex.bottomNav,
  },
  order: {
    marginTop: '1.5em',
    marginBottom: '1.2em',
  },
  countUpTimer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    color: theme.palette.text.commonSecondaryColor,
    fontSize: '1.5em',
    display: 'flex',
    textAlign: 'center',
  },
  btnReorder: {
    height: '3.2em',
  },
  buttonGd: {
    marginBottom: '0.5em',
    '& button': {
      width: '100%',
    },
  },

  dialog: {
    marginTop: '2em',
  },
  noOrderMessage: {
    margin: '2rem .5rem',
    textAlign: 'center',
  },
  createOrderBtnWrapper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  statusWrapper: {
    marginBottom: '2rem',
  },
}));

export default styles;

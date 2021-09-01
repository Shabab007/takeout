import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    minWidth: 0,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  gridContainer: {
    display: 'block',
  },
  logo: {
    display: 'block',
    width: '40%',
    // height: '150px',
    marginTop: '10em',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  greeting: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    '& .MuiTypography-colorTextSecondary': {
      color: theme.palette.text.commonPrimaryColor,
      fontSize: theme.typography.common.descriptionTextSize,
    },
  },
  footer: {
    position: 'fixed',
    bottom: '0',
    paddingBottom: '4em',
  },
  continueButton: {
    marginTop: '13em',
  },
  footerText: {
    textAlign: 'center',
    color: theme.palette.text.commonSecondaryColor,
    marginTop: theme.spacing(4),
  },
  companyBackLink: {
    color: '#fff',
  },
}));

export default useStyles;

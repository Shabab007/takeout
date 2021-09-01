import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  bodyWrapper: {
    height: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  logoWrapper: {
    width: '100%',
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    display: 'block',
    width: '40%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  subtitle: {
    minHeight: '3rem',
    paddingTop: '1em'
  },
  languageChoiceWrapper: {
    width: '100%',
    flexGrow: 1,
  },
  iconFlags: {
    fontSize: '1.25rem',
    width: '1rem',
    height: '1rem',
  },
  continueButton: {
    marginBottom: theme.spacing(2),
  },
}));

export default useStyles;

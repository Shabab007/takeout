import { makeStyles } from '@material-ui/styles';
import {
  menuDetailsHeaderBackground,
  whiteBaseColor,
  categoryDetailsTextColor,
  categoryDetailsFilterTitle,
} from '../../../../constants/theme-colors';

const styles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    '& .MuiTabs-scroller, .MuiTabs-scrollable': {
      //marginBottom: '1em !important',
    },
    '& .MuiTab-textColorPrimary': {
      //color: theme.palette.text.commonPrimaryColor,
      textTransform: 'capitalize',
    },
  },
  packageMenuPreOrderStyle: {
    backgroundColor: 'rgba(0,0,0,.1)',
  },

  bottomNav: {
    position: 'fixed',
    width: '100%',
    bottom: '0',
    zIndex: theme.zIndex.bottomNav,
  },
  headerItem: {
    backgroundColor: menuDetailsHeaderBackground,

    '& button, .makeStyles-searchIcon-146': {
      color: whiteBaseColor,
    },
    '& h6': {
      color: whiteBaseColor,
    },
    '& span': {
      color: whiteBaseColor,
    },
    '& .MuiAvatar-root': {
      width: '50px',
      height: '50px',
      marginLeft: '0.8em',
      marginBottom: '0.7em',
      marginTop: '0.8em',
    },
  },
  topBarIconButtons: {
    width: '100%',
    '& .MuiBox-root': {
      position: 'static',
      backgroundColor: menuDetailsHeaderBackground,
    },
  },
  topMenuFixed: {
    position: 'fixed !important',
    backgroundColor: 'green !important',
  },
  menuTitleRight: {
    //marginLeft: '1.5em',
    marginTop: '1em',
    '& h6': {
      fontSize: '1.2rem',
    },
    '& .MuiTypography-caption': {
      opacity: '0.8',
    },
  },
  filterTitle: {
    color: categoryDetailsFilterTitle,
  },
  filterModal: {
    color: categoryDetailsTextColor,
  },
  filterItems: {
    marginTop: '65px', 
    whiteSpace: 'nowrap'
  },
  bodyCat: {
    //marginLeft: '1em',
    //marginRight: '1em',
    paddingBottom: '5em',
    '& .MuiTab-root': {
      padding: '0 8px',
      minHeight: '32px',
      marginTop: '0.8em',
    },
    '& .MuiTab-wrapper': {
      //minWidth: '55px',
    },
  },

  categoryTitle: {
    color: categoryDetailsTextColor,
    marginTop: '1em',
    marginBottom: '1em',
  },

  bodySubCat: {
    marginTop: '0.8em',
    marginBottom: '0.8em',
    padding: '0.1em',
  },
  foodItemRow: {
    marginTop: '0.6em',
    marginBottom: '0.6em',
    // '& .MuiTypography-h6': {
    //   color: menuItemTitleColor,
    //   fontWeight: '400',
    // },
    '& img': {
      borderRadius: '8px',
    },
    ' & .MuiGrid-root': {
      border: 'none',
    },
  },
  menuTextBox: {
    '& span': {
      marginTop: '-0.5em',
    },
    marginBottom: '0.5em',
  },
  foodItemWrapperInListPage: {
    minHeight: '300px',
  },
  items: {
    // height: 'auto',
    // overflowY: 'scroll',
  },
  searchOption: {
    width: '88%',
  },
  searchCloseIcon: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  searchHeader: {
    position: 'fixed',
    top: '0',
    marginBottom: '1em',
    background: 'white',
    zIndex:9999
  },
  searchResults: {
    marginTop: '4.5em',
  },
  searchBottomNav: {
    bottom: '0',
    position: 'fixed',
    width: '100%',
    // marginTop: window.innerHeight - 60 + 'px',
    // marginLeft: '-0.7em',
  },

  menuView: {},
}));

export default styles;

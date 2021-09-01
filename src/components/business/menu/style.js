import { makeStyles } from '@material-ui/styles';

const styles = makeStyles((theme) => ({
  topMnueRoot: {
    '& .MuiSvgIcon-root': {
      marginLeft: '0.1em',
    },
  },
  searchHeader: {
    marginLeft: '0.7em',
  },
  navRight: {
    '& .MuiGrid-root': {
      textAlign: 'right',
      float: 'right',
      width: '100%',
      background: 'white',
    },
    '& .MuiBox-root': {
      marginLeft: '-0.5em',
    },
  },
  menuHomePageTitle: {
    width: '100%',
  },
  titleGd: {
    marginTop: '3.5em',
    '& h5': {
      marginLeft: '0.8em',
      color: theme.palette.text.commonPrimaryColor,
    },
    '& h6': {
      marginLeft: '0.5em',
      fontSize: '20px',
    },
  },
  topDivider: {
    marginTop: '2em',
  },
  itemCardWrapper: {
    display: 'block !important',
    marginRight: theme.spacing(1),
    border: '1px solid rgb(204,204,204) !important',
    borderRadius: '5px',
    height: 'calc(100% - 2px)',
    overflow: 'hidden',
    // '& img': {
    //   borderTopLeftRadius: '5px',
    //   borderTopRightRadius: '5px',
    // },

    '&:last-of-type': {
      marginRight: 0,
    },
    '& .itemTg': {
      borderBottomLeftRadius: '5px',
      borderBottomRightRadius: '5px',
    },

    '& .MuiBox-root': {
      borderRadius: '5px',
      height: '100%',
      marginRight: theme.spacing(1),
    },
    '& .MuiGrid-item, .MuiBox-root': {
      width: '100% !important',
    },
    '& .view-all-wrapper': {
      padding: '.2em',
      height: '100%',
      width: '100%',
      boxSizing: 'border-box',
      '& .view-all': {
        borderRadius: '3px',
        textAlign: 'center',
        flex: 1,
        height: 'calc(100% - 1px)',
        position: 'relative',
        top: '1px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
      },
    },
  },
  foodItemListWrapper: {
    marginBottom: '0.4em',
    '& > div': {
      width: '100%',
    },
  },
  itemTags: {
    background: 'red',
  },
  bottomNav: {
    bottom: '0',
    position: 'fixed',
    width: '100%',
    marginLeft: '0em',

    zIndex: theme.zIndex.bottomNav,
  },
  menuCard: {
    //marginLeft: theme.spacing(1),
    //marginRight: theme.spacing(1),
    //paddingTop: '0.2em',

    '&  h6, h5': {
      fontSize: '8px !important',
      marginLeft: '0 !important',
      paddingLeft: '0 !important',
    },
    '&  .makeStyles-captionWrapper-211': {
      //need to change this class name
      marginLeft: '0.1em !important',
      paddingLeft: '0.1em !important',
    },

    '& .MuiTypography-h5, .MuiTypography-h6': {
      fontWeight: 'bold !important',
      textAlign: 'left',
    },

    paddingBottom: '5em',
  },
  recommendedCard: {
    paddingTop: '4em'
  },
  recommendedTitle: {
    textAlign: 'left', 
    padding: '40px 0 40px 8px',
    fontSize: '20px'
  },
  menuTitleGd: {
    marginTop: '0.1em !important',
    '& h5': {
      color: theme.palette.text.commonSecondary,
      fontWeight: 'bold !important',
      fontSize: '14px !important',
    },
  },
  links: {
    zIndex: theme.zIndex.menuCategoryExpandButton,
    '& span': {
      color: 'red',
    },
    '& .MuiButton-root': {
      fontSize: '11px',
    },
  },
  catCard: {
    width: `100%`,
    //height: window.innerHeight + 80 + 'px',
    height: 'auto',
    //overflowY: 'scroll',
    marginTop: '0.5em',

    '& .MuiGrid-container': {
      // marginTop: '-0.4em',
      '& .MuiTypography-colorTextSecondary a': {
        color: 'red !important',
      },
    },
    '&  h6, h5': {
      fontSize: '10px !important',
      marginLeft: '0.1em !important',
      paddingLeft: '0.1em !important',
    },
    '&  .makeStyles-captionWrapper-211': {
      marginLeft: '0 !important',
      paddingLeft: '0 !important',
    },
    '& .MuiGrid-root': {
      // padding: '0.15em !important',
      // marginBottom: '0.3em',
    },
    '& .MuiTypography-h5, .MuiTypography-h6': {
      fontWeight: 'bold !important',
      fontSize: '12px !important',
    },
    '& .MuiBox-root': {
      border: 'none !important',
    },
  },
  menuGdCat: {
    border: '1px solid red',
  },
  swipableViewRow: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  previouslyOrderedTitle: {
    paddingBottom: '.4rem',
  },
  menuCardWrapper: {
    // justifyContent: 'space-between'
    width: '100%',
    height: '100%',
    marginTop: '3rem'
  },
  recommendedMenuCardWrapper: {
    paddingTop: '0.7em',
    width: '100%',
    height: '100%',
  },
  menuCardItem: {
    marginBottom: '.5rem',
    display: 'block !important',
  },
}));

export default styles;

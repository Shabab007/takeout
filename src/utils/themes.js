import { createMuiTheme } from '@material-ui/core/styles';

import { yellowBaseColor } from '../constants/theme-colors';

const defaultTheme = createMuiTheme();

export const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: yellowBaseColor
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: '#0066ff',
      main: 'rgb(255,255,255)',
      // dark: will be calculated from palette.secondary.main,
      contrastText: yellowBaseColor
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    text: {
      primary: 'rgb(17,17,17)',
      secondary: 'rgb(127,129,149)',
      white: 'rgb(255,255,255)',
      tag: 'RGB(57,181,74)',
      errorMeg: 'red',
      guestNameText: 'rgba(0,0,0,0.87)',
      guestDescription: 'rgba(0,0,0,0.54)',
      commonPrimaryColor: 'rgba(0,0,0,0.87)',
      commonSecondaryColor: '#7f8195',
      commonSecondary: 'rgba(0,0,0,0.54)' //menu title , 15 Min, bottom nav, food item description
    },
    background: {
      default: 'rgb(255,255,255)',
      white: 'white',
      paper: 'rgb(242,242,242)',
      light: 'rgba(255,83,83,.3)',
      cartHeader: '#f2f2f2',
      imgCaption: 'rgba(57,181,74, .7)',
      successTag: '#eff9f1',
      orderPlacedTag: '#ecf2f8',
      orderPraparingTag: '#fef6ed'
    },
    border: {
      main: 'rgb(204,204,204)',
      primary: 'rgb(230,230,230)',
      light: 'rgb(224,224,224)',
      guestBorder: '#E0E0E0',
      inputBoxBorder: '#999999',

      successTag: '#39b54a',
      orderPlacedTag: '#1161aa',
      orderPraparingTag: '#f9ac52'
    }
  },
  typography: {
    h1: {},
    h2: {},
    h3: {},
    h4: { fontSize: '1.6rem' },
    h5: { fontSize: '1.4rem', fontWeight: 'bold' },
    h6: { fontSize: '1rem' },
    body1: {
      fontSize: '0.9rem',
      fontWeight: '400'
    },
    body2: {
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    common: {
      descriptionTextSize: '16px'
    },
    guestConfig: {
      fontSize: '16px'
    },
    subtitle1: {
      fontWeight: 'normal',
      fontSize: '.8rem',
      color: 'textSecondary'
    },
    subtitle2: {
      fontSize: '.8rem',
      fontWeight: '500',
      color: 'textSecondary'
    },
    caption: {},
    button: {}
  },
  shape: { borderRadiusPrimary: '3px', borderRadiusSecondary: '5px' },
  zIndex: {
    snackbar: 20000,
    progressSpinner: 10000,
    screenBlocker: 10000,
    menuOnDrawer: 9999,
    drawer: 9000,
    bottomNav: 8000,
    staticNav: 8000,
    modal: 8000,
    menuCategoryExpandButton: 7500,
    packageMenuOrderCard: 7200,
    packageMenuOverlay: 7100,
    body: 7000
  },
  overrides: {
    Body: {
      padding: '15px'
    },
    MuiButton: {
      text: {},
      root: {
        textTransform: 'none',
        '&:hover': {},
        '&:active': {},
        '&:focus': {}
      },
      contained: { height: '3rem' }
    },
    MuiToolbar: {
      gutters: {
        [defaultTheme.breakpoints.up('sm')]: {
          paddingLeft: '16px',
          paddingRight: '16px'
        }
      }
    },
    MuiTab: {
      // root: { textTransform: 'none' },
    }
  }
});

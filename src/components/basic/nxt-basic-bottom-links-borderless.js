import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Icon, Typography } from '@material-ui/core';
import IxButton from './ix-button';

const useStyles = makeStyles((theme) => ({
  root: {
    // borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    //marginLeft: '-7.5em',
    position: 'fixed',
    bottom: '0',
    textTransform: 'uppercase',
    fontSize: '0.2em',
    '& .MuiButtonBase-root': {
      height: '3em',
    },
  },
  btnLinks: {
    display: 'flex',
  },
  leftButtonLinks: {
    display: 'flex',
    marginTop: '5em',
    '& h6': {
      marginTop: '0.25em',
    },
  },
  beforeLink: {
    fontSize: 32,
    marginRight: '0.1em',
  },
  nextLink: {
    fontSize: 32,
    marginLeft: '0.1em',
  },

  leftChild: {
    paddingLeft: '5em',
    '& .MuiBox-root': {
      color: theme.palette.text.secondary,
    },
  },
  rightChild: {
    marginLeft: '-8em',
    '& .MuiButtonBase-root': {
      marginBottom: '0.5em',
    },
    '& h5, h6': {
      textTransform: 'uppercase',
    },
    '& button': {
      paddingRight: '0.1em',
      float: 'right',
      marginTop: '0.5em',
    },
  },
}));

const BasicBottomLinksBorderLess = ({ history, rightChildText, isSubmit, rightChildLink }) => {
  const classes = useStyles();
  const { t } = useTranslation(['common']);
  return (
    <Grid container direction="row" className={classes.root}>
      <Grid container className={classes.leftChild} justify="flex-start" item xs={6}>
        <Box className={classes.leftButtonLinks} onClick={() => history.goBack()}>
          <Icon className={classes.beforeLink}>navigate_before</Icon> <Typography variant="h6"> {t('Back')}</Typography>
        </Box>
      </Grid>
      <Grid container className={classes.rightChild} justify="flex-end" item xs={6}>
        {isSubmit === true ? (
          <IxButton type="submit" variant="contained" color="primary">
            <Box className={classes.btnLinks}></Box>
            <Typography variant="h6">{rightChildText}</Typography>
            <Icon className={classes.nextLink}>navigate_next</Icon>
          </IxButton>
        ) : (
          <IxButton
            onClick={() => {
              history.push(rightChildLink);
            }}
            variant="contained"
            color="primary"
          >
            <Box className={classes.btnLinks}></Box>
            <Typography variant="h6">{rightChildText}</Typography>
            <Icon className={classes.nextLink}>navigate_next</Icon>
          </IxButton>
        )}
      </Grid>
    </Grid>
  );
};

export default BasicBottomLinksBorderLess;

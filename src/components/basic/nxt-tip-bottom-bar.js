import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import { blackLikeBackground } from '../../constants/theme-colors';

const useStyles = makeStyles(theme => ({
  root: {
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    paddingTop: '0.3em',
    position: 'fixed',
    bottom: 56,
    height: '6em',
    whiteSpace: 'nowrap',
    background: blackLikeBackground,
    '& .MuiButtonBase-root': {
      height: '3em'
    },
    zIndex: theme.zIndex.staticNav
  },
  tipBottomChild: {
    display: 'flex',
    fontSize: '0.9em',
    fontWeight: 700
  },

  totalAmount: {
    fontSize: '1em',
    fontWeight: 900,
    paddingLeft: '0.8em',
    paddingRight: '0.8em',
    '& .MuiBox-root': {
      color: theme.palette.text.secondary
    }
  },
  tipBottomParent: {
    paddingLeft: '0.8em',
    paddingRight: '0.8em',
    '& .MuiBox-root': {
      color: theme.palette.text.secondary
    }
  }
}));

const BasicTipBottom = ({ order }) => {
  const classes = useStyles();
  const tipConfig = useSelector(state => state.order.tipConfig);
  const { t } = useTranslation(['common']);
  const { takeAwayTax = 0, eatInTax = 0, payable = 0 } = order ? order : {};
  //let totalAmountIncludingTax = order?.total + tipConfig?.tipAmount;
  let totalAmountIncludingTax = tipConfig?.tipAmount ? payable + tipConfig?.tipAmount : payable;
  let totalAmountExcludingTax = tipConfig?.tipAmount ? (payable - eatInTax - takeAwayTax) + tipConfig?.tipAmount : (payable - eatInTax - takeAwayTax);
  return (
    <Grid container direction='row' className={classes.root}>
      <Grid container direction='row'>
        <Grid
          container
          className={classes.tipBottomParent}
          justify='flex-start'
          item
          xs={6}
        >
          <Box className={classes.tipBottomChild}>{t('orderr:tip')}</Box>
        </Grid>

        <Grid
          container
          className={classes.tipBottomParent}
          justify='flex-end'
          item
          xs={6}
        >
          <Box className={classes.tipBottomChild}>￥{tipConfig.tipAmount}</Box>
        </Grid>
      </Grid>

      <Grid container direction='row'>
        <Grid
          container
          className={classes.tipBottomParent}
          justify='flex-start'
          item
          xs={6}
        >
          <Box className={classes.tipBottomChild}>{t('orderr:total')}</Box>
        </Grid>

        <Grid
          container
          className={classes.totalAmount}
          justify='flex-end'
          item
          xs={6}
        >
          <Box>￥{totalAmountExcludingTax} ({t('withoutTax')})</Box> 
        </Grid>
      </Grid>

      <Grid container direction='row'>
        <Grid
          container
          className={classes.tipBottomParent}
          justify='flex-start'
          item
          xs={6}
        >
          
        </Grid>

        <Grid
          container
          className={classes.totalAmount}
          justify='flex-end'
          item
          xs={6}
        >
          <Box>￥{totalAmountIncludingTax} ({t('withTax')})</Box>
        </Grid>
      </Grid>

    </Grid>
  );
};

export default BasicTipBottom;

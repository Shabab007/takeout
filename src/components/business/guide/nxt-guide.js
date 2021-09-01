import React, { useState } from 'react';
import { makeStyles, Grid, Box, Typography, Icon } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Screen from './screen';
import ScreenPagination from './screen-pagination';
import guideImages from '../../../assets/imgs/guide';
import NxtLayout from '../../composite/nxt-layout';
import IxButton from '../../basic/ix-button';

const useStyles = makeStyles((theme) => ({
  contentRoot: {
    overflowY: 'auto',
    paddingBottom: theme.spacing(3),
  },
  screensContainer: {
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  footerButtons: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(1),
  },
  skipBtnRoot: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
  },
  nextBtnRoot: {
    textTransform: 'uppercase',
    height: '2.5rem',
  },
  nextBtnEndIcon: {
    '& .MuiIcon-root': {
      fontSize: '2rem',
    },
  },
}));

function NxtGuide() {
  const classes = useStyles();
  const { t } = useTranslation(['static']);
  const [screenIndex, setScreenIndex] = useState(0);
  const history = useHistory();

  const guideScreens = [
    {
      id: 0,
      image: guideImages.howToScanGuideImage,
      title: t('static:howToScanGuideTitle'),
      description: t('static:howToScanGuideDescription'),
    },
    {
      id: 1,
      image: guideImages.chooseMenuGuideImage,
      title: t('static:chooseMenuGuideTitle'),
      description: t('static:chooseMenuguideDescription'),
    },
    {
      id: 2,
      image: guideImages.foodServingGuideImage,
      title: t('static:foodServingGuideTitle'),
      description: t('static:foodServingGuideDescription'),
    },
  ];

  function handleNextScreen() {
    if (screenIndex < guideScreens.length - 1) {
      setScreenIndex(screenIndex + 1);
    }
  }

  function redirectToTempScan() {
    history.push('/scan-qr-code');
  }

  return (
    <NxtLayout
      childrenCentered={true}
      footer={
        <Box className={classes.footerButtons}>
          {screenIndex < guideScreens.length - 1 ? (
            <>
              <IxButton onClick={redirectToTempScan} classes={{ root: classes.skipBtnRoot }} variant="text">
                <Typography variant="h6"> {t('static:skip')}</Typography>
              </IxButton>

              <IxButton
                onClick={handleNextScreen}
                variant="contained"
                color="primary"
                classes={{ root: classes.nextBtnRoot, endIcon: classes.nextBtnEndIcon }}
                endIcon={<Icon>navigate_next</Icon>}
              >
                {t('static:next')}
              </IxButton>
            </>
          ) : (
            <IxButton onClick={redirectToTempScan} fullWidth variant="contained" color="primary">
              {t('static:getStarted')}
            </IxButton>
          )}
        </Box>
      }
    >
      <Grid container spacing={0} className={classes.contentRoot} justify="center" alignItems="center">
        <Grid container item justify="center" alignItems="center">
          <SwipeableViews
            enableMouseEvents
            index={screenIndex}
            onChangeIndex={setScreenIndex}
            resistance
            className={classes.screensContainer}
          >
            {guideScreens.map(({ id, image, title, description }) => {
              return <Screen key={id} index={id} image={image} title={title} description={description}></Screen>;
            })}
          </SwipeableViews>

          <ScreenPagination
            values={guideScreens.map((item) => item.id)}
            value={screenIndex}
            handleChange={setScreenIndex}
          ></ScreenPagination>
        </Grid>
      </Grid>
    </NxtLayout>
  );
}

export default NxtGuide;

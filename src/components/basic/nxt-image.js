import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import EcoIcon from '@material-ui/icons/Eco';
import LanguageNamespaces from '../../constants/language-namespaces';
import { useTranslation } from 'react-i18next';
import RenderSmoothImage from './nxt-render-smooth-image';
import RenderSmoothVideo from './nxt-render-smooth-video';

export const FOOD_ITEM_DETAIL = 'foodItemDetail';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    position: 'relative',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    '& img': {
      display: 'block',
      //objectFit: 'contain',
      width: '400px',
      height: '100px',
      maxWidth: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: 0,
      borderRadius: theme.shape.borderRadiusSecondary,
    },
  },
  [FOOD_ITEM_DETAIL]: {
    '& img': {
      height: '300px'
    }
  },
  tagsWrapper: {
    position: 'absolute',
    display: 'flex',
    left: theme.spacing(1),
    bottom: '13px', // theme.spacing(1), todo : fix hardcoded
  },

  tag: {
    color: theme.palette.text.white,
    backgroundColor: theme.palette.background.imgCaption,
    borderRadius: theme.shape.borderRadiusSecondary,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.4),
    paddingBottom: theme.spacing(0.4),
    marginRight: theme.spacing(1),
  },
  soldOutTag: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: theme.palette.text.white,
    backgroundColor: theme.palette.primary.main,
  },
  itemVideoSmall: {
    flex: '.5',
    width: '10rem',
    height: '5rem',
    marginRight: '0.5rem',
  },
  itemVideoLarge: {
    flex: .5,
    width: '100%',
    height: '15rem',
    marginBottom: '3.5rem'
  },
}));

const NxtImage = ({
  src,
  vdo,
  className,
  vdoClassName,
  alt = 'image alt text',
  isHalal,
  isAlcoholAdded,
  isVegetarian,
  isKidItem,
  isSoldOut,
  foodItemDetail
}) => {
  const classes = useStyles();
  const [t] = useTranslation([LanguageNamespaces.menus]);
  return (
    <div className={clsx(classes.root,classes[foodItemDetail])}>
      {/* <img src={src} alt={alt} className={className} /> */}
      {vdo ?
        <RenderSmoothVideo
          className={classes[vdoClassName]}
          videoUrl={vdo}>
        </RenderSmoothVideo> :
        <RenderSmoothImage
          className={className}
          src={src}
          alt={alt}
        ></RenderSmoothImage>
      }
      <div className={classes.tagsWrapper}>
        {isVegetarian && <EcoIcon className={classes.tag} />}
        {isAlcoholAdded && (
          <Typography variant="caption" className={classes.tag}>
            {t('AlcoholAddedLabel')}
          </Typography>
        )}
        {isHalal && (
          <Typography variant="caption" className={classes.tag}>
            {t('Halal')}
          </Typography>
        )}
        {isKidItem && (
          <Typography variant="caption" className={classes.tag}>
            {t('Kid Item')}
          </Typography>
        )}
      </div>
      {isSoldOut && (
        <Typography
          variant="caption"
          className={clsx(classes.tag, classes.soldOutTag)}
        >
          {t('common:SoldOut')}
        </Typography>
      )}
    </div>
  );
};

export default NxtImage;

import React from 'react';
// import { makeStyles } from '@material-ui/core';
import placeholderImage from '../../../src/assets/imgs/common/placeholder-image.png';

// const useStyles = makeStyles((theme) => ({
//   image: {
//   },
// }));

function RenderSmoothImage({ className, src, alt }) {
  //   const classes = useStyles();
  //   const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageLoadError, setImageLoadError] = React.useState(false);

  return (
    <>
      {src ? (
        <img
          src={imageLoadError ? placeholderImage : src}
          alt={alt}
          className={className}
          //   onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoadError(true)}
        />
      ) : (
        <img src={placeholderImage} alt={alt} className={className} />
      )}
    </>
  );
}

export default RenderSmoothImage;

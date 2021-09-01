import React from 'react';
import placeholderImage from '../../../src/assets/imgs/common/placeholder-image.png';

function RenderSmoothVideo({ className, videoUrl }) {

  return (
    <video className={className}
      src={videoUrl ? videoUrl : ""}
      controls={videoUrl}
      autoplay="autoplay">
    </video>
  );
}

export default RenderSmoothVideo;

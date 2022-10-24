import React from 'react'
import { getYoutubeID } from '../../../utils/string'

const Video = ({
  title,
  video,
  width = '100%',
  height = 300,
  style,
  className,
}) => {
  const youtubeID = video ? getYoutubeID(video) : null
  const videoUrl = youtubeID ? `https://www.youtube.com/embed/${youtubeID}` : video
  return (
    <iframe
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      width={width}
      height={height}
      src={videoUrl}
      title={title}
      allowFullScreen
      {...{
        style,
        className
      }}
    />
  )
}

export default Video

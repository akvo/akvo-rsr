import React from 'react'

const Video = ({
  title,
  youtube = null,
  url = null,
  width = '100%',
  height = 300,
  ...props
}) => {
  const videoUrl = youtube && !url ? `https://www.youtube.com/embed/${youtube}` : url
  return (
    <iframe
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      width={width}
      height={height}
      src={videoUrl}
      title={title}
      allowFullScreen
      {...props}
    />
  )
}

export default Video

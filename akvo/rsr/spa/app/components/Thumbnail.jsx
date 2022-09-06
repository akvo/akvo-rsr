import React from 'react'

const getQueryFromStringUrl = url => url.substring(url.indexOf('?') + 1)
  .split('&')
  .reduce(
    (memo, param) => ({
      ...memo,
      [param.split('=')[0]]: param.split('=')[1]
    }),
    {}
  )

const Thumbnail = ({ video, photo, ...props }) => {
  const { v: videoID } = getQueryFromStringUrl(video)
  const imageUrl = videoID
    ? `https://img.youtube.com/vi/${videoID}/0.jpg`
    : photo || 'https://placehold.co/160x160?text=No+image+available'
  return <img src={imageUrl} {...props} />
}

export default Thumbnail

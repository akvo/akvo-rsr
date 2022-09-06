import React from 'react'
import { images } from '../../utils/config'
import { getQueryFromStringUrl } from '../../utils/string'

const YoutubeThumb = ({ url, ...props }) => {
  const { v: videoID } = getQueryFromStringUrl(url)
  const imageUrl = videoID ? `https://img.youtube.com/vi/${videoID}/0.jpg` : images.default
  return <img src={imageUrl} {...props} />
}

export default YoutubeThumb

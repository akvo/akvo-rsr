import React from 'react'
import { images, prefixUrl } from '../../../utils/config'
import YoutubeThumb from '../../components/YoutubeThumb'

const Thumbnail = ({
  video,
  photos,
  photo,
  title,
  width,
  height,
  className,
  videoCaption,
}) => {
  const videoOnly = photos && (video && !photos.length && !photo)
  const firstPhoto = photos ? photos.map((p) => p.photo).slice(0, 1) : images.default
  const url = photo ? `${prefixUrl}${photo.original}` : firstPhoto || images.default
  return videoOnly
    ? (
      <YoutubeThumb
        url={video}
        alt={videoCaption || title}
        {...{
          width,
          height,
          className,
        }}
      />
    )
    : (
      <img
        alt={title}
        src={url}
        {...{
          width,
          height,
          className,
        }}
      />
    )
}

export default Thumbnail

import React from 'react'
import styled from 'styled-components'
import { images, prefixUrl } from '../../../utils/config'
import YoutubeThumb from '../../components/YoutubeThumb'

const Wrapper = styled.div`
  img {
    object-fit: cover;
  }
`

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
  const firstPhoto = photos ? photos.map((p) => p.photo).slice(0, 1).pop() : images.default
  let url = photo ? photo.original : firstPhoto || images.default
  url = (url.indexOf('http') >= 0 || url.indexOf('data') >= 0) ? url : `${prefixUrl}${url}`
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
      <Wrapper>
        <img
          alt={title}
          src={url}
          {...{
            width,
            height,
            className,
          }}
        />
      </Wrapper>
    )
}

export default Thumbnail

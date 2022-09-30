import React from 'react'
import styled from 'styled-components'
import { images, prefixUrl } from '../../../utils/config'
import { getFirstPhoto } from '../../../utils/misc'
import YoutubeThumb from '../../components/YoutubeThumb'

const Wrapper = styled.div`
  img {
    object-fit: cover;
    min-height: 300px;
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
  const firstPhoto = getFirstPhoto(photos)
  const defaultImage = firstPhoto ? firstPhoto.photo : images.default
  let url = (typeof photo === 'object')
    ? photo ? photo.original : defaultImage
    : photo || defaultImage
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

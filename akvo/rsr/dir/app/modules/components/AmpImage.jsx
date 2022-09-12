import React from 'react'
import styled from 'styled-components'

const Image = ({
  src,
  height,
  width,
  alt,
  layout = 'responsive',
  amp = null,
  ...props
}) => {
  return (
    <amp-img
      src={src}
      height={height}
      width={width}
      alt={alt}
      layout={layout}
      {...amp}
    >
      <noscript>
        <img src={src} width={width} height={height} alt={alt} {...props} />
      </noscript>
      <div fallback="fallback">
        <img src={src} width={width} height={height} alt={alt} {...props} />
      </div>
    </amp-img>
  )
}

const Wrapper = styled.div`
  position: relative;
  img {
    border-radius: 4px;
    object-fit: cover;
  }
`

const AmpImage = ({ children, ...props }) => (
  <Wrapper>
    <Image {...props} />
    {children}
  </Wrapper>
)

export default AmpImage

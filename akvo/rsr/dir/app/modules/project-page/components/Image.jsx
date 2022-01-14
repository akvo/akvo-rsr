import React from 'react'

const Image = ({ src, width = 100, height = 150, ...props }) => (
  <div
    style={{
      width,
      height,
      backgroundImage: `url(${src})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}
    {...props}
  />
)

export default Image

import React from 'react'

const Slide = ({ image, index = 1, style }) => (
  <div className="highlight">
    <div
      className="highlight-item"
      style={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style
      }}
    >
      <span className="number">
        <h3>{index}</h3>
      </span>
    </div>
  </div>
)

export default Slide

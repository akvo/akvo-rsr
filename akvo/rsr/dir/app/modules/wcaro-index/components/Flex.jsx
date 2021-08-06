import React from 'react'

export const Flex = ({ left, right, ...props }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ textAlign: 'left', marginRight: '3em', ...props }}>
        {left}
      </div>
      <div style={{ textAlign: 'left' }}>
        {right}
      </div>
    </div>
  )
}

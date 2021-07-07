/* global document */
import React, { useEffect } from 'react'
import { useSpring, animated } from 'react-spring'


export const MobileSlider = ({ children, page }) => {
  if (document.body.clientWidth > 768) {
    return children
  }
  const [xprops, xset] = useSpring(() => ({ transform: 'translateX(0px)' }))
  useEffect(() => {
    xset({ transform: `translateX(${page * -document.body.clientWidth}px)`, config: { tension: 240, friction: 29 } })
  }, [page])
  return (
    <animated.div style={xprops} className="slider-container">
      {children}
    </animated.div>
  )
}

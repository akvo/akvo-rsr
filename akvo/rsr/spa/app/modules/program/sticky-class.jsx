/* global window, document */
import React, { useEffect, useRef } from 'react'

const StickyClass = ({ children, top = 0, offset = 0 }) => {
  const ref = useRef()
  const boolRef = useRef(false)
  const scrollHandler = () => {
    if (window.scrollY + top - offset >= ref.current.offsetParent.parentNode.offsetTop){
      if (!boolRef.current){
        boolRef.current = true
        ref.current.parentNode.classList.add('stuck')
      }
    } else {
      if(boolRef.current){
        boolRef.current = false
        ref.current.parentNode.classList.remove('stuck')
      }
    }
  }
  useEffect(() => {
    document.addEventListener('scroll', scrollHandler)
    return () => {
      document.removeEventListener('scroll', scrollHandler)
    }
  }, [])
  return <div ref={$ref => { ref.current = $ref }}>{children}</div>
}

export default StickyClass

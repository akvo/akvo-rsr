/* global window */
import React, { useEffect, useRef } from 'react'

const topMargin = 6

const Column = ({ children, index, isLast, selected, loading }) => {
  const connectorRef = useRef(null)
  const ulRef = useRef(null)
  const selectedCardRef = useRef(null)
  const nextScrollviewRef = useRef(null)
  const nextColCardsRef = useRef(null)
  const drawConnector = () => {
    if (isLast === false) {
      if (connectorRef.current && nextColCardsRef.current.length > 0) {
        const y1 = selectedCardRef.current.offsetTop + selectedCardRef.current.clientHeight / 2 - ulRef.current.parentNode.scrollTop
        const y2a = - nextScrollviewRef.current.scrollTop + nextColCardsRef.current[0].clientHeight / 2
        const y2b = - nextScrollviewRef.current.scrollTop + nextColCardsRef.current[nextColCardsRef.current.length - 1].offsetTop + nextColCardsRef.current[nextColCardsRef.current.length - 1].clientHeight / 2
        const A = (y1 < y2a ? y1 : y2a) + topMargin
        const B = (y1 > y2b ? y1 : y2b) + topMargin
        const colHeight = window.innerHeight - 177
        const top = A < 0 ? 0 : A
        const height = B - top > colHeight ? colHeight : B - top
        connectorRef.current.style.top = `${top}px`
        connectorRef.current.style.height = `${height}px`
      }
    }
  }
  const handleScroll = ({ target }) => {
    if (target.scrollTop > 10 && !target.parentNode.previousSibling.previousSibling.classList.contains('on')) {
      target.parentNode.previousSibling.previousSibling.classList.add('on')
    } else if (target.scrollTop < 10 && target.parentNode.previousSibling.previousSibling.classList.contains('on')) {
      target.parentNode.previousSibling.previousSibling.classList.remove('on')
    }
    if (!isLast) drawConnector()
  }
  useEffect(() => {
    if (isLast === false) {
      if (connectorRef.current) {
        selectedCardRef.current = ulRef.current.getElementsByClassName('selected')[0]
        if (ulRef.current.parentNode.parentNode.parentNode.nextSibling) {
          nextScrollviewRef.current = ulRef.current.parentNode.parentNode.parentNode.nextSibling.getElementsByClassName('scrollview')[0]
          nextColCardsRef.current = nextScrollviewRef.current.getElementsByClassName('card')
          drawConnector()
          nextScrollviewRef.current.removeEventListener('scroll', drawConnector)
          nextScrollviewRef.current.addEventListener('scroll', drawConnector)
        }
      }
    }
  }, [isLast, loading, selected])
  return (
    <div className="col" style={{ zIndex: 999 - index }}>
      <div className="shade" />
      {index > -1 && <h3>Level {index + 1} projects</h3>}
      {index === -1 && <h3>Programs</h3>}
      <div className="inner">
        <div className="scrollview" onScroll={handleScroll}>
          <ul ref={ulRef}>
            {children}
          </ul>
        </div>
        <div className="connector" ref={connectorRef} />
      </div>
    </div>
  )
}

export default Column

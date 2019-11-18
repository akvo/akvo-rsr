/* global window */
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const topMargin = 6

const Column = ({ children, index, isLast, selected, loading, countryFilter }) => {
  const connectorRef = useRef(null)
  const ulRef = useRef(null)
  const selectedCardRef = useRef(null)
  const nextScrollviewRef = useRef(null)
  const nextColCardsRef = useRef(null)
  const gotoRef = useRef(null)
  const { t } = useTranslation()
  const drawConnector = () => {
    if (isLast === false) {
      if (connectorRef.current && nextColCardsRef.current.length > 0 && selectedCardRef.current) {
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
    if(selectedCardRef.current){
      if ((ulRef.current.parentNode.scrollTop + ulRef.current.parentNode.clientHeight >= selectedCardRef.current.offsetTop) && (ulRef.current.parentNode.scrollTop <= selectedCardRef.current.offsetTop + selectedCardRef.current.clientHeight)){
        // inside: DO NOT SHOW
        if (gotoRef.current.classList.contains('show')){
          gotoRef.current.classList.remove('show')
        }
      }
      else {
        // outside: SHOW
        if (!gotoRef.current.classList.contains('show')) {
          gotoRef.current.classList.add('show')
        }
      }
    }
    if (!isLast) drawConnector()
  }
  useEffect(() => {
    if (isLast === false && connectorRef.current && ulRef.current.parentNode.parentNode.parentNode.nextSibling) {
      selectedCardRef.current = ulRef.current.getElementsByClassName('selected')[0]
      nextScrollviewRef.current = ulRef.current.parentNode.parentNode.parentNode.nextSibling.getElementsByClassName('scrollview')[0]
      nextColCardsRef.current = nextScrollviewRef.current.getElementsByClassName('card')
      drawConnector()
      nextScrollviewRef.current.removeEventListener('scroll', drawConnector)
      nextScrollviewRef.current.addEventListener('scroll', drawConnector)
    } else {
      connectorRef.current.style.height = '0px'
      selectedCardRef.current = null
    }
  }, [isLast, loading, selected, countryFilter])
  useEffect(() => {
    const referenced = ulRef.current.getElementsByClassName('referenced')
    if(referenced.length > 0){
      ulRef.current.parentNode.scroll({ top: referenced[0].offsetTop - 50, behavior: 'smooth' })
    }
  }, [])
  const gotoSelected = () => {
    ulRef.current.parentNode.scroll({ top: selectedCardRef.current.offsetTop - 50, behavior: 'smooth' })
  }
  return (
    <div className="col" style={{ zIndex: 999 - index }}>
      <div className="go-to" ref={gotoRef} onClick={gotoSelected} role="button" tabIndex={-1}>{t('Go to selected')}</div>
      <div className="shade" />
      {index > -1 && <h3>{t('Level {{level}} projects', { level: index + 1 })}</h3>}
      {index === -1 && <h3>{t('Programs')}</h3>}
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
